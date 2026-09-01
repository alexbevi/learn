import { createServer } from "node:http";
import { existsSync } from "node:fs";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import vm from "node:vm";

const root = resolve(new URL("..", import.meta.url).pathname);
const deckId = process.argv[2];
const viewport = { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false };

if (!deckId) {
  console.error("Usage: node scripts/render-deck.mjs <deck-id>");
  process.exit(1);
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function contentType(pathname) {
  const extension = extname(pathname);
  if (extension === ".css") return "text/css";
  if (extension === ".js") return "text/javascript";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  return "text/html";
}

async function loadCatalog() {
  const source = await readFile(join(root, "assets/js/catalog.js"), "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "assets/js/catalog.js" });
  return context.window.LEARN_CATALOG;
}

function localFileForPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const normalized = decoded.endsWith("/") ? `${decoded}index.html` : decoded;
  return join(root, normalized.replace(/^\/+/, ""));
}

async function startLocalServer() {
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const file = localFileForPath(url.pathname);
    if (!file.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    try {
      const body = await readFile(file);
      response.writeHead(200, { "content-type": contentType(file) });
      response.end(body);
    } catch {
      response.writeHead(404, { "content-type": "text/plain" });
      response.end("Not found");
    }
  });
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  return server;
}

function chromeExecutable() {
  const candidates = [
    process.env.LEARN_CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate));
}

async function waitForFile(path, child) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (existsSync(path)) return;
    if (child.exitCode !== null) {
      throw new Error(`Chrome exited before opening its debugging port with code ${child.exitCode}`);
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  throw new Error("Timed out waiting for Chrome to open its debugging port");
}

class CdpClient {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
    this.waiters = new Map();
  }

  async open() {
    await new Promise((resolveOpen, rejectOpen) => {
      this.socket.addEventListener("open", resolveOpen, { once: true });
      this.socket.addEventListener("error", rejectOpen, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
        else pending.resolve(message.result);
        return;
      }
      const waiter = this.waiters.get(message.method);
      if (waiter) {
        this.waiters.delete(message.method);
        waiter(message.params);
      }
    });
  }

  call(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolveCall, rejectCall) => {
      this.pending.set(id, { resolve: resolveCall, reject: rejectCall, method });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  waitFor(method) {
    return new Promise((resolveEvent) => this.waiters.set(method, resolveEvent));
  }

  close() {
    this.socket.close();
  }
}

async function evaluate(client, expression) {
  const result = await client.call("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || "Browser evaluation failed");
  }
  return result.result.value;
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "slide";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function run(command, args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, { cwd: root, stdio: "ignore" });
    child.on("error", rejectRun);
    child.on("close", (code) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function createContactSheet(outputDir, slides) {
  const cards = slides.map((slide) => `
    <figure class="${slide.findings.length ? "has-findings" : ""}">
      <img src="${escapeHtml(slide.file)}" alt="Rendered slide ${slide.number}: ${escapeHtml(slide.title)}">
      <figcaption>
        <strong>${slide.number}. ${escapeHtml(slide.title)}</strong>
        <span>${slide.wordCount} words, ${slide.minFontPx ?? "n/a"}px minimum text</span>
        ${slide.findings.map((finding) => `<em>${escapeHtml(finding)}</em>`).join("")}
      </figcaption>
    </figure>`).join("");
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(deckId)} deck review</title>
  <style>
    :root { color-scheme: dark; font-family: system-ui, sans-serif; background: #11151d; color: #f3f5f7; }
    body { margin: 0; padding: 24px; }
    header { margin-bottom: 24px; }
    h1 { margin: 0 0 8px; font-size: 24px; }
    p { margin: 0; color: #aeb7c5; }
    main { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
    figure { margin: 0; border: 1px solid #303a49; border-radius: 10px; overflow: hidden; background: #1a202b; }
    figure.has-findings { border-color: #d69a3c; }
    img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; background: #000; }
    figcaption { display: grid; gap: 5px; padding: 10px 12px 12px; font-size: 13px; }
    figcaption span { color: #aeb7c5; }
    figcaption em { color: #f3be69; font-style: normal; }
    @media (max-width: 1100px) { main { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 720px) { main { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(deckId)} deck review</h1>
    <p>${slides.length} slides rendered at ${viewport.width} x ${viewport.height}</p>
  </header>
  <main>${cards}</main>
</body>
</html>`;
  await writeFile(join(outputDir, "contact-sheet.html"), html);

  const imagePaths = slides.map((slide) => join(outputDir, slide.file));
  try {
    await run("magick", [
      "montage",
      ...imagePaths,
      "-thumbnail", "400x225",
      "-tile", "4x",
      "-geometry", "+12+20",
      "-background", "#11151d",
      join(outputDir, "contact-sheet.png"),
    ]);
  } catch {
    // The HTML contact sheet remains available when ImageMagick is absent.
  }
}

const catalog = await loadCatalog();
const presentation = catalog.presentations.find((item) => item.id === deckId);
if (!presentation) {
  console.error(`No presentation found for ${deckId}`);
  process.exit(1);
}

const chromePath = chromeExecutable();
if (!chromePath) {
  console.error("Chrome or Chromium was not found. Set LEARN_CHROME_PATH to its executable.");
  process.exit(1);
}

const outputDir = join(root, ".artifacts", "deck-review", deckId, timestamp());
await mkdir(outputDir, { recursive: true });
const browserProfile = await mkdtemp(join(tmpdir(), "learn-deck-render-"));
const server = await startLocalServer();
const serverPort = server.address().port;
const deckUrl = `http://127.0.0.1:${serverPort}/${presentation.path.replace(/^\/+/, "")}index.html`;
const chrome = spawn(chromePath, [
  "--headless=new",
  "--remote-debugging-port=0",
  `--user-data-dir=${browserProfile}`,
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank",
], { stdio: "ignore" });

let client;
try {
  const portFile = join(browserProfile, "DevToolsActivePort");
  await waitForFile(portFile, chrome);
  const [debugPort] = (await readFile(portFile, "utf8")).trim().split("\n");
  const target = await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(deckUrl)}`, {
    method: "PUT",
  }).then((response) => response.json());
  client = new CdpClient(target.webSocketDebuggerUrl);
  await client.open();
  await client.call("Page.enable");
  await client.call("Runtime.enable");
  await client.call("Emulation.setDeviceMetricsOverride", viewport);
  const loaded = client.waitFor("Page.loadEventFired");
  await client.call("Page.navigate", { url: deckUrl });
  await loaded;
  await evaluate(client, `new Promise((resolve, reject) => {
    const deadline = Date.now() + 10000;
    const check = () => {
      if (window.Reveal && Reveal.isReady()) resolve(true);
      else if (Date.now() > deadline) reject(new Error("Reveal did not become ready"));
      else setTimeout(check, 50);
    };
    check();
  })`);
  await evaluate(client, `(() => {
    Reveal.configure({ transition: "none", backgroundTransition: "none" });
    return true;
  })()`);

  const positions = await evaluate(client, `Reveal.getSlides().map((slide, index) => {
    const indices = Reveal.getIndices(slide);
    return { index, h: indices.h, v: indices.v || 0 };
  })`);
  const slides = [];

  for (const position of positions) {
    await evaluate(client, `new Promise((resolve) => {
      Reveal.slide(${position.h}, ${position.v});
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 120)));
    })`);
    const metrics = await evaluate(client, `(() => {
      const slide = Reveal.getCurrentSlide();
      const titleNode = slide.querySelector("h1, h2, h3");
      const text = (slide.innerText || "").trim();
      const words = text ? text.split(/\\s+/).filter(Boolean).length : 0;
      const scale = typeof Reveal.getScale === "function" ? Reveal.getScale() : 1;
      const textNodes = Array.from(slide.querySelectorAll("h1, h2, h3, h4, p, li, td, th, pre, figcaption, code"))
        .filter((node) => {
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0 && (node.innerText || "").trim();
        });
      const fontSizes = textNodes.map((node) => Number.parseFloat(getComputedStyle(node).fontSize) * scale).filter(Number.isFinite);
      const clippedTextElements = textNodes.filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.left < -1 || rect.top < -1 || rect.right > innerWidth + 1 || rect.bottom > innerHeight + 1;
      }).length;
      const children = Array.from(slide.children).map((node) => {
        const classes = Array.from(node.classList).sort().join(".");
        return classes ? node.tagName.toLowerCase() + "." + classes : node.tagName.toLowerCase();
      });
      return {
        title: (titleNode?.textContent || "Slide ${position.index + 1}").trim(),
        wordCount: words,
        minFontPx: fontSizes.length ? Math.round(Math.min(...fontSizes) * 10) / 10 : null,
        overflowX: slide.scrollWidth > slide.clientWidth + 2,
        overflowY: slide.scrollHeight > slide.clientHeight + 2,
        clippedTextElements,
        visualCount: slide.querySelectorAll("img, figure, [data-visual], .diagram, .stack-map, .flow-map, .lane-map, .pipeline, .swimlane").length,
        layoutFingerprint: children.join("|")
      };
    })()`);
    const number = position.index + 1;
    const file = `${String(number).padStart(3, "0")}-${slug(metrics.title)}.png`;
    const screenshot = await client.call("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(join(outputDir, file), Buffer.from(screenshot.data, "base64"));
    const isReferences = /references/i.test(metrics.title);
    const findings = [];
    if (metrics.overflowX || metrics.overflowY) findings.push("slide content overflows its section");
    if (metrics.clippedTextElements) findings.push(`${metrics.clippedTextElements} text element(s) cross the viewport`);
    if (!isReferences && metrics.minFontPx !== null && metrics.minFontPx < 12) findings.push(`minimum rendered text is ${metrics.minFontPx}px`);
    if (!isReferences && metrics.wordCount > 120) findings.push(`${metrics.wordCount} words may be too dense`);
    slides.push({ number, h: position.h, v: position.v, file, ...metrics, findings });
    console.log(`rendered ${number}/${positions.length}: ${metrics.title}`);
  }

  const fingerprintCounts = new Map();
  for (const slide of slides) {
    if (!slide.layoutFingerprint) continue;
    fingerprintCounts.set(slide.layoutFingerprint, (fingerprintCounts.get(slide.layoutFingerprint) || 0) + 1);
  }
  const repeatedLayouts = [...fingerprintCounts.entries()]
    .filter(([, count]) => count >= 4)
    .map(([fingerprint, count]) => ({ fingerprint, count }));
  const report = {
    deckId,
    title: presentation.title,
    renderedAt: new Date().toISOString(),
    viewport,
    slideCount: slides.length,
    slides,
    summary: {
      slidesWithFindings: slides.filter((slide) => slide.findings.length).length,
      repeatedLayouts,
    },
  };
  await writeFile(join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await createContactSheet(outputDir, slides);
  console.log(`review: ${outputDir.replace(`${root}/`, "")}`);
  console.log(`findings: ${report.summary.slidesWithFindings} slide(s)`);
} finally {
  client?.close();
  if (chrome.exitCode === null) {
    chrome.kill();
    await Promise.race([
      once(chrome, "close"),
      new Promise((resolveWait) => setTimeout(resolveWait, 2_000)),
    ]);
  }
  server.close();
  if (browserProfile.startsWith(join(tmpdir(), "learn-deck-render-"))) {
    await rm(browserProfile, { recursive: true, force: true });
  }
}

import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import vm from "node:vm";

const root = resolve(new URL("..", import.meta.url).pathname);
const errors = [];

function fail(message) {
  errors.push(message);
}

async function loadCatalog() {
  const source = await readFile(join(root, "assets/js/catalog.js"), "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "assets/js/catalog.js" });
  return context.window.LEARN_CATALOG;
}

function stripUrlSuffix(value) {
  return value.split("#")[0].split("?")[0];
}

function isExternal(value) {
  return /^(https?:|mailto:|tel:|#)/.test(value) || value === "";
}

function targetExists(fromFile, value) {
  const clean = stripUrlSuffix(value);
  if (isExternal(value) || clean === "") return true;
  const target = resolve(join(fromFile, ".."), clean);
  if (existsSync(target)) return true;
  return existsSync(join(target, "index.html"));
}

async function validateHtmlFile(file) {
  const source = await readFile(file, "utf8");
  const attrPattern = /\s(?:href|src)=["']([^"']+)["']/g;
  for (const match of source.matchAll(attrPattern)) {
    if (!targetExists(file, match[1])) {
      fail(`${file.replace(`${root}/`, "")}: missing local target ${match[1]}`);
    }
  }
  return source;
}

function countSlides(source) {
  return (source.match(/<section\b/g) || []).length;
}

function hasReferencesSlide(source) {
  return /<p class=["']kicker["']>\s*References\s*<\/p>/i.test(source);
}

function hasMarkdownBackticksOutsideCode(source) {
  const withoutCodeBlocks = source.replace(/<pre\b[\s\S]*?<\/pre>/gi, "");
  return /`[^`]+`/.test(withoutCodeBlocks);
}

function contentType(pathname) {
  const ext = extname(pathname);
  if (ext === ".css") return "text/css";
  if (ext === ".js") return "text/javascript";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".html" || ext === "") return "text/html";
  return "application/octet-stream";
}

function localFileForPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const normalized = decoded.endsWith("/") ? `${decoded}index.html` : decoded;
  return join(root, normalized.replace(/^\/+/, ""));
}

async function startLocalServer() {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    const file = localFileForPath(url.pathname);
    try {
      const stat = statSync(file);
      if (!stat.isFile()) throw new Error("not a file");
      res.writeHead(200, { "content-type": contentType(file) });
      if (req.method === "HEAD") {
        res.end();
      } else {
        res.end(await readFile(file));
      }
    } catch {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
    }
  });
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  return server;
}

async function smoke(server, paths) {
  const { port } = server.address();
  for (const path of paths) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, { method: "HEAD" });
    if (!response.ok) {
      fail(`local HTTP smoke failed for ${path}: ${response.status}`);
    }
  }
}

const catalog = await loadCatalog();
if (!catalog?.topics?.length) fail("catalog has no topics");
if (!catalog?.presentations?.length) fail("catalog has no presentations");

await validateHtmlFile(join(root, "index.html"));

const smokePaths = ["/"];

for (const topic of catalog.topics) {
  const topicPath = join(root, "topics", topic.id, "index.html");
  if (!existsSync(topicPath)) {
    fail(`missing topic page for ${topic.id}`);
    continue;
  }
  await validateHtmlFile(topicPath);
  smokePaths.push(`/topics/${topic.id}/`);
}

for (const presentation of catalog.presentations) {
  const deckPath = join(root, presentation.path, "index.html");
  if (!existsSync(deckPath)) {
    fail(`missing deck for ${presentation.id}: ${presentation.path}`);
    continue;
  }

  const source = await validateHtmlFile(deckPath);
  const actualSlides = countSlides(source);
  if (actualSlides !== presentation.slideCount) {
    fail(`${presentation.id}: catalog slideCount ${presentation.slideCount} != actual ${actualSlides}`);
  }
  if (!hasReferencesSlide(source)) {
    fail(`${presentation.id}: missing References slide`);
  }
  if (hasMarkdownBackticksOutsideCode(source)) {
    fail(`${presentation.id}: markdown-style backticks found outside code blocks; use <code> elements`);
  }
  if (!presentation.tags?.length) {
    fail(`${presentation.id}: missing tags`);
  }
  if (!presentation.learningGoals?.length) {
    fail(`${presentation.id}: missing learning goals`);
  }
  smokePaths.push(`/${presentation.path}`);
}

const server = await startLocalServer();
try {
  await smoke(server, smokePaths);
} finally {
  server.close();
}

if (errors.length) {
  console.error("Validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${catalog.topics.length} topic(s), ${catalog.presentations.length} deck(s), and ${smokePaths.length} local URL(s).`);

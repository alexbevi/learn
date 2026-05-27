import http from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import vm from "node:vm";

const root = resolve(new URL("..", import.meta.url).pathname);
const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
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

function localTargetPath(fromFile, value) {
  const clean = stripUrlSuffix(value);
  if (isExternal(value) || clean === "") return "";
  return resolve(join(fromFile, ".."), clean);
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

function imageIssues(source, file) {
  const issues = [];
  const imgPattern = /<img\b([^>]*)>/gi;
  for (const match of source.matchAll(imgPattern)) {
    const attrs = match[1];
    const src = attrs.match(/\ssrc=["']([^"']+)["']/i)?.[1] || "";
    const alt = attrs.match(/\salt=["']([^"']*)["']/i)?.[1] || "";
    if (!alt.trim()) {
      issues.push(`${file.replace(`${root}/`, "")}: image ${src || "(missing src)"} is missing useful alt text`);
    }
    if (/^https?:/i.test(src)) {
      issues.push(`${file.replace(`${root}/`, "")}: image ${src} is external; copy runtime assets locally`);
    }
    const target = localTargetPath(file, src);
    if (target && existsSync(target) && statSync(target).size === 0) {
      issues.push(`${file.replace(`${root}/`, "")}: image ${src} is empty`);
    }
    if (target && target.startsWith(join(root, "assets/img")) && /\.png$/i.test(target)) {
      const rel = target.replace(`${join(root, "assets/img")}/`, "").replace(/\.png$/i, ".html");
      const visualSource = join(root, "visuals", rel);
      if (!existsSync(visualSource)) {
        issues.push(
          `${file.replace(`${root}/`, "")}: generated PNG ${src} is missing matching visual source visuals/${rel}`,
        );
      }
    }
  }
  return issues;
}

function visualAidCount(source) {
  const patterns = [
    /<img\b/gi,
    /<figure\b/gi,
    /\sdata-visual(?:=["'][^"']*["'])?/gi,
    /class=["'][^"']*\bdiagram\b[^"']*["']/gi,
    /class=["'][^"']*\b(?:stack-map|flow-map|lane-map|memory-strip|pipeline|swimlane|axis-row)\b[^"']*["']/gi,
  ];
  return patterns.reduce((count, pattern) => count + (source.match(pattern) || []).length, 0);
}

function contentType(pathname) {
  const ext = extname(pathname);
  if (ext === ".css") return "text/css";
  if (ext === ".js") return "text/javascript";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".html" || ext === "") return "text/html";
  return "application/octet-stream";
}

async function findFiles(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return findFiles(path);
      if (entry.isFile()) return [path];
      return [];
    }),
  );
  return nested.flat();
}

async function validateImageAssets() {
  const imageRoot = join(root, "assets/img");
  const imageFiles = (await findFiles(imageRoot)).filter((file) => /\.(png|jpe?g|webp|gif|svg)$/i.test(file));
  for (const file of imageFiles) {
    if (statSync(file).size === 0) {
      fail(`${file.replace(`${root}/`, "")}: image asset is empty`);
    }
  }
}

function validateResearchArtifacts(presentation) {
  const deckDir = join(root, presentation.path);
  const sourceFiles = ["research.md", "sources.json", "claims.json", "visuals.md"];
  const existing = sourceFiles.filter((file) => existsSync(join(deckDir, file)));
  if (existing.length === 0) {
    warn(`${presentation.id}: no research artifacts found; expected research.md, sources.json, claims.json, or visuals.md`);
  }
  const sourcesPath = join(deckDir, "sources.json");
  const sourceIds = new Set();
  if (existsSync(sourcesPath)) {
    try {
      const sources = JSON.parse(statSync(sourcesPath).size ? readFileSync(sourcesPath, "utf8") : "[]");
      if (!Array.isArray(sources)) {
        fail(`${presentation.id}: sources.json must be an array`);
      } else {
        for (const [index, source] of sources.entries()) {
          for (const field of ["id", "title", "url", "sourceType", "concepts"]) {
            if (source?.[field] === undefined || source?.[field] === "") {
              fail(`${presentation.id}: sources.json[${index}] missing ${field}`);
            }
          }
          if (source.id) {
            if (sourceIds.has(source.id)) fail(`${presentation.id}: duplicate source id ${source.id}`);
            sourceIds.add(source.id);
          }
          if (source.url && !/^https?:\/\//i.test(source.url)) {
            fail(`${presentation.id}: sources.json[${index}] url must be http(s)`);
          }
          if (source.sourceType && !["primary", "secondary", "context"].includes(source.sourceType)) {
            fail(`${presentation.id}: sources.json[${index}] sourceType must be primary, secondary, or context`);
          }
          if (source.concepts && !Array.isArray(source.concepts)) {
            fail(`${presentation.id}: sources.json[${index}] concepts must be an array`);
          }
        }
        const primary = sources.filter((source) => source.sourceType === "primary" || source.tier === "primary").length;
        if (sources.length && primary / sources.length < 0.7) {
          warn(`${presentation.id}: sources.json has ${primary}/${sources.length} primary sources; target at least 70%`);
        }
      }
    } catch (error) {
      fail(`${presentation.id}: sources.json is not valid JSON (${error.message})`);
    }
  }
  const claimsPath = join(deckDir, "claims.json");
  if (existsSync(claimsPath)) {
    try {
      const claims = JSON.parse(statSync(claimsPath).size ? readFileSync(claimsPath, "utf8") : "[]");
      if (!Array.isArray(claims)) {
        fail(`${presentation.id}: claims.json must be an array`);
      } else {
        for (const [index, claim] of claims.entries()) {
          for (const field of ["slide", "title", "objective", "coreClaim", "sourceIds", "visual", "practicalTakeaway"]) {
            if (claim?.[field] === undefined || claim?.[field] === "") {
              fail(`${presentation.id}: claims.json[${index}] missing ${field}`);
            }
          }
          if (claim.sourceIds && !Array.isArray(claim.sourceIds)) {
            fail(`${presentation.id}: claims.json[${index}] sourceIds must be an array`);
          }
          for (const sourceId of claim.sourceIds || []) {
            if (sourceIds.size && !sourceIds.has(sourceId)) {
              fail(`${presentation.id}: claims.json[${index}] references unknown source id ${sourceId}`);
            }
          }
        }
      }
    } catch (error) {
      fail(`${presentation.id}: claims.json is not valid JSON (${error.message})`);
    }
  }
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
await validateImageAssets();

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
  for (const issue of imageIssues(source, deckPath)) {
    fail(issue);
  }
  validateResearchArtifacts(presentation);
  const visuals = visualAidCount(source);
  const targetVisuals = Math.max(1, Math.ceil(actualSlides / 8));
  if (visuals < targetVisuals) {
    warn(
      `${presentation.id}: ${visuals} visual aid(s) found; target at least ${targetVisuals} for ${actualSlides} slides`,
    );
  }
  if (!presentation.tags?.length) {
    fail(`${presentation.id}: missing tags`);
  }
  if (!presentation.learningGoals?.length) {
    fail(`${presentation.id}: missing learning goals`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(presentation.lastUpdated || "")) {
    fail(`${presentation.id}: missing lastUpdated date in YYYY-MM-DD format`);
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

if (warnings.length) {
  console.warn("Validation warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

console.log(`Validated ${catalog.topics.length} topic(s), ${catalog.presentations.length} deck(s), and ${smokePaths.length} local URL(s).`);

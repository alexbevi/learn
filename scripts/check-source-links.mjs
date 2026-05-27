import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import vm from "node:vm";

const root = resolve(new URL("..", import.meta.url).pathname);
const targetArg = process.argv[2] || "";
const errors = [];
const warnings = [];

function error(message) {
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

async function findDeckDirs() {
  const catalog = await loadCatalog();
  const decks = catalog.presentations.map((presentation) => ({
    id: presentation.id,
    dir: join(root, presentation.path),
  }));
  if (!targetArg) return decks;
  return decks.filter((deck) => deck.id === targetArg || deck.dir.endsWith(targetArg.replace(/\/$/, "")));
}

function linksFromHtml(source) {
  const links = [];
  const referencesStart = source.search(/<p class=["']kicker["']>\s*References\s*<\/p>/i);
  const scope = referencesStart >= 0 ? source.slice(referencesStart) : source;
  for (const match of scope.matchAll(/\shref=["'](https?:\/\/[^"']+)["']/gi)) {
    links.push(match[1]);
  }
  return links;
}

async function linksFromSourcesJson(deckDir) {
  const path = join(deckDir, "sources.json");
  if (!existsSync(path)) return [];
  const source = await readFile(path, "utf8");
  const data = JSON.parse(source);
  if (!Array.isArray(data)) throw new Error("sources.json must be an array");
  return data.map((item) => item.url).filter((url) => /^https?:\/\//i.test(url));
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    let response = await fetch(url, { method: "HEAD", signal: controller.signal, redirect: "follow" });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, { method: "GET", signal: controller.signal, redirect: "follow" });
    }
    if (!response.ok) {
      error(`${url}: HTTP ${response.status}`);
    }
  } catch (err) {
    error(`${url}: ${err.name === "AbortError" ? "request timed out" : err.message}`);
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const decks = await findDeckDirs();
  if (!decks.length) {
    error(targetArg ? `No deck matched ${targetArg}` : "No decks found");
  }

  const urls = new Map();
  for (const deck of decks) {
    const deckHtml = join(deck.dir, "index.html");
    if (!existsSync(deckHtml)) {
      error(`${deck.id}: missing index.html`);
      continue;
    }
    const html = await readFile(deckHtml, "utf8");
    for (const url of linksFromHtml(html)) urls.set(url, deck.id);
    try {
      for (const url of await linksFromSourcesJson(deck.dir)) urls.set(url, deck.id);
    } catch (err) {
      error(`${deck.id}: ${err.message}`);
    }
  }

  if (!urls.size) {
    warn("No external source links found");
  }

  await Promise.all([...urls.keys()].map(checkUrl));

  if (warnings.length) {
    console.warn("Source link warnings:");
    for (const item of warnings) console.warn(`- ${item}`);
  }
  if (errors.length) {
    console.error("Source link check failed:");
    for (const item of errors) console.error(`- ${item}`);
    process.exit(1);
  }
  console.log(`Checked ${urls.size} source link(s) across ${decks.length} deck(s).`);
}

main();

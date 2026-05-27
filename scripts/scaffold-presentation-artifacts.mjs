import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const root = resolve(new URL("..", import.meta.url).pathname);
const deckId = process.argv[2];

if (!deckId) {
  console.error("Usage: node scripts/scaffold-presentation-artifacts.mjs <deck-id>");
  process.exit(1);
}

async function loadCatalog() {
  const source = await readFile(join(root, "assets/js/catalog.js"), "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "assets/js/catalog.js" });
  return context.window.LEARN_CATALOG;
}

function sourceTemplate(presentation) {
  return JSON.stringify(
    [
      {
        id: "source-1",
        title: "Replace with primary source title",
        url: "https://example.com/",
        sourceType: "primary",
        publisher: "Replace with publisher",
        retrieved: new Date().toISOString().slice(0, 10),
        updated: "",
        version: "",
        confidence: "high",
        concepts: ["replace-with-concept"],
        notes: "Replace with what this source supports and what it does not cover.",
      },
    ],
    null,
    2,
  ).replace("Replace with primary source title", `${presentation.title} source`);
}

function researchTemplate(presentation) {
  return `# Research: ${presentation.title}

## Research Question

What should this deck teach, and what source-of-truth material supports it?

## Concept: Replace With Concept

- Source ids: source-1
- Extracted claims:
  - Replace with source-backed claim.
- Mechanisms or flows:
  - Replace with mechanism, state transition, protocol flow, or execution path.
- Operational or implementation implications:
  - Replace with metric, diagnostic, API, or design consequence.
- Version-sensitive areas:
  - Replace with version caveat or "None identified".
- Gaps or uncertainty:
  - Replace with what the sources do not answer.
`;
}

function claimsTemplate(presentation) {
  return JSON.stringify(
    [
      {
        slide: 1,
        title: presentation.title,
        objective: "Introduce the deck's learning promise.",
        coreClaim: "Replace with the slide's single core claim.",
        sourceIds: ["source-1"],
        visual: "none",
        practicalTakeaway: "Replace with why this matters in practice.",
      },
    ],
    null,
    2,
  );
}

function visualsTemplate(presentation) {
  return `# Visual Plan: ${presentation.title}

## Visual 1

- Slide or range: 1
- Concept: Replace with concept
- Visual type: architecture | flow | state-machine | sequence | taxonomy | comparison | metric-map | code
- Purpose: Replace with teaching purpose
- Source path: visuals/${presentation.topicId}/${presentation.id}/replace-name.html
- Asset path: assets/img/${presentation.topicId}/${presentation.id}/replace-name.png
- Alt text: Replace with useful alt text
- Layout risks: Replace with overflow or legibility risks
- Validation notes: Replace after local screenshot check
`;
}

async function writeIfMissing(path, content) {
  if (existsSync(path)) {
    console.log(`exists: ${path.replace(`${root}/`, "")}`);
    return;
  }
  await writeFile(path, content);
  console.log(`created: ${path.replace(`${root}/`, "")}`);
}

const catalog = await loadCatalog();
const presentation = catalog.presentations.find((item) => item.id === deckId);
if (!presentation) {
  console.error(`No presentation found for ${deckId}`);
  process.exit(1);
}

const deckDir = join(root, presentation.path);
await mkdir(deckDir, { recursive: true });
await writeIfMissing(join(deckDir, "sources.json"), `${sourceTemplate(presentation)}\n`);
await writeIfMissing(join(deckDir, "research.md"), researchTemplate(presentation));
await writeIfMissing(join(deckDir, "claims.json"), `${claimsTemplate(presentation)}\n`);
await writeIfMissing(join(deckDir, "visuals.md"), visualsTemplate(presentation));

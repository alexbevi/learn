import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import vm from "node:vm";

const root = resolve(new URL("..", import.meta.url).pathname);
const casesPath = join(root, "evals/presentation-agent/cases.json");
const args = process.argv.slice(2);

function argument(name) {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
}

function has(name) {
  return args.includes(name);
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function loadJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function loadCatalog() {
  const source = await readFile(join(root, "assets/js/catalog.js"), "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "assets/js/catalog.js" });
  return context.window.LEARN_CATALOG;
}

function validateSuite(suite) {
  const errors = [];
  if (suite.version !== 1) errors.push("cases.json version must be 1");
  if (!Array.isArray(suite.dimensions) || !suite.dimensions.length) errors.push("dimensions must be a non-empty array");
  if (!Array.isArray(suite.cases) || !suite.cases.length) errors.push("cases must be a non-empty array");
  const dimensions = new Set(suite.dimensions || []);
  const caseIds = new Set();
  for (const [caseIndex, testCase] of (suite.cases || []).entries()) {
    for (const field of ["id", "name", "mode", "artifactType", "prompt", "qualityDimensions", "criteria"]) {
      if (testCase[field] === undefined || testCase[field] === "") errors.push(`cases[${caseIndex}] missing ${field}`);
    }
    if (caseIds.has(testCase.id)) errors.push(`duplicate case id ${testCase.id}`);
    caseIds.add(testCase.id);
    for (const dimension of testCase.qualityDimensions || []) {
      if (!dimensions.has(dimension)) errors.push(`${testCase.id} uses unknown dimension ${dimension}`);
    }
    const criterionIds = new Set();
    for (const [criterionIndex, criterion] of (testCase.criteria || []).entries()) {
      if (!criterion.id || !criterion.text) errors.push(`${testCase.id} criteria[${criterionIndex}] is incomplete`);
      if (criterionIds.has(criterion.id)) errors.push(`${testCase.id} has duplicate criterion ${criterion.id}`);
      criterionIds.add(criterion.id);
    }
  }
  return errors;
}

function run(command, commandArgs) {
  return new Promise((resolveRun) => {
    const child = spawn(command, commandArgs, { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("error", (error) => resolveRun({ code: 1, output: `${output}${error.message}\n` }));
    child.on("close", (code) => resolveRun({ code, output }));
  });
}

function reviewTemplate(testCase) {
  return {
    caseId: testCase.id,
    rubric: Object.fromEntries(testCase.qualityDimensions.map((dimension) => [
      dimension,
      { score: null, evidence: "" },
    ])),
    criteria: testCase.criteria.map((criterion) => ({
      id: criterion.id,
      pass: null,
      evidence: "",
    })),
    notes: "",
  };
}

function validateReview(testCase, review) {
  const errors = [];
  if (review.caseId !== testCase.id) errors.push(`review caseId must be ${testCase.id}`);
  for (const dimension of testCase.qualityDimensions) {
    const entry = review.rubric?.[dimension];
    if (!entry) {
      errors.push(`review missing rubric dimension ${dimension}`);
      continue;
    }
    if (!Number.isInteger(entry.score) || entry.score < 1 || entry.score > 4) {
      errors.push(`${dimension} score must be an integer from 1 to 4`);
    }
    if (!entry.evidence?.trim()) errors.push(`${dimension} needs concrete evidence`);
  }
  const reviewsById = new Map((review.criteria || []).map((entry) => [entry.id, entry]));
  for (const criterion of testCase.criteria) {
    const entry = reviewsById.get(criterion.id);
    if (!entry) {
      errors.push(`review missing criterion ${criterion.id}`);
      continue;
    }
    if (typeof entry.pass !== "boolean") errors.push(`${criterion.id} pass must be true or false`);
    if (!entry.evidence?.trim()) errors.push(`${criterion.id} needs concrete evidence`);
  }
  return errors;
}

async function latestRenderReport(deckId) {
  const deckRoot = join(root, ".artifacts/deck-review", deckId);
  if (!existsSync(deckRoot)) return null;
  const directories = (await readdir(deckRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const latest = directories.at(-1);
  if (!latest) return null;
  const path = join(deckRoot, latest, "report.json");
  if (!existsSync(path)) return null;
  return { path, report: await loadJson(path) };
}

async function collectDeckEvidence(deckId, renderRequested) {
  const catalog = await loadCatalog();
  const presentation = catalog.presentations.find((item) => item.id === deckId);
  if (!presentation) throw new Error(`No presentation found for ${deckId}`);
  const deckDir = join(root, presentation.path);
  const siteValidation = await run("node", ["scripts/validate-site.mjs"]);
  let renderRun = null;
  if (renderRequested) renderRun = await run("node", ["scripts/render-deck.mjs", deckId]);
  const render = await latestRenderReport(deckId);
  const artifacts = ["research.md", "sources.json", "claims.json", "visuals.md"]
    .filter((name) => existsSync(join(deckDir, name)));
  const sources = existsSync(join(deckDir, "sources.json")) ? await loadJson(join(deckDir, "sources.json")) : [];
  const claims = existsSync(join(deckDir, "claims.json")) ? await loadJson(join(deckDir, "claims.json")) : [];
  const primarySources = sources.filter((source) => source.sourceType === "primary" || source.tier === "primary").length;
  const roleCounts = {};
  const exampleValidationCounts = {};
  for (const claim of claims) {
    const role = claim.role || "claim";
    roleCounts[role] = (roleCounts[role] || 0) + 1;
    const status = claim.exampleValidation?.status;
    if (status) exampleValidationCounts[status] = (exampleValidationCounts[status] || 0) + 1;
  }
  const criticalRenderFindings = (render?.report.slides || []).flatMap((slide) =>
    slide.findings
      .filter((finding) => /overflow|cross the viewport/i.test(finding))
      .map((finding) => ({ slide: slide.number, title: slide.title, finding })),
  );
  return {
    deckId,
    path: presentation.path,
    artifacts,
    sourceCount: sources.length,
    primarySourceRatio: sources.length ? Math.round((primarySources / sources.length) * 1000) / 1000 : null,
    claimPlanEntries: claims.length,
    roleCounts,
    exampleValidationCounts,
    siteValidation: { pass: siteValidation.code === 0, output: siteValidation.output.trim() },
    render: render ? {
      requested: renderRequested,
      runPass: renderRun ? renderRun.code === 0 : null,
      reportPath: render.path.replace(`${root}/`, ""),
      slideCount: render.report.slideCount,
      slidesWithFindings: render.report.summary.slidesWithFindings,
      repeatedLayouts: render.report.summary.repeatedLayouts,
      criticalFindings: criticalRenderFindings,
    } : { requested: renderRequested, runPass: renderRun ? renderRun.code === 0 : null, reportPath: null },
  };
}

const suite = await loadJson(casesPath);
const suiteErrors = validateSuite(suite);
if (suiteErrors.length) {
  console.error("Invalid evaluation suite:");
  for (const error of suiteErrors) console.error(`- ${error}`);
  process.exit(1);
}

if (has("--validate")) {
  const catalog = await loadCatalog();
  const catalogIds = new Set(catalog.presentations.map((presentation) => presentation.id));
  const validationErrors = [];
  for (const testCase of suite.cases) {
    if (testCase.deckId && !catalogIds.has(testCase.deckId)) {
      validationErrors.push(`${testCase.id} references unknown deck ${testCase.deckId}`);
    }
    const syntheticReview = reviewTemplate(testCase);
    for (const entry of Object.values(syntheticReview.rubric)) {
      entry.score = 3;
      entry.evidence = "Synthetic validation evidence";
    }
    for (const entry of syntheticReview.criteria) {
      entry.pass = true;
      entry.evidence = "Synthetic validation evidence";
    }
    validationErrors.push(...validateReview(testCase, syntheticReview).map((error) => `${testCase.id}: ${error}`));
  }
  if (validationErrors.length) {
    console.error("Invalid evaluation references or review templates:");
    for (const error of validationErrors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Validated ${suite.cases.length} presentation agent evaluation cases.`);
  process.exit(0);
}

if (has("--list")) {
  for (const testCase of suite.cases) {
    console.log(`${testCase.id}\t${testCase.mode}\t${testCase.name}`);
  }
  process.exit(0);
}

const prepareId = argument("--prepare");
if (prepareId) {
  const testCase = suite.cases.find((item) => item.id === prepareId);
  if (!testCase) throw new Error(`Unknown evaluation case ${prepareId}`);
  const outputDir = join(root, ".artifacts/agent-evals", `${stamp()}-${testCase.id}`);
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, "prompt.md"), `${testCase.prompt}\n`);
  await writeFile(join(outputDir, "review-template.json"), `${JSON.stringify(reviewTemplate(testCase), null, 2)}\n`);
  console.log(`prepared: ${outputDir.replace(`${root}/`, "")}`);
  process.exit(0);
}

const scoreId = argument("--score");
if (scoreId) {
  const testCase = suite.cases.find((item) => item.id === scoreId);
  if (!testCase) throw new Error(`Unknown evaluation case ${scoreId}`);
  const reviewPath = argument("--review");
  if (!reviewPath) throw new Error("--review <path> is required when scoring");
  const review = await loadJson(resolve(reviewPath));
  const reviewErrors = validateReview(testCase, review);
  if (reviewErrors.length) {
    console.error("Invalid review:");
    for (const error of reviewErrors) console.error(`- ${error}`);
    process.exit(1);
  }
  const deckId = argument("--deck") || testCase.deckId;
  const needsDeckValidation = testCase.artifactType !== "response";
  if (needsDeckValidation && !deckId) throw new Error("--deck <deck-id> is required for this case");
  const deckEvidence = needsDeckValidation ? await collectDeckEvidence(deckId, has("--render")) : null;
  const rubricEntries = testCase.qualityDimensions.map((dimension) => review.rubric[dimension]);
  const average = rubricEntries.length
    ? Math.round((rubricEntries.reduce((sum, entry) => sum + entry.score, 0) / rubricEntries.length) * 100) / 100
    : null;
  const criteriaPass = review.criteria.every((entry) => entry.pass);
  const rubricPass = !rubricEntries.length || (average >= 3 && rubricEntries.every((entry) => entry.score > 1));
  const renderRequired = needsDeckValidation;
  const renderPass = !renderRequired || (
    has("--render") &&
    deckEvidence.render.runPass &&
    deckEvidence.render.criticalFindings.length === 0
  );
  const validationPass = !needsDeckValidation || deckEvidence.siteValidation.pass;
  const passed = criteriaPass && rubricPass && renderPass && validationPass;
  const scorecard = {
    caseId: testCase.id,
    name: testCase.name,
    scoredAt: new Date().toISOString(),
    passed,
    rubricAverage: average,
    checks: { criteriaPass, rubricPass, validationPass, renderPass },
    review,
    deckEvidence,
  };
  const outputDir = join(root, ".artifacts/agent-evals/scorecards");
  await mkdir(outputDir, { recursive: true });
  const outputPath = join(outputDir, `${stamp()}-${testCase.id}.json`);
  await writeFile(outputPath, `${JSON.stringify(scorecard, null, 2)}\n`);
  console.log(`${passed ? "PASS" : "FAIL"}: ${testCase.id}`);
  if (average !== null) console.log(`rubric average: ${average}`);
  console.log(`scorecard: ${outputPath.replace(`${root}/`, "")}`);
  process.exit(passed ? 0 : 1);
}

console.error("Usage: node scripts/run-presentation-evals.mjs --validate | --list | --prepare <case-id> | --score <case-id> --review <path> [--deck <deck-id>] [--render]");
process.exit(1);

import { existsSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { spawn } from "node:child_process";

const root = resolve(new URL("..", import.meta.url).pathname);
const visualsRoot = join(root, "visuals");
const outputRoot = join(root, "assets/img");

async function findHtmlFiles(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return findHtmlFiles(path);
      if (entry.isFile() && entry.name.endsWith(".html")) return [path];
      return [];
    }),
  );
  return files.flat();
}

function outputPathFor(source) {
  const visualPath = relative(visualsRoot, source);
  return join(outputRoot, visualPath.replace(/\.html$/, ".png"));
}

function run(command, args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
    });
    child.on("error", rejectRun);
    child.on("close", (code) => {
      if (code === 0) {
        resolveRun();
      } else {
        rejectRun(new Error(`${command} ${args.join(" ")} exited with ${code}`));
      }
    });
  });
}

const sources = await findHtmlFiles(visualsRoot);

if (!sources.length) {
  console.log("No visual HTML sources found under visuals/.");
  process.exit(0);
}

for (const source of sources) {
  const output = outputPathFor(source);
  await mkdir(dirname(output), { recursive: true });
  await run("npx", [
    "playwright",
    "screenshot",
    "--viewport-size=1600,900",
    `file://${source}`,
    output,
  ]);
  console.log(`${relative(root, source)} -> ${relative(root, output)}`);
}

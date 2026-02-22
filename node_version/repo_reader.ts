import { fetchTree, fetchFile } from "./github.js";

export type TreeItem = {
  path: string;
  type: "blob" | "tree";
  size?: number;
};

export type RepoReadResult = {
  tree: TreeItem[];
  treeText: string;
  filesText: string;
  selectedFiles: string[];
  keyFiles: Record<string, string>;
};

const MAX_FILES = 20;
const MAX_TOTAL_BYTES = 150_000;
const MAX_FILE_CHARS = 6000;

function isSkippablePath(p: string): boolean {
  const s = p.toLowerCase();
  return (
    s.includes("node_modules/") ||
    s.startsWith("node_modules/") ||
    s.includes("dist/") ||
    s.startsWith("dist/") ||
    s.includes(".git/") ||
    s.startsWith(".git/") ||
    s.endsWith(".min.js") ||
    s.endsWith(".min.css") ||
    s.endsWith(".map") ||
    s.endsWith(".lock") ||
    s === "package-lock.json" ||
    s === "pnpm-lock.yaml" ||
    s === "bun.lockb" ||
    s === "yarn.lock"
  );
}

function scoreSignalFile(p: string): number {
  const s = p.toLowerCase();

  if (s === "package.json") return 100;
  if (s === "pyproject.toml" || s === "requirements.txt") return 90;
  if (s === "go.mod" || s === "cargo.toml" || s === "pom.xml" || s === "build.gradle") return 85;

  if (s === "tsconfig.json") return 75;
  if (s === "next.config.js" || s === "next.config.mjs" || s === "vite.config.ts" || s === "vite.config.js") return 70;
  if (s === "svelte.config.js" || s === "nuxt.config.ts" || s === "nuxt.config.js") return 70;
  if (s === "dockerfile" || s.endsWith("dockerfile")) return 65;
  if (s === "docker-compose.yml" || s === "compose.yml") return 60;
  if (s === "vercel.json" || s === "netlify.toml") return 55;

  if (s.endsWith("/main.ts") || s.endsWith("/main.js") || s.endsWith("/index.ts") || s.endsWith("/index.js")) return 60;
  if (s.endsWith("/app.ts") || s.endsWith("/app.js") || s.endsWith("/server.ts") || s.endsWith("/server.js")) return 58;
  if (s.endsWith("/cli.ts") || s.endsWith("/cli.js")) return 57;
  if (s.endsWith("main.py") || s.endsWith("__main__.py")) return 55;

  if (s.startsWith("apps/") || s.startsWith("packages/")) return 50;

  if (s.endsWith(".ts") || s.endsWith(".js") || s.endsWith(".py") || s.endsWith(".go") || s.endsWith(".rs")) return 15;

  return 0;
}

function buildTreeSummary(tree: TreeItem[]): string {
  const lines: string[] = [];

  const top = new Set<string>();
  const second = new Set<string>();

  for (const item of tree) {
    const parts = item.path.split("/");
    if (parts.length >= 1) top.add(parts[0]);
    if (parts.length >= 2) second.add(`${parts[0]}/${parts[1]}`);
  }

  lines.push("Top-level:");
  lines.push(Array.from(top).sort().join("  "));

  lines.push("\nSecond-level:");
  lines.push(Array.from(second).sort().slice(0, 60).join("\n"));

  return lines.join("\n");
}

export async function readRepoSignalFiles(
  owner: string,
  repo: string
): Promise<RepoReadResult> {
  const tree = await fetchTree(owner, repo);

  const blobs: TreeItem[] = tree
    .filter((x) => x.type === "blob")
    .map((x) => ({ path: x.path, type: "blob", size: x.size }));

  const scored = blobs
    .filter((x) => !isSkippablePath(x.path))
    .map((x) => ({
      path: x.path,
      size: x.size ?? 0,
      score: scoreSignalFile(x.path),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const selected: string[] = [];
  let totalBytes = 0;

  for (const f of scored) {
    if (selected.length >= MAX_FILES) break;
    if (f.size > 0 && f.size > 200_000) continue;
    if (totalBytes + (f.size || 2000) > MAX_TOTAL_BYTES) continue;

    selected.push(f.path);
    totalBytes += f.size || 2000;
  }

  const treeText = buildTreeSummary(tree);

  const fileBlocks: string[] = [];
  for (const filePath of selected) {
    try {
      const content = await fetchFile(owner, repo, filePath);

      const trimmed = (content || "").slice(0, MAX_FILE_CHARS);

      fileBlocks.push(
        [
          `FILE: ${filePath}`,
          "```",
          trimmed,
          "```",
          "",
        ].join("\n")
      );
    } catch {

    }
  }
const keyFiles: Record<string, string> = {};

const STACK_KEY_FILES = [
  "package.json",
  "pyproject.toml",
  "requirements.txt",
  "go.mod",
  "Cargo.toml",
  "composer.json",
  "pom.xml",
  "build.gradle",
  "Dockerfile",
  "docker-compose.yml",
  "vercel.json",
  "netlify.toml",
];

for (const path of STACK_KEY_FILES) {
  const match = tree.find(t => t.path.toLowerCase() === path.toLowerCase());
  if (!match) continue;

  try {
    const content = await fetchFile(owner, repo, path);
    keyFiles[path] = content.slice(0, 20000);
  } catch {}
}  

  return {
    tree,
    treeText,
    filesText: fileBlocks.join("\n"),
    selectedFiles: selected,
    keyFiles,
  };
}
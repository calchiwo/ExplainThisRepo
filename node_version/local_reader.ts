import fs from "node:fs";
import path from "node:path";

import { type RepoReadResult, type TreeItem } from "./repo_reader.js";

const KEY_FILENAMES = new Set([
  "readme.md", "readme.txt", "readme.rst", "readme",
  "package.json", "pyproject.toml", "setup.py", "setup.cfg",
  "requirements.txt", "cargo.toml", "go.mod", "pom.xml",
  "build.gradle", "composer.json", "gemfile", "makefile",
  "dockerfile", "docker-compose.yml", "docker-compose.yaml",
  ".env.example", "tsconfig.json", "angular.json", "next.config.js",
  "vite.config.js", "vite.config.ts", "webpack.config.js",
]);

const SKIP_DIRS = new Set([
  ".git", ".hg", ".svn", "node_modules", "__pycache__",
  ".venv", "venv", "env", ".env", "dist", "build",
  ".idea", ".vscode", ".mypy_cache", ".pytest_cache",
  "coverage", ".coverage", "htmlcov",
]);

const MAX_FILE_BYTES = 32_000;
const MAX_KEY_FILES = 12;

function walkDir(
  root: string,
  dir: string,
  tree: TreeItem[],
  keyFiles: Record<string, string>
): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  const dirs: fs.Dirent[] = [];
  const files: fs.Dirent[] = [];

  for (const entry of entries) {
    if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) {
      dirs.push(entry);
    } else if (entry.isFile()) {
      files.push(entry);
    }
  }

  dirs.sort((a, b) => a.name.localeCompare(b.name));
  files.sort((a, b) => a.name.localeCompare(b.name));

  for (const file of files) {
    const absPath = path.join(dir, file.name);
    const relPath = path.relative(root, absPath).replace(/\\/g, "/");

    tree.push({ path: relPath, type: "blob" });

    if (
      KEY_FILENAMES.has(file.name.toLowerCase()) &&
      Object.keys(keyFiles).length < MAX_KEY_FILES
    ) {
      try {
        const fd = fs.openSync(absPath, "r");
        const buf = Buffer.alloc(MAX_FILE_BYTES);
        const bytesRead = fs.readSync(fd, buf, 0, MAX_FILE_BYTES, 0);
        fs.closeSync(fd);
        keyFiles[relPath] = buf.subarray(0, bytesRead).toString("utf8");
      } catch {
        
      }
    }
  }

  for (const subdir of dirs) {
    walkDir(root, path.join(dir, subdir.name), tree, keyFiles);
  }
}

export function readLocalRepoSignalFiles(dirPath: string): RepoReadResult {
  const root = path.resolve(dirPath);
  const tree: TreeItem[] = [];
  const keyFiles: Record<string, string> = {};

  walkDir(root, root, tree, keyFiles);

  const treeText = tree.map((item) => item.path).join("\n");

  const filesText = Object.entries(keyFiles)
    .map(([relPath, content]) => `### ${relPath}\n${content}`)
    .join("\n\n");

  return {
    tree,
    treeText,
    keyFiles,
    filesText,
    selectedFiles: Object.keys(keyFiles),
  };
}
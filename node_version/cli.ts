#!/usr/bin/env node

import os from "node:os";
import process from "node:process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fetchRepo, fetchReadme } from "./github.js";
import { buildPrompt, buildSimplePrompt } from "./prompt.js";
import { generateExplanation } from "./generate.js";
import { writeOutput } from "./writer.js";
import { readRepoSignalFiles } from "./repo_reader.js";

import { fetchLanguages } from "./github.js";
import { detectStack } from "./stack-detector.js";
import { printStack } from "./stack_printer.js";

function usage(): void {
  const version = getPkgVersion();

  console.log(`ExplainThisRepo v${version}`);
  console.log("Explain GitHub repositories in plain English.\n");

  console.log("usage:");
  console.log("  explainthisrepo owner/repo");
  console.log("  explainthisrepo https://github.com/owner/repo");
  console.log("  explainthisrepo github.com/owner/repo");
  console.log("  explainthisrepo git@github.com:owner/repo.git");
  console.log("  explainthisrepo owner/repo --detailed");
  console.log("  explainthisrepo owner/repo --quick");
  console.log("  explainthisrepo owner/repo --simple");
  console.log("  explainthisrepo owner/repo --stack");
  console.log("  explainthisrepo --doctor");
  console.log("  explainthisrepo --version");
  console.log("  explainthisrepo --help");
}

function resolveRepoTarget(target: string): { owner: string; repo: string } {
  target = target.trim();

  // Fix scheme typos
  if (target.startsWith("https//")) {
    target = target.replace("https//", "https://");
  }
  if (target.startsWith("http//")) {
    target = target.replace("http//", "http://");
  }

  // Case 1: SSH clone URL
  if (target.startsWith("git@github.com:")) {
    const path = target.replace("git@github.com:", "");
    const [owner, repoRaw] = path.split("/", 2);
    if (!owner || !repoRaw) throw new Error("Invalid GitHub SSH URL");
    return { owner, repo: repoRaw.replace(/\.git$/, "") };
  }

  // Case 2: github.com/owner/repo
  if (target.startsWith("github.com/")) {
    target = "https://" + target;
  }

  // Case 3: Full URL
  if (target.startsWith("http://") || target.startsWith("https://")) {
    const url = new URL(target);

    if (!["github.com", "www.github.com"].includes(url.hostname)) {
      throw new Error("Only GitHub repository URLs are supported");
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      throw new Error("URL must point to a repository");
    }

    return { owner: parts[0], repo: parts[1].replace(/\.git$/, "") };
  }

  // Case 4: owner/repo
  const parts = target.split("/");
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { owner: parts[0], repo: parts[1] };
  }

  throw new Error("Invalid format. Use owner/repo or a GitHub repo URL");
}

function getPkgVersion(): string {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // dist/cli.js -> dist -> package root
    const pkgPath = path.join(__dirname, "..", "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

    return pkg.version ?? "unknown";
  } catch {
    return "unknown";
  }
}

function printVersion(): void {
  console.log(getPkgVersion());
}

function hasEnv(key: string): boolean {
  const v = process.env[key];
  return Boolean(v && v.trim());
}

async function checkUrl(
  url: string,
  timeoutMs = 6000
): Promise<{ ok: boolean; msg: string }> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "explainthisrepo" },
      signal: controller.signal,
    });

    clearTimeout(t);
    return { ok: res.ok, msg: `ok (${res.status})` };
  } catch (e: any) {
    clearTimeout(t);
    return {
      ok: false,
      msg: `failed (${e?.name || "Error"}: ${e?.message || e})`,
    };
  }
}

async function runDoctor(): Promise<number> {
  console.log("explainthisrepo doctor report\n");

  console.log(`node: ${process.version}`);
  console.log(`os: ${os.type()} ${os.release()}`);
  console.log(`platform: ${process.platform} ${process.arch}`);
  console.log(`version: ${getPkgVersion()}`);

  console.log("\nenvironment:");
  console.log(`- GEMINI_API_KEY set: ${hasEnv("GEMINI_API_KEY")}`);
  console.log(`- GITHUB_TOKEN set: ${hasEnv("GITHUB_TOKEN")}`);

  console.log("\nnetwork checks:");
  const gh = await checkUrl("https://api.github.com");
  console.log(`- github api: ${gh.msg}`);

  const gem = await checkUrl("https://generativelanguage.googleapis.com");
  console.log(`- gemini endpoint: ${gem.msg}`);

  return gh.ok ? 0 : 1;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "-h" || args[0] === "--help") {
    usage();
    process.exit(0);
  }

  if (args[0] === "--version") {
    printVersion();
    process.exit(0);
  }

  if (args[0] === "--doctor") {
    const code = await runDoctor();
    process.exit(code);
  }

  let detailed = false;
  let quick = false;
  let simple = false;
  let stack = false;

  // Accept:
  // - explainthisrepo owner/repo
  // - explainthisrepo owner/repo --detailed
  // - explainthisrepo owner/repo --quick
  // - explainthisrepo owner/repo --simple
  // - explainthisrepo owner/repo --stack
  if (args.length === 2) {
    if (args[1] === "--detailed") detailed = true;
    else if (args[1] === "--quick") quick = true;
    else if (args[1] === "--simple") simple = true;
    else if (args[1] === "--stack") stack = true;
    else {
      usage();
      process.exit(1);
    }
  } else if (args.length !== 1) {
    usage();
    process.exit(1);
  }

  // mutually exclusive flags
  if (
  (quick && simple) ||
  (detailed && simple) ||
  (detailed && quick) ||
  (stack && (quick || simple || detailed))
) {
  usage();
  process.exit(1);
}

  let owner: string, repo: string;

try {
  ({ owner, repo } = resolveRepoTarget(args[0]));
} catch (e: any) {
  console.log(`error: ${e.message}`);
  process.exit(1);
}

  if (!owner || !repo) {
    console.log("Invalid format. Use owner/repo");
    process.exit(1);
  }

  console.log(`Fetching ${owner}/${repo}...`);
  if (stack) {
  const languages = await fetchLanguages(owner, repo);
  const read = await readRepoSignalFiles(owner, repo);

  const report = detectStack({
    languages,
    tree: read.tree,
    keyFiles: read.keyFiles,
  });

  printStack(report, owner, repo);
  return;
}
  try {
  let repoData: any;
  try {
    repoData = await fetchRepo(owner, repo);
  } catch (e: any) {
    console.log("Failed to fetch repository data.");
    console.log(`error: ${e?.message || e}`);
    console.log("\nfix:");
    console.log("- Ensure the repository exists and is public");
    console.log("- Or set GITHUB_TOKEN to avoid rate limits");
    process.exit(1);
  }

    let readme: string | null = null;

        try {
          readme = await fetchReadme(owner, repo);
        } catch {
          readme = null;
        }

    let readResult: any = null;
    if (!quick) {
      try {
        readResult = await readRepoSignalFiles(owner, repo);
      } catch {
        readResult = null;
      }
    }

    const prompt = buildPrompt(
      repoData.full_name,
      repoData.description,
      readme,
      detailed,
      quick,
      readResult?.treeText ?? null,
      readResult?.filesText ?? null
    );

    console.log("Generating explanation...");
    const output = await generateExplanation(prompt);

    // QUICK MODE: print only, no file write
    if (quick) {
      console.log("Quick summary 🎉");
      console.log(output.trim());
      return;
    }

    // SIMPLE MODE: generate long internally then summarize, no file write
    if (simple) {
      console.log("Summarizing...");
      const simplePrompt = buildSimplePrompt(output);
      const simpleOutput = await generateExplanation(simplePrompt);

      console.log("Simple summary 🎉");
      console.log(simpleOutput.trim());
      return;
    }

    // NORMAL / DETAILED: write EXPLAIN.md
    console.log("Writing EXPLAIN.md...");
    writeOutput(output);

    const wordCount = output.split(/\s+/).filter(Boolean).length;

    console.log("EXPLAIN.md generated successfully 🎉");
    console.log(`Words: ${wordCount}`);
    console.log("Open EXPLAIN.md to read it.");
  } catch (e: any) {
    console.log("Failed to generate explanation.");
    console.log(`error: ${e?.message || e}`);

    console.log("\nfix:");
    console.log("- Ensure GEMINI_API_KEY is set");
    console.log("- Or run: explainthisrepo --doctor");

    process.exit(1);
  }
}

main();
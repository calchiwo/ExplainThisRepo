#!/usr/bin/env node

import os from "node:os";
import process from "node:process";
import fs from "node:fs";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";

import { fetchRepo, fetchReadme } from "./github.js";
import { buildPrompt, buildQuickPrompt, buildSimplePrompt } from "./prompt.js";
import { generateExplanation } from "./generate.js";
import { writeOutput } from "./writer.js";
import { readRepoSignalFiles, type RepoReadResult } from "./repo_reader.js";
import { readLocalRepoSignalFiles } from "./local_reader.js";

import { fetchLanguages } from "./github.js";
import { detectStack } from "./stack-detector.js";
import { printStack } from "./stack_printer.js";

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
    const p = target.replace("git@github.com:", "");
    const [owner, repoRaw] = p.split("/", 2);
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
  } catch (e: unknown) {
    clearTimeout(t);
    const message = e instanceof Error ? e.message : String(e);
    const name = e instanceof Error ? e.name : "Error";
    return { ok: false, msg: `failed (${name}: ${message})` };
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

  return gh.ok && gem.ok ? 0 : 1;
}

async function safeReadRepoFiles(
  owner: string,
  repo: string
): Promise<RepoReadResult | null> {
  try {
    return await readRepoSignalFiles(owner, repo);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.warn(`Warning: Could not read repo files: ${message}`);
    return null;
  }
}

async function generateWithExit(prompt: string): Promise<string> {
  try {
    return await generateExplanation(prompt);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Failed to generate explanation.");
    console.error(`error: ${message}`);
    console.error("\nfix:");
    console.error("- Ensure GEMINI_API_KEY is set");
    console.error("- Or run: explainthisrepo --doctor");
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const program = new Command();

  program
    .name("explainthisrepo")
    .description("Explain GitHub repositories in plain English")
    .version(getPkgVersion(), "-v, --version", "Show version")
    .argument("[repository]", "GitHub repository (owner/repo or URL) or local path")
    .option("--doctor", "Run diagnostics")
    .option("--quick", "Quick summary mode")
    .option("--simple", "Simple summary mode")
    .option("--detailed", "Detailed explanation mode")
    .option("--stack", "Stack detection mode")
    .addHelpText(
      "after",
      `
Examples:
  $ explainthisrepo owner/repo
  $ explainthisrepo https://github.com/owner/repo
  $ explainthisrepo github.com/owner/repo
  $ explainthisrepo git@github.com:owner/repo.git
  $ explainthisrepo owner/repo --detailed
  $ explainthisrepo owner/repo --quick
  $ explainthisrepo owner/repo --simple
  $ explainthisrepo owner/repo --stack
  $ explainthisrepo .
  $ explainthisrepo ./path/to/directory
  $ explainthisrepo . --stack
  $ explainthisrepo --doctor`
    );

  program.parse(process.argv);

  const options = program.opts();
  const repository = program.args[0];

  if (options.doctor) {
    const code = await runDoctor();
    process.exit(code);
  }

  const modeFlags = [
    options.quick,
    options.simple,
    options.detailed,
    options.stack,
  ].filter(Boolean);

  if (modeFlags.length > 1) {
    console.error("error: only one mode flag can be used at a time");
    process.exit(1);
  }

  if (!repository) {
    program.error("repository argument required");
  }

  const local = fs.existsSync(repository);
  let owner = "";
  let repo = "";
  let localPath = "";

  if (local) {
    localPath = path.resolve(repository);
    console.log(`Analyzing local directory: ${repository}`);
  } else {
    try {
      ({ owner, repo } = resolveRepoTarget(repository));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`error: ${message}`);
      process.exit(1);
    }

    console.log(`Fetching ${owner}/${repo}...`);
  }

  if (options.stack) {
    let read: RepoReadResult;
    let languages: Record<string, number> = {};

    if (local) {
      read = readLocalRepoSignalFiles(localPath);
    } else {
      try {
        languages = await fetchLanguages(owner, repo);
        read = await readRepoSignalFiles(owner, repo);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`error: ${message}`);
        process.exit(1);
      }
    }
    const report = detectStack({
      languages,
      tree: read.tree,
      keyFiles: read.keyFiles,
    });

    const label = local ? repository : owner;
    const sublabel = local ? "" : repo;
    printStack(report, label, sublabel);
    return;
  }

  let repoData: { full_name: string; description: string | null } | null = null;
  let readme: string | null = null;

  if (!local) {
    try {
      repoData = await fetchRepo(owner, repo);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error("Failed to fetch repository data.");
      console.error(`error: ${message}`);
      console.error("\nfix:");
      console.error("- Ensure the repository exists and is public");
      console.error("- Or set GITHUB_TOKEN to avoid rate limits");
      process.exit(1);
    }

    try {
      readme = await fetchReadme(owner, repo);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.warn(`Warning: Could not fetch README: ${message}`);
      readme = null;
    }
  }

  // QUICK MODE
  if (options.quick) {
    let quickReadme: string | null = readme;
    const repoName: string = local ? localPath : (repoData?.full_name ?? "");
    const description: string | null = local ? null : (repoData?.description ?? null);

    if (local) {
      const read = readLocalRepoSignalFiles(localPath);
      const readmeKey = Object.keys(read.keyFiles).find((k) =>
        k.toLowerCase().startsWith("readme")
      );
      quickReadme = readmeKey !== undefined ? read.keyFiles[readmeKey] : null;
    }

    const prompt = buildQuickPrompt(repoName, description, quickReadme);

    console.log("Generating explanation...");

    const output = await generateWithExit(prompt);

    console.log("Quick summary 🎉");
    console.log(output.trim());
    return;
  }

  // SIMPLE MODE
  if (options.simple) {
    const readResult: RepoReadResult | null = local
      ? readLocalRepoSignalFiles(localPath)
      : await safeReadRepoFiles(owner, repo);

    const prompt = buildSimplePrompt(
      local ? localPath : (repoData?.full_name ?? ""),
      local ? null : (repoData?.description ?? null),
      local ? null : readme,
      readResult?.treeText ?? null
    );

    console.log("Generating explanation...");

    const output = await generateWithExit(prompt);

    console.log("Simple summary 🎉");
    console.log(output.trim());
    return;
  }

  // NORMAL / DETAILED MODE
  const readResult: RepoReadResult | null = local
    ? readLocalRepoSignalFiles(localPath)
    : await safeReadRepoFiles(owner, repo);
    
  const prompt = buildPrompt(
    local ? localPath : (repoData?.full_name ?? ""),
    local ? null : (repoData?.description ?? null),
    local ? null : readme,
    options.detailed || false,
    readResult?.treeText ?? null,
    readResult?.filesText ?? null
  );

  console.log("Generating explanation...");

  const output = await generateWithExit(prompt);

  console.log("Writing EXPLAIN.md...");
  writeOutput(output);

  const wordCount = output.split(/\s+/).filter(Boolean).length;

  console.log("EXPLAIN.md generated successfully 🎉");
  console.log(`Words: ${wordCount}`);
  console.log("Open EXPLAIN.md to read it.");
}

main();                                                                                        
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

function usage(): void {
  const version = getPkgVersion();

  console.log(`ExplainThisRepo v${version}`);
  console.log("Explain GitHub repositories in plain English.\n");

  console.log("usage:");
  console.log("  explainthisrepo owner/repo");
  console.log("  explainthisrepo owner/repo --detailed");
  console.log("  explainthisrepo owner/repo --quick");
  console.log("  explainthisrepo owner/repo --simple");
  console.log("  explainthisrepo owner/repo --stack");
  console.log("  explainthisrepo owner/repo --tree");
  console.log("  explainthisrepo --doctor");
  console.log("  explainthisrepo --version");
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

  // Accept:
  // - explainthisrepo owner/repo
  // - explainthisrepo owner/repo --detailed
  // - explainthisrepo owner/repo --quick
  // - explainthisrepo owner/repo --simple
  if (args.length === 2) {
    if (args[1] === "--detailed") detailed = true;
    else if (args[1] === "--quick") quick = true;
    else if (args[1] === "--simple") simple = true;
    else {
      usage();
      process.exit(1);
    }
  } else if (args.length !== 1) {
    usage();
    process.exit(1);
  }

  // mutually exclusive flags
  if ((quick && simple) || (detailed && simple) || (detailed && quick)) {
    usage();
    process.exit(1);
  }

  const target = args[0];

  if (!target.includes("/") || target.split("/").length !== 2) {
    console.log("Invalid format. Use owner/repo");
    process.exit(1);
  }

  const [owner, repo] = target.split("/");
  if (!owner || !repo) {
    console.log("Invalid format. Use owner/repo");
    process.exit(1);
  }

  console.log(`Fetching ${owner}/${repo}...`);

  try {
    const repoData = await fetchRepo(owner, repo);
    const readme = await fetchReadme(owner, repo);
    const readResult = await readRepoSignalFiles(owner, repo);

    const prompt = buildPrompt(
      repoData.full_name,
      repoData.description,
      readme,
      detailed,
      quick,
      readResult.treeText,
      readResult.filesText
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
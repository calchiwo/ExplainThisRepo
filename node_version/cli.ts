#!/usr/bin/env node
import { fetchRepo, fetchReadme } from "./github.js";
import { buildPrompt } from "./prompt.js";
import { generateExplanation } from "./generate.js";
import { writeOutput } from "./writer.js";

async function main(): Promise<void> {
  const args: string[] = process.argv.slice(2);

  if (args.length !== 1) {
    console.log("Usage: explainthisrepo owner/repo");
    process.exit(1);
  }

  const target: string = args[0];

  if (!target.includes("/") || target.split("/").length !== 2) {
    console.log("Invalid format. Use owner/repo");
    process.exit(1);
  }

  const [owner, repo] = target.split("/");

  if (!owner || !repo) {
    console.log("Invalid format. Use owner/repo");
    process.exit(1);
  }

  console.log(`Fetching ${owner}/${repo}…`);

  try {
    const repoData = await fetchRepo(owner, repo);
    const readme = await fetchReadme(owner, repo);

    const prompt = buildPrompt(
      repoData.full_name,
      repoData.description,
      readme,
    );

    console.log("Generating explanation…");
    const output = await generateExplanation(prompt);

    console.log("Writing EXPLAIN.md…");
    writeOutput(output);

    const wordCount = output.split(/\s+/).length;

    console.log("EXPLAIN.md generated successfully 🎉");
    console.log(`Words: ${wordCount}`);
    console.log("\nOpen EXPLAIN.md to read it.");
  } catch (error: any) {
    console.error(error.message || "An unexpected error occurred.");
    process.exit(1);
  }
}

main();

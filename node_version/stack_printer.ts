import type { StackReport } from "./stack-detector.js";

function section(title: string, items: string[]): void {
  if (!items || items.length === 0) return;

  console.log(`\n${title}:`);
  for (const item of items) {
    console.log(`- ${item}`);
  }
}

export function printStack(
  report: StackReport,
  owner: string,
  repo: string
): void {
  console.log(`\nStack summary for ${owner}/${repo}`);

  section("Languages", report.languages);
  section("Runtime", report.runtimes);
  section("Frontend", report.frontend);
  section("Backend", report.backend);
  section("Databases / ORM", report.databases);
  section("Tooling", report.tooling);
  section("Infrastructure / Deploy", report.infra);
  section("Package Managers", report.packageManagers);

  console.log("");
}
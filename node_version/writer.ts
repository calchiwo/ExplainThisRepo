import fs from "fs";
import path from "path";

export function writeOutput(content: string): void {
  const outputPath = path.join(process.cwd(), "EXPLAIN.md");
  fs.writeFileSync(outputPath, content, "utf8");
}

import readline, { Interface as ReadlineInterface } from "node:readline";
import process from "node:process";
import chalk from "chalk";

import { writeConfig } from "./config.js";

interface HiddenReadlineInterface extends ReadlineInterface {
  _writeToOutput: (stringToWrite: string) => void;
}

const CONFIG_TEMPLATE = `[llm]
provider = "gemini"
api_key = "{api_key}"
`;

export async function runInit(): Promise<void> {
  const err = process.stderr;

  err.write(
    chalk.yellow(
      "WARNING: input is hidden. Paste your GEMINI_API_KEY and press Enter.\n\n"
    )
  );

  try {
    const apiKey = (await promptHidden("Gemini API key: ")).trim();

    if (!apiKey) {
      err.write(chalk.red("error: API key cannot be empty\n"));
      process.exit(1);
    }

    writeConfig(CONFIG_TEMPLATE.replace("{api_key}", apiKey));

    err.write("\r");
    err.write("\x1b[2K");
    err.write(chalk.green("Configuration written.\n"));
    process.exit(0);
  } catch {
    err.write(chalk.red("\nInterrupted.\n"));
    process.exit(130);
  }
}

function promptHidden(label: string): Promise<string> {
  const err = process.stderr;

  return new Promise((resolve) => {
    // 1. Print prompt ourselves
    err.write(label);

    // 2. Read input WITHOUT owning output
    const rl = readline.createInterface({
      input: process.stdin,
      output: undefined,
      terminal: true,
    }) as HiddenReadlineInterface;

    // 3. Disable echo
    rl._writeToOutput = () => {};

    rl.question("", (answer) => {
      rl.close();
      err.write("\n");
      resolve(answer);
    });
  });
}
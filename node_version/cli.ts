#!/usr/bin/env node

import fs from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

type TargetKey =
  | "darwin-x64"
  | "darwin-arm64"
  | "linux-x64"
  | "linux-arm64"
  | "win-x64";

function getTargetKey(): TargetKey {
  const platform = process.platform;
  const arch = process.arch;

  if (platform === "darwin" && arch === "x64") return "darwin-x64";
  if (platform === "darwin" && arch === "arm64") return "darwin-arm64";
  if (platform === "linux" && arch === "x64") return "linux-x64";
  if (platform === "linux" && arch === "arm64") return "linux-arm64";
  if (platform === "win32" && arch === "x64") return "win-x64";

  throw new Error(`Unsupported platform: ${platform} ${arch}`);
}

function getBinaryName(): string {
  return process.platform === "win32" ? "explainthisrepo.exe" : "explainthisrepo";
}

function getBinaryPath(): string {
  const launcherDir = path.dirname(fileURLToPath(import.meta.url));
  const binaryPath = path.join(
    launcherDir,
    "native",
    getTargetKey(),
    getBinaryName(),
  );

  if (!fs.existsSync(binaryPath)) {
    throw new Error(`Bundled binary not found: ${binaryPath}`);
  }

  return binaryPath;
}

function main(): never {
  try {
    const binaryPath = getBinaryPath();

    const result = spawnSync(binaryPath, process.argv.slice(2), {
      stdio: "inherit",
      windowsHide: true,
    });

    if (result.error) {
      throw result.error;
    }

    process.exit(result.status ?? 1);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`error: ${message}`);
    process.exit(1);
  }
}

main();
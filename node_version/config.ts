import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const CONFIG_DIR_NAME = "ExplainThisRepo";
const CONFIG_FILE_NAME = "config.toml";

export function getConfigPath(): string {
  if (process.platform === "win32") {
    const appdata = process.env.APPDATA;
    if (!appdata) {
      throw new Error("APPDATA environment variable is not set");
    }
    return path.join(appdata, CONFIG_DIR_NAME, CONFIG_FILE_NAME);
  }

  const xdg = process.env.XDG_CONFIG_HOME;
  const base = xdg ?? path.join(os.homedir(), ".config");
  return path.join(base, "explainthisrepo", CONFIG_FILE_NAME);
}

export function ensureConfigDir(): string {
  const configPath = getConfigPath();
  const dir = path.dirname(configPath);
  fs.mkdirSync(dir, { recursive: true });
  return configPath;
}

export function writeConfig(contents: string): void {
  const path = ensureConfigDir();
  fs.writeFileSync(path, contents, { encoding: "utf-8" });
}

export function readConfig(): string | null {
  const path = getConfigPath();
  if (!fs.existsSync(path)) return null;
  return fs.readFileSync(path, "utf-8");
}
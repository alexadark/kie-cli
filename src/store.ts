import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

interface Config {
  apiKey?: string;
}

const CONFIG_DIR = join(homedir(), ".config", "kie");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

const readConfig = (): Config => {
  if (!existsSync(CONFIG_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8")) as Config;
  } catch {
    return {};
  }
};

const writeConfig = (config: Config): void => {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n", "utf-8");
};

export const setApiKey = (key: string): void => {
  const config = readConfig();
  config.apiKey = key;
  writeConfig(config);
};

export const getStoredApiKey = (): string | undefined => {
  return readConfig().apiKey;
};

export const getConfigPath = (): string => CONFIG_FILE;

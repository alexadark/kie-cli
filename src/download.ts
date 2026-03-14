import { createWriteStream, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import chalk from "chalk";

const DEFAULT_DIR = join(homedir(), "Downloads");

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

const extFromUrl = (url: string): string => {
  const match = url.match(/\.(mp4|webm|mov|jpg|jpeg|png|webp)/i);
  return match ? match[1].toLowerCase() : "mp4";
};

export const downloadFile = async (
  url: string,
  outputDir: string | undefined,
  prompt: string,
  index: number,
): Promise<string> => {
  const dir = outputDir || DEFAULT_DIR;
  mkdirSync(dir, { recursive: true });

  const timestamp = Date.now();
  const slug = slugify(prompt);
  const ext = extFromUrl(url);
  const suffix = index > 0 ? `-${index + 1}` : "";
  const filename = `kie-${slug}${suffix}-${timestamp}.${ext}`;
  const filepath = join(dir, filename);

  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`Download failed: ${res.status}`);
  }

  await pipeline(
    Readable.fromWeb(res.body as never),
    createWriteStream(filepath),
  );

  console.log(chalk.green("  Downloaded:"), filepath);
  return filepath;
};

export const downloadAll = async (
  urls: string[],
  outputDir: string | undefined,
  prompt: string,
): Promise<void> => {
  for (let i = 0; i < urls.length; i++) {
    await downloadFile(urls[i], outputDir, prompt, i);
  }
};

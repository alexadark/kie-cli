import ora from "ora";
import chalk from "chalk";
import { request } from "./client.js";
import { DEFAULTS } from "./config.js";
import { downloadAll } from "./download.js";
import type {
  Provider,
  KlingTaskStatus,
  Veo3TaskStatus,
  MjTaskStatus,
} from "./types.js";

const parseResultUrls = (resultJson?: string): string[] => {
  if (!resultJson) return [];
  try {
    const parsed = JSON.parse(resultJson) as { resultUrls?: string[] };
    return parsed.resultUrls || [];
  } catch {
    return [];
  }
};

const parseMjUrls = (status: MjTaskStatus): string[] => {
  return (
    status.resultUrls?.resultUrls?.map((r) => r.resultUrl).filter(Boolean) || []
  );
};

export const pollTask = async (
  taskId: string,
  prompt: string,
  provider: Provider,
  outputDir?: string,
): Promise<void> => {
  const spinner = ora("Waiting for generation...").start();
  const startTime = Date.now();

  while (Date.now() - startTime < DEFAULTS.pollTimeout) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    spinner.text = `Generating... (${elapsed}s)`;

    try {
      if (provider === "veo3") {
        const status = await request<Veo3TaskStatus>(
          "GET",
          `/veo/record-info?taskId=${taskId}`,
        );
        if (status.successFlag === 1) {
          spinner.succeed("Generation complete!");
          const urls = status.response?.resultUrls || [];
          if (urls.length) await downloadAll(urls, outputDir, prompt);
          if (status.response?.resolution) {
            console.log(
              chalk.dim(`  Resolution: ${status.response.resolution}`),
            );
          }
          return;
        }
        if (status.successFlag >= 2) {
          spinner.fail(
            `Generation failed: ${status.errorMessage || "Unknown error"}`,
          );
          process.exit(1);
        }
      } else if (provider === "midjourney") {
        const status = await request<MjTaskStatus>(
          "GET",
          `/mj/record-info?taskId=${taskId}`,
        );
        if (status.successFlag === 1) {
          spinner.succeed("Generation complete!");
          const urls = parseMjUrls(status);
          if (urls.length) await downloadAll(urls, outputDir, prompt);
          return;
        }
        if (status.successFlag >= 2) {
          spinner.fail(
            `Generation failed: ${status.errorMessage || "Unknown error"}`,
          );
          process.exit(1);
        }
      } else {
        // kling + nano-banana
        const status = await request<KlingTaskStatus>(
          "GET",
          `/jobs/recordInfo?taskId=${taskId}`,
        );
        if (status.state === "success") {
          spinner.succeed("Generation complete!");
          const urls = parseResultUrls(status.resultJson);
          if (urls.length) await downloadAll(urls, outputDir, prompt);
          return;
        }
        if (status.state === "fail") {
          spinner.fail(
            `Generation failed: ${status.failMsg || "Unknown error"}`,
          );
          process.exit(1);
        }
        spinner.text = `${status.state}... (${elapsed}s)`;
      }
    } catch {
      spinner.text = `Retrying... (${elapsed}s)`;
    }

    await new Promise((resolve) => setTimeout(resolve, DEFAULTS.pollInterval));
  }

  spinner.fail("Polling timeout reached (10 minutes).");
  process.exit(1);
};

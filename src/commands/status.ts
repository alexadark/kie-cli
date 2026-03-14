import type { Command } from "commander";
import chalk from "chalk";
import { request } from "../client.js";
import { downloadAll } from "../download.js";
import type {
  Provider,
  KlingTaskStatus,
  Veo3TaskStatus,
  MjTaskStatus,
} from "../types.js";

const parseResultUrls = (resultJson?: string): string[] => {
  if (!resultJson) return [];
  try {
    const parsed = JSON.parse(resultJson) as { resultUrls?: string[] };
    return parsed.resultUrls || [];
  } catch {
    return [];
  }
};

const inferProvider = (taskId: string): Provider => {
  if (taskId.startsWith("veo")) return "veo3";
  return "kling";
};

export const registerStatusCommand = (program: Command): void => {
  program
    .command("status")
    .description("Check task status and download results")
    .argument("<taskId>", "Task ID to check")
    .option(
      "-p, --provider <provider>",
      "Provider (auto-detected for veo3, required for midjourney)",
    )
    .option("-o, --output <dir>", "Download directory (default: ~/Downloads)")
    .action(async (taskId: string, opts: Record<string, unknown>) => {
      const provider = (opts.provider as Provider) || inferProvider(taskId);

      try {
        if (provider === "veo3") {
          const data = await request<Veo3TaskStatus>(
            "GET",
            `/veo/record-info?taskId=${taskId}`,
          );
          const statusMap = [
            "Processing",
            "Completed",
            "Failed",
            "Generation Failed",
          ];
          const status = statusMap[data.successFlag] || "Unknown";
          console.log(`Task:   ${chalk.bold(data.taskId)}`);
          console.log(
            `Status: ${data.successFlag === 1 ? chalk.green(status) : data.successFlag >= 2 ? chalk.red(status) : chalk.yellow(status)}`,
          );
          if (data.response?.resultUrls?.length) {
            await downloadAll(
              data.response.resultUrls,
              opts.output as string,
              taskId,
            );
          }
          if (data.errorMessage) {
            console.log(chalk.red(`Error: ${data.errorMessage}`));
          }
        } else if (provider === "midjourney") {
          const data = await request<MjTaskStatus>(
            "GET",
            `/mj/record-info?taskId=${taskId}`,
          );
          const statusMap = [
            "Processing",
            "Completed",
            "Failed",
            "Generation Failed",
          ];
          const status = statusMap[data.successFlag] || "Unknown";
          console.log(`Task:   ${chalk.bold(data.taskId)}`);
          console.log(
            `Status: ${data.successFlag === 1 ? chalk.green(status) : data.successFlag >= 2 ? chalk.red(status) : chalk.yellow(status)}`,
          );
          if (data.successFlag === 1) {
            const urls =
              data.resultUrls?.resultUrls
                ?.map((r) => r.resultUrl)
                .filter(Boolean) || [];
            if (urls.length) {
              await downloadAll(urls, opts.output as string, taskId);
            }
          }
          if (data.errorMessage) {
            console.log(chalk.red(`Error: ${data.errorMessage}`));
          }
        } else {
          const data = await request<KlingTaskStatus>(
            "GET",
            `/jobs/recordInfo?taskId=${taskId}`,
          );
          const isSuccess = data.state === "success";
          const isFail = data.state === "fail";
          console.log(`Task:   ${chalk.bold(data.taskId)}`);
          console.log(
            `Status: ${isSuccess ? chalk.green(data.state) : isFail ? chalk.red(data.state) : chalk.yellow(data.state)}`,
          );
          if (isSuccess) {
            const urls = parseResultUrls(data.resultJson);
            if (urls.length) {
              await downloadAll(urls, opts.output as string, taskId);
            }
          }
          if (isFail && data.failMsg) {
            console.log(chalk.red(`Error: ${data.failMsg}`));
          }
        }
      } catch (err) {
        console.error(chalk.red("Error:"), (err as Error).message);
        process.exit(1);
      }
    });
};

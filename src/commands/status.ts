import type { Command } from "commander";
import chalk from "chalk";
import { request } from "../client.js";
import type { KlingTaskStatus, Veo3TaskStatus } from "../types.js";

const isVeo3Task = (taskId: string): boolean => taskId.startsWith("veo");

export const registerStatusCommand = (program: Command): void => {
  program
    .command("status")
    .description("Check task status")
    .argument("<taskId>", "Task ID to check")
    .action(async (taskId: string) => {
      try {
        if (isVeo3Task(taskId)) {
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
            console.log(chalk.green("\nResult URLs:"));
            data.response.resultUrls.forEach((url, i) =>
              console.log(`  ${i + 1}. ${url}`),
            );
          }
          if (data.response?.resolution) {
            console.log(chalk.dim(`Resolution: ${data.response.resolution}`));
          }
          if (data.errorMessage) {
            console.log(chalk.red(`Error: ${data.errorMessage}`));
          }
        } else {
          const data = await request<KlingTaskStatus>(
            "GET",
            `/jobs/recordInfo?taskId=${taskId}`,
          );
          const isSuccess = data.status === "success";
          const isFail = data.status === "fail";

          console.log(`Task:   ${chalk.bold(data.taskId)}`);
          console.log(
            `Status: ${isSuccess ? chalk.green(data.status) : isFail ? chalk.red(data.status) : chalk.yellow(data.status)}`,
          );

          if (data.works?.length) {
            console.log(chalk.green("\nResults:"));
            data.works.forEach((work, i) => {
              console.log(
                `  ${i + 1}. [${work.resource.resourceType}] ${work.resource.resource}`,
              );
            });
          }
        }
      } catch (err) {
        console.error(chalk.red("Error:"), (err as Error).message);
        process.exit(1);
      }
    });
};

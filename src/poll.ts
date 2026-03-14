import ora from "ora";
import chalk from "chalk";
import { request } from "./client.js";
import { DEFAULTS } from "./config.js";
import type { KlingTaskStatus, Veo3TaskStatus } from "./types.js";

const isVeo3Task = (taskId: string): boolean => taskId.startsWith("veo");

export const pollTask = async (taskId: string): Promise<void> => {
  const spinner = ora("Waiting for generation...").start();
  const startTime = Date.now();
  const isVeo3 = isVeo3Task(taskId);

  while (Date.now() - startTime < DEFAULTS.pollTimeout) {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    spinner.text = `Generating... (${elapsed}s)`;

    try {
      if (isVeo3) {
        const status = await request<Veo3TaskStatus>(
          "GET",
          `/veo/record-info?taskId=${taskId}`,
        );

        if (status.successFlag === 1) {
          spinner.succeed("Generation complete!");
          if (status.response?.resultUrls?.length) {
            console.log(chalk.green("\nResult URLs:"));
            status.response.resultUrls.forEach((url, i) =>
              console.log(`  ${i + 1}. ${url}`),
            );
          }
          if (status.response?.resolution) {
            console.log(chalk.dim(`Resolution: ${status.response.resolution}`));
          }
          return;
        }

        if (status.successFlag === 2 || status.successFlag === 3) {
          spinner.fail(
            `Generation failed: ${status.errorMessage || "Unknown error"}`,
          );
          process.exit(1);
        }
      } else {
        const status = await request<KlingTaskStatus>(
          "GET",
          `/jobs/recordInfo?taskId=${taskId}`,
        );

        if (status.status === "success") {
          spinner.succeed("Generation complete!");
          if (status.works?.length) {
            console.log(chalk.green("\nResults:"));
            status.works.forEach((work, i) => {
              console.log(
                `  ${i + 1}. [${work.resource.resourceType}] ${work.resource.resource}`,
              );
            });
          }
          return;
        }

        if (status.status === "fail") {
          spinner.fail("Generation failed.");
          process.exit(1);
        }

        spinner.text = `${status.status}... (${elapsed}s)`;
      }
    } catch {
      spinner.text = `Retrying... (${elapsed}s)`;
    }

    await new Promise((resolve) => setTimeout(resolve, DEFAULTS.pollInterval));
  }

  spinner.fail("Polling timeout reached (10 minutes).");
  process.exit(1);
};

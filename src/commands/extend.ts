import type { Command } from "commander";
import chalk from "chalk";
import { request } from "../client.js";
import { pollTask } from "../poll.js";
import type { TaskResponse } from "../types.js";

export const registerExtendCommand = (program: Command): void => {
  program
    .command("extend")
    .description("Extend a Veo3 video")
    .argument("<taskId>", "Original task ID")
    .argument("<prompt>", "Extension prompt")
    .option("-m, --model <model>", "Model: fast (default), quality")
    .option("--seed <n>", "Random seed", parseInt)
    .option("--callback <url>", "Webhook callback URL")
    .option("-w, --wait", "Wait for completion")
    .action(
      async (taskId: string, prompt: string, opts: Record<string, unknown>) => {
        const body: Record<string, unknown> = { taskId, prompt };
        if (opts.model) body.model = opts.model;
        if (opts.seed) body.seeds = opts.seed;
        if (opts.callback) body.callBackUrl = opts.callback;

        try {
          const result = await request<TaskResponse>(
            "POST",
            "/veo/extend",
            body,
          );
          console.log(chalk.green("Extension task created:"), result.taskId);

          if (opts.wait) {
            await pollTask(result.taskId);
          } else {
            console.log(
              chalk.dim(`\n  Check status: kie status ${result.taskId}`),
            );
          }
        } catch (err) {
          console.error(chalk.red("Error:"), (err as Error).message);
          process.exit(1);
        }
      },
    );
};

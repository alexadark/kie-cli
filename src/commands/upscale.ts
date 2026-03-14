import type { Command } from "commander";
import chalk from "chalk";
import { request } from "../client.js";
import { pollTask } from "../poll.js";

interface UpscaleResult {
  resultUrl?: string;
  taskId?: string;
  resultUrls?: string[];
}

export const registerUpscaleCommand = (program: Command): void => {
  program
    .command("upscale")
    .description("Upscale a Veo3 video to 1080p or 4K")
    .argument("<taskId>", "Task ID to upscale")
    .option("-q, --quality <quality>", "Quality: 1080p (default), 4k", "1080p")
    .option("--index <n>", "Video index (if multiple results)", parseInt, 0)
    .option("--callback <url>", "Webhook callback URL (4K only)")
    .option("-w, --wait", "Wait for completion (4K only)")
    .action(async (taskId: string, opts: Record<string, unknown>) => {
      try {
        if (opts.quality === "4k") {
          const body: Record<string, unknown> = { taskId };
          if (opts.index) body.index = opts.index;
          if (opts.callback) body.callBackUrl = opts.callback;

          const result = await request<UpscaleResult>(
            "POST",
            "/veo/get-4k-video",
            body,
          );
          console.log(chalk.green("4K upscale task created"));

          if (result.resultUrls?.length) {
            result.resultUrls.forEach((url, i) =>
              console.log(`  ${i + 1}. ${url}`),
            );
          } else if (result.taskId && opts.wait) {
            await pollTask(result.taskId);
          } else {
            console.log(chalk.dim(`  Check status: kie status ${taskId}`));
          }
        } else {
          const index = (opts.index as number) || 0;
          const result = await request<UpscaleResult>(
            "GET",
            `/veo/get-1080p-video?taskId=${taskId}&index=${index}`,
          );

          if (result.resultUrl) {
            console.log(chalk.green("1080p video ready:"));
            console.log(`  ${result.resultUrl}`);
          }
        }
      } catch (err) {
        console.error(chalk.red("Error:"), (err as Error).message);
        process.exit(1);
      }
    });
};

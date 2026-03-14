import type { Command } from "commander";
import chalk from "chalk";
import { request } from "../client.js";
import { DEFAULTS } from "../config.js";
import { pollTask } from "../poll.js";
import { buildKlingRequest } from "../providers/kling.js";
import { buildVeo3Request } from "../providers/veo3.js";
import { buildNanoBananaRequest } from "../providers/nano-banana.js";
import type { Provider, GenerateOptions, TaskResponse } from "../types.js";

const inferProvider = (model?: string): Provider => {
  if (!model) return DEFAULTS.provider;
  if (model.startsWith("veo")) return "veo3";
  if (model.startsWith("nano")) return "nano-banana";
  return "kling";
};

export const registerGenerateCommand = (program: Command): void => {
  program
    .command("gen")
    .description("Generate an image or video")
    .argument("<prompt>", "Text prompt for generation")
    .option("-p, --provider <provider>", "Provider: kling, veo3, nano-banana")
    .option("-m, --model <model>", "Model ID (overrides provider default)")
    .option("-a, --aspect-ratio <ratio>", "Aspect ratio", DEFAULTS.aspectRatio)
    .option("-d, --duration <seconds>", "Video duration in seconds")
    .option(
      "-i, --image <url>",
      "Input image URL (image-to-video or reference)",
    )
    .option("--tail-image <url>", "End frame image URL (kling v2.1 pro)")
    .option("--sound", "Enable sound (kling 2.6/3.0)")
    .option("--negative-prompt <text>", "Negative prompt (kling v2.1/v2.5)")
    .option("--cfg-scale <n>", "CFG scale 0-1 (kling v2.1/v2.5)", parseFloat)
    .option("--mode <mode>", "Quality mode: std, pro (kling 3.0)")
    .option("--resolution <res>", "Resolution: 1K, 2K, 4K (nano-banana)")
    .option("--format <fmt>", "Output format: jpg, png (nano-banana)")
    .option("--seed <n>", "Random seed (veo3)", parseInt)
    .option("--google-search", "Enable Google search grounding (nano-banana)")
    .option("--callback <url>", "Webhook callback URL")
    .option("-w, --wait", "Wait for completion (polls status)")
    .action(async (prompt: string, cmdOpts: Record<string, unknown>) => {
      const provider =
        (cmdOpts.provider as Provider) ||
        inferProvider(cmdOpts.model as string);

      const opts: GenerateOptions = {
        provider,
        model: cmdOpts.model as string,
        aspectRatio: cmdOpts.aspectRatio as string,
        duration: cmdOpts.duration as string,
        image: cmdOpts.image as string,
        tailImage: cmdOpts.tailImage as string,
        sound: cmdOpts.sound as boolean,
        negativePrompt: cmdOpts.negativePrompt as string,
        cfgScale: cmdOpts.cfgScale as number,
        mode: cmdOpts.mode as string,
        resolution: cmdOpts.resolution as string,
        format: cmdOpts.format as string,
        seed: cmdOpts.seed as number,
        googleSearch: cmdOpts.googleSearch as boolean,
        callback: cmdOpts.callback as string,
        wait: cmdOpts.wait as boolean,
      };

      let req;
      switch (provider) {
        case "veo3":
          req = buildVeo3Request(prompt, opts);
          break;
        case "nano-banana":
          req = buildNanoBananaRequest(prompt, opts);
          break;
        default:
          req = buildKlingRequest(prompt, opts);
      }

      try {
        const result = await request<TaskResponse>(
          req.method,
          req.path,
          req.body,
        );
        console.log(chalk.green("Task created:"), result.taskId);
        console.log(
          chalk.dim(
            `  Provider: ${provider} | Model: ${opts.model || "default"}`,
          ),
        );

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
    });
};

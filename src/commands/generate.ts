import type { Command } from "commander";
import chalk from "chalk";
import { request } from "../client.js";
import { DEFAULTS } from "../config.js";
import { pollTask } from "../poll.js";
import { buildKlingRequest } from "../providers/kling.js";
import { buildVeo3Request } from "../providers/veo3.js";
import { buildNanoBananaRequest } from "../providers/nano-banana.js";
import { buildMjRequest } from "../providers/midjourney.js";
import type { Provider, GenerateOptions, TaskResponse } from "../types.js";

const inferProvider = (model?: string): Provider => {
  if (!model) return DEFAULTS.provider;
  if (model.startsWith("veo")) return "veo3";
  if (model.startsWith("nano")) return "nano-banana";
  if (model.startsWith("mj") || model.startsWith("midjourney"))
    return "midjourney";
  return "kling";
};

export const registerGenerateCommand = (program: Command): void => {
  program
    .command("gen")
    .description("Generate an image or video")
    .argument("<prompt>", "Text prompt for generation")
    .option(
      "-p, --provider <provider>",
      "Provider: kling, veo3, nano-banana, midjourney",
    )
    .option("-m, --model <model>", "Model ID (overrides provider default)")
    .option("-a, --aspect-ratio <ratio>", "Aspect ratio", DEFAULTS.aspectRatio)
    .option("-d, --duration <seconds>", "Video duration in seconds")
    .option(
      "-i, --image <url>",
      "Input image URL (image-to-video or reference)",
    )
    .option("--tail-image <url>", "End frame image URL (kling v2.1 pro)")
    .option("--sound", "Enable sound (kling 3.0)")
    .option("--negative-prompt <text>", "Negative prompt (kling v2.1/v2.5)")
    .option("--cfg-scale <n>", "CFG scale 0-1 (kling v2.1/v2.5)", parseFloat)
    .option("--mode <mode>", "Quality mode: std, pro (kling 3.0)")
    .option("--resolution <res>", "Resolution: 1K, 2K, 4K (nano-banana)")
    .option("--format <fmt>", "Output format: jpg, png (nano-banana)")
    .option("--seed <n>", "Random seed (veo3)", parseInt)
    .option("--google-search", "Enable Google search grounding (nano-banana)")
    .option("--stylization <n>", "Stylization 0-1000 (midjourney)", parseInt)
    .option("--weirdness <n>", "Weirdness 0-3000 (midjourney)", parseInt)
    .option("--variety <n>", "Variety 0-100 (midjourney)", parseInt)
    .option("--speed <mode>", "Speed: relaxed, fast, turbo (midjourney)")
    .option(
      "--version <v>",
      "MJ version: 7, 6.1, 6, 5.2, niji-6, niji-7 (midjourney)",
    )
    .option("-o, --output <dir>", "Download directory (default: ~/Downloads)")
    .option("--callback <url>", "Webhook callback URL")
    .option("--no-wait", "Don't wait for completion (just return taskId)")
    .action(async (prompt: string, cmdOpts: Record<string, unknown>) => {
      const provider =
        (cmdOpts.provider as Provider) ||
        inferProvider(cmdOpts.model as string);

      // Use provider-specific default aspect ratio for image providers
      let aspectRatio = cmdOpts.aspectRatio as string;
      if (
        aspectRatio === DEFAULTS.aspectRatio &&
        (provider === "midjourney" || provider === "nano-banana")
      ) {
        aspectRatio =
          provider === "midjourney"
            ? DEFAULTS.midjourney.aspectRatio
            : DEFAULTS.nanoBanana.aspectRatio;
      }

      const opts: GenerateOptions = {
        provider,
        model: cmdOpts.model as string,
        aspectRatio,
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
        stylization: cmdOpts.stylization as number,
        weirdness: cmdOpts.weirdness as number,
        variety: cmdOpts.variety as number,
        speed: cmdOpts.speed as string,
        version: cmdOpts.version as string,
      };

      let req;
      switch (provider) {
        case "veo3":
          req = buildVeo3Request(prompt, opts);
          break;
        case "nano-banana":
          req = buildNanoBananaRequest(prompt, opts);
          break;
        case "midjourney":
          req = buildMjRequest(prompt, opts);
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
          await pollTask(
            result.taskId,
            prompt,
            provider,
            cmdOpts.output as string,
          );
        } else {
          console.log(
            chalk.dim(
              `\n  Check status: kie status ${result.taskId} -p ${provider}`,
            ),
          );
        }
      } catch (err) {
        console.error(chalk.red("Error:"), (err as Error).message);
        process.exit(1);
      }
    });
};

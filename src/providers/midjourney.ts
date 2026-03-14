import type { GenerateOptions, ProviderRequest } from "../types.js";
import { DEFAULTS } from "../config.js";

export const buildMjRequest = (
  prompt: string,
  opts: GenerateOptions,
): ProviderRequest => {
  const body: Record<string, unknown> = {
    taskType: opts.image ? "mj_img2Img" : "mj_txt2Img",
    prompt,
    aspectRatio: opts.aspectRatio,
    speed: opts.speed || DEFAULTS.midjourney.speed,
    version: opts.version || DEFAULTS.midjourney.version,
  };

  if (opts.stylization !== undefined) body.stylization = opts.stylization;
  if (opts.weirdness !== undefined) body.weirdness = opts.weirdness;
  if (opts.variety !== undefined) body.variety = opts.variety;
  if (opts.image) body.imageUrls = [opts.image];
  if (opts.callback) body.callBackUrl = opts.callback;

  return { method: "POST", path: "/mj/generateImage", body };
};

import type { GenerateOptions, ProviderRequest } from "../types.js";
import { DEFAULTS } from "../config.js";

export const buildVeo3Request = (
  prompt: string,
  opts: GenerateOptions,
): ProviderRequest => {
  const body: Record<string, unknown> = {
    prompt,
    model: opts.model || DEFAULTS.veo3.model,
    aspect_ratio: opts.aspectRatio,
  };

  if (opts.image) body.imageUrls = [opts.image];
  if (opts.seed) body.seeds = opts.seed;
  if (opts.callback) body.callBackUrl = opts.callback;

  return { method: "POST", path: "/veo/generate", body };
};

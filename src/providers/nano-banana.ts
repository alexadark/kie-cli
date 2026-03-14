import type { GenerateOptions, ProviderRequest } from "../types.js";
import { DEFAULTS } from "../config.js";

export const buildNanoBananaRequest = (
  prompt: string,
  opts: GenerateOptions,
): ProviderRequest => {
  const input: Record<string, unknown> = {
    prompt,
    aspect_ratio: opts.aspectRatio,
    resolution: opts.resolution || DEFAULTS.nanoBanana.resolution,
    output_format: opts.format || DEFAULTS.nanoBanana.format,
  };

  if (opts.image) input.image_input = [opts.image];
  if (opts.googleSearch) input.google_search = true;

  const body: Record<string, unknown> = {
    model: DEFAULTS.nanoBanana.model,
    input,
  };

  if (opts.callback) body.callBackUrl = opts.callback;

  return { method: "POST", path: "/jobs/createTask", body };
};

import type { GenerateOptions, ProviderRequest } from "../types.js";
import { DEFAULTS } from "../config.js";

export const buildKlingRequest = (
  prompt: string,
  opts: GenerateOptions,
): ProviderRequest => {
  const model = opts.model || DEFAULTS.kling.model;

  const input: Record<string, unknown> = {
    prompt,
    duration: opts.duration || DEFAULTS.kling.duration,
    aspect_ratio: opts.aspectRatio,
    mode: opts.mode || DEFAULTS.kling.mode,
    sound: opts.sound ?? true,
    multi_shots: false,
    multi_prompt: [],
  };

  if (opts.image) input.image_urls = [opts.image];
  if (opts.tailImage) input.tail_image_url = opts.tailImage;
  if (opts.negativePrompt) input.negative_prompt = opts.negativePrompt;
  if (opts.cfgScale !== undefined) input.cfg_scale = opts.cfgScale;

  const body: Record<string, unknown> = { model, input };
  if (opts.callback) body.callBackUrl = opts.callback;

  return { method: "POST", path: "/jobs/createTask", body };
};

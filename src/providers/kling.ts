import type { GenerateOptions, ProviderRequest } from "../types.js";
import { DEFAULTS } from "../config.js";

export const buildKlingRequest = (
  prompt: string,
  opts: GenerateOptions,
): ProviderRequest => {
  let model = opts.model || DEFAULTS.kling.model;

  // Auto-append type suffix for base model names
  if (model === "kling-2.6") {
    model = opts.image ? "kling-2.6/image-to-video" : "kling-2.6/text-to-video";
  }

  const input: Record<string, unknown> = { prompt };

  // Image field varies by model version
  if (opts.image) {
    if (model.includes("2.6") || model.includes("3.0")) {
      input.image_urls = [opts.image];
    } else {
      input.image_url = opts.image;
    }
  }

  input.aspect_ratio = opts.aspectRatio;
  input.duration = opts.duration || DEFAULTS.kling.duration;

  if (opts.sound) input.sound = true;
  if (opts.negativePrompt) input.negative_prompt = opts.negativePrompt;
  if (opts.cfgScale !== undefined) input.cfg_scale = opts.cfgScale;
  if (opts.mode) input.mode = opts.mode;
  if (opts.tailImage) input.tail_image_url = opts.tailImage;

  const body: Record<string, unknown> = { model, input };
  if (opts.callback) body.callBackUrl = opts.callback;

  return { method: "POST", path: "/jobs/createTask", body };
};

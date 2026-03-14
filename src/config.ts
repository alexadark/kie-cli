import type { Provider } from "./types.js";

export const BASE_URL = "https://api.kie.ai/api/v1";

export const DEFAULTS = {
  aspectRatio: "9:16",
  provider: "kling" as Provider,
  pollInterval: 5000,
  pollTimeout: 600_000,
  kling: {
    model: "kling-3.0/video",
    duration: "10",
    mode: "std",
  },
  veo3: {
    model: "veo3_fast",
  },
  nanoBanana: {
    model: "nano-banana-2",
    resolution: "1K",
    format: "jpg",
    aspectRatio: "16:9",
  },
  midjourney: {
    speed: "fast",
    version: "7",
    aspectRatio: "16:9",
  },
} as const;

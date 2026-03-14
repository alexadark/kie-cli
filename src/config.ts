import type { Provider } from "./types.js";

export const BASE_URL = "https://api.kie.ai/api/v1";

export const DEFAULTS = {
  aspectRatio: "9:16",
  provider: "kling" as Provider,
  pollInterval: 5000,
  pollTimeout: 600_000,
  kling: {
    model: "kling-2.6",
    duration: "5",
  },
  veo3: {
    model: "veo3_fast",
  },
  nanoBanana: {
    model: "nano-banana-2",
    resolution: "1K",
    format: "jpg",
  },
} as const;

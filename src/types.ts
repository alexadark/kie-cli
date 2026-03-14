export type Provider = "kling" | "veo3" | "nano-banana" | "midjourney";

export interface GenerateOptions {
  provider: Provider;
  model?: string;
  aspectRatio: string;
  duration?: string;
  image?: string;
  tailImage?: string;
  sound?: boolean;
  negativePrompt?: string;
  cfgScale?: number;
  callback?: string;
  wait?: boolean;
  resolution?: string;
  format?: string;
  seed?: number;
  googleSearch?: boolean;
  mode?: string;
  // MidJourney specific
  stylization?: number;
  weirdness?: number;
  variety?: number;
  speed?: string;
  version?: string;
}

export interface ProviderRequest {
  method: string;
  path: string;
  body: Record<string, unknown>;
}

export interface TaskResponse {
  taskId: string;
}

export interface KlingTaskStatus {
  taskId: string;
  state: string;
  resultJson?: string;
  failCode?: string;
  failMsg?: string;
  costTime?: number;
}

export interface Veo3TaskStatus {
  taskId: string;
  successFlag: number;
  createTime?: string;
  completeTime?: string;
  errorCode?: string;
  errorMessage?: string;
  response?: {
    resultUrls?: string[];
    originUrls?: string[];
    resolution?: string;
  };
}

export interface MjTaskStatus {
  taskId: string;
  successFlag: number;
  errorCode?: string | null;
  errorMessage?: string | null;
  resultUrls?: {
    resultUrls?: Array<{ resultUrl: string }>;
  };
}

export interface CreditData {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
}

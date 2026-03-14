export type Provider = "kling" | "veo3" | "nano-banana";

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
  status: string;
  works?: Array<{
    workId: string;
    status: string;
    resource: {
      resourceType: string;
      resource: string;
    };
  }>;
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

export interface CreditData {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
}

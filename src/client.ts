import { BASE_URL } from "./config.js";
import { getStoredApiKey } from "./store.js";

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export const getApiKey = (): string => {
  const key = process.env.KIE_API_KEY || getStoredApiKey();
  if (!key) {
    console.error("Error: No API key found.");
    console.error("Set it with: kie auth <your-api-key>");
    process.exit(1);
  }
  return key;
};

export const request = async <T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> => {
  const url = `${BASE_URL}${path}`;

  const init: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
  };

  if (body && method !== "GET") {
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);
  const data = (await res.json()) as ApiResponse<T>;

  if (!res.ok || (data.code && data.code !== 200)) {
    throw new Error(
      `API Error (${data.code || res.status}): ${data.msg || res.statusText}`,
    );
  }

  return data.data;
};

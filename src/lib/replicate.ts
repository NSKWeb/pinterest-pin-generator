import type { ImagePrompt, PinIdea } from "@/types";

const REPLICATE_API_URL = "https://api.replicate.com/v1";
const DEFAULT_MODEL = "meta/llama-3-8b-instruct";
const REQUEST_TIMEOUT = 60_000;

class ReplicateError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ReplicateError";
    this.status = status;
  }
}

type ReplicatePrediction = {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string | string[];
  error?: string | null;
  urls: {
    get: string;
  };
};

const getReplicateToken = () => {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new ReplicateError("Missing Replicate API token.", 500);
  }
  return token;
};

export const initializeReplicate = () => {
  return {
    token: getReplicateToken(),
    model: process.env.REPLICATE_LLAMA_MODEL ?? DEFAULT_MODEL,
  };
};

const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

const createPrediction = async (prompt: string, systemPrompt: string) => {
  const { token, model } = initializeReplicate();
  const response = await fetchWithTimeout(`${REPLICATE_API_URL}/models/${model}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: {
        prompt,
        system_prompt: systemPrompt,
        temperature: 0.8,
        max_tokens: 900,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new ReplicateError(errorText || "Replicate API error.", response.status);
  }

  return (await response.json()) as ReplicatePrediction;
};

const pollPrediction = async (prediction: ReplicatePrediction) => {
  const { token } = initializeReplicate();
  let current = prediction;
  const startTime = Date.now();

  while (["starting", "processing"].includes(current.status)) {
    if (Date.now() - startTime > REQUEST_TIMEOUT) {
      throw new ReplicateError("Replicate request timed out.", 408);
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));

    const response = await fetchWithTimeout(current.urls.get, {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ReplicateError(errorText || "Replicate API error.", response.status);
    }

    current = (await response.json()) as ReplicatePrediction;
  }

  if (current.status === "failed" || current.status === "canceled") {
    throw new ReplicateError(current.error || "Replicate prediction failed.", 500);
  }

  return current.output ?? "";
};

const normalizeOutput = (output: string | string[]) => {
  if (Array.isArray(output)) {
    return output.join("").trim();
  }
  return output.trim();
};

const extractJsonPayload = (value: string) => {
  const withoutFence = value.replace(/```(json)?/gi, "").trim();
  const objectStart = withoutFence.indexOf("{");
  const objectEnd = withoutFence.lastIndexOf("}");
  const arrayStart = withoutFence.indexOf("[");
  const arrayEnd = withoutFence.lastIndexOf("]");

  if (objectStart !== -1 && objectEnd !== -1) {
    return withoutFence.slice(objectStart, objectEnd + 1);
  }

  if (arrayStart !== -1 && arrayEnd !== -1) {
    return withoutFence.slice(arrayStart, arrayEnd + 1);
  }

  throw new ReplicateError("Invalid JSON response from AI.", 500);
};

export const parseIdeaResponse = (raw: string): PinIdea[] => {
  const jsonText = extractJsonPayload(raw);
  const parsed = JSON.parse(jsonText) as { ideas?: Array<Partial<PinIdea>> } | Array<Partial<PinIdea>>;
  const ideas = Array.isArray(parsed) ? parsed : parsed.ideas;

  if (!ideas || !Array.isArray(ideas)) {
    throw new ReplicateError("Invalid JSON response from AI.", 500);
  }

  return ideas
    .filter((idea) => idea && typeof idea.title === "string")
    .map((idea) => ({
      id: `idea-${crypto.randomUUID()}`,
      title: String(idea.title ?? "Untitled idea"),
      description: String(idea.description ?? ""),
      keywords: Array.isArray(idea.keywords)
        ? idea.keywords.map((keyword) => String(keyword))
        : [],
    }));
};

export const parsePromptResponse = (raw: string): ImagePrompt[] => {
  const jsonText = extractJsonPayload(raw);
  const parsed = JSON.parse(jsonText) as { prompts?: Array<Partial<ImagePrompt>> } | Array<Partial<ImagePrompt>>;
  const prompts = Array.isArray(parsed) ? parsed : parsed.prompts;

  if (!prompts || !Array.isArray(prompts)) {
    throw new ReplicateError("Invalid JSON response from AI.", 500);
  }

  return prompts
    .filter((prompt) => prompt && typeof prompt.main_prompt === "string")
    .map((prompt) => ({
      id: `prompt-${crypto.randomUUID()}`,
      main_prompt: String(prompt.main_prompt ?? ""),
      style_guide: String(prompt.style_guide ?? ""),
      negative_prompt: String(prompt.negative_prompt ?? ""),
    }));
};

export const generateIdeasWithLlama = async (topic: string, niche: string, count: number) => {
  const systemPrompt =
    "You are an expert Pinterest content strategist. Generate creative, engaging Pinterest pin ideas for the provided niche. Each idea should have a compelling title, engaging description, and relevant keywords for Pinterest SEO.";
  const userPrompt = `Generate ${count} Pinterest pin ideas for the topic: ${topic}\nFormat as JSON array with structure:\n{\n  \"ideas\": [\n    {\n      \"title\": \"...\",\n      \"description\": \"...\",\n      \"keywords\": [\"keyword1\", \"keyword2\", ...]\n    }\n  ]\n}\nReturn ONLY valid JSON, no extra text.`;

  console.info("[Replicate] Generating ideas", { topic, niche, count });

  const prediction = await createPrediction(
    `Niche: ${niche}\n\n${userPrompt}`,
    systemPrompt,
  );
  const output = await pollPrediction(prediction);
  const normalized = normalizeOutput(output);
  return parseIdeaResponse(normalized);
};

export const generatePromptsWithLlama = async (idea: { title: string; description: string }, variations: number) => {
  const systemPrompt =
    "You are an expert AI art prompt engineer specializing in Pinterest pins. Create detailed, vivid image prompts for Stable Diffusion that will generate beautiful, professional-looking pins. Include style, composition, colors, and lighting details.";
  const userPrompt = `Create an image prompt for this Pinterest pin idea:\nTitle: ${idea.title}\nDescription: ${idea.description}\n\nGenerate ${variations} different prompt variations.\nFormat as JSON:\n{\n  \"prompts\": [\n    {\n      \"main_prompt\": \"detailed description...\",\n      \"style_guide\": \"artistic style...\",\n      \"negative_prompt\": \"what to avoid...\"\n    }\n  ]\n}\nReturn ONLY valid JSON.`;

  console.info("[Replicate] Generating prompts", { title: idea.title, variations });

  const prediction = await createPrediction(userPrompt, systemPrompt);
  const output = await pollPrediction(prediction);
  const normalized = normalizeOutput(output);
  return parsePromptResponse(normalized);
};

export const handleReplicateError = (error: unknown) => {
  if (error instanceof ReplicateError) {
    return {
      message: error.message,
      status: error.status ?? 500,
    };
  }

  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return { message: "Network error. Please try again.", status: 408 };
    }
    if (error.message.toLowerCase().includes("rate limit")) {
      return { message: "API rate limit reached. Please try again.", status: 429 };
    }
    return { message: error.message || "API error. Please try again in a few moments.", status: 500 };
  }

  return { message: "API error. Please try again in a few moments.", status: 500 };
};

import "server-only";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGroq } from "@ai-sdk/groq";
import { customProvider } from "ai";

// Mirrors @ai-sdk/provider's SharedV2ProviderOptions / JSONValue
type JSONValue = string | number | boolean | null | { [k: string]: JSONValue } | JSONValue[];
type ProviderOptions = Record<string, Record<string, JSONValue>>;

const AI_PROVIDER = process.env.AI_PROVIDER ?? "google";

function buildProvider() {
  switch (AI_PROVIDER) {
    case "openai": {
      if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required when AI_PROVIDER=openai");
      const client = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
      return customProvider({
        languageModels: {
          base: client("gpt-4o"),
          "theme-generation": client("gpt-4o"),
          "prompt-enhancement": client("gpt-4o-mini"),
        },
      });
    }
    case "anthropic": {
      if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is required when AI_PROVIDER=anthropic");
      const client = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      return customProvider({
        languageModels: {
          base: client("claude-sonnet-4-6"),
          "theme-generation": client("claude-sonnet-4-6"),
          "prompt-enhancement": client("claude-haiku-4-5-20251001"),
        },
      });
    }
    case "groq": {
      if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is required when AI_PROVIDER=groq");
      const client = createGroq({ apiKey: process.env.GROQ_API_KEY });
      return customProvider({
        languageModels: {
          base: client("llama-3.3-70b-versatile"),
          "theme-generation": client("llama-3.3-70b-versatile"),
          "prompt-enhancement": client("llama-3.1-8b-instant"),
        },
      });
    }
    default: {
      if (!process.env.GOOGLE_API_KEY) throw new Error("GOOGLE_API_KEY is required when AI_PROVIDER=google");
      const client = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });
      return customProvider({
        languageModels: {
          base: client("gemini-2.5-flash"),
          "theme-generation": client("gemini-2.5-flash"),
          "prompt-enhancement": client("gemini-2.5-flash"),
        },
      });
    }
  }
}

export const myProvider = buildProvider();

// Gemini-specific thinking config — empty for all other providers
export const baseProviderOptions: ProviderOptions =
  AI_PROVIDER === "google"
    ? { google: { thinkingConfig: { includeThoughts: false, thinkingBudget: 128 } } }
    : {};

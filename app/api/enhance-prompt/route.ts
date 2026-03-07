import { ENHANCE_PROMPT_SYSTEM } from "@/lib/ai/prompts";
import { baseProviderOptions, myProvider } from "@/lib/ai/providers";
import { handleError } from "@/lib/error-response";
import { getCurrentUserId } from "@/lib/shared";
import { requireSubscriptionOrFreeUsage } from "@/lib/subscription";
import { AIPromptData } from "@/types/ai";
import { buildUserContentPartsFromPromptData } from "@/utils/ai/message-converter";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { smoothStream, streamText } from "ai";
import { NextRequest } from "next/server";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(10, "60s"),
});

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req);

    if (process.env.NODE_ENV !== "development") {
      const { success, limit, reset, remaining } = await ratelimit.limit(userId);
      if (!success) {
        return new Response("Rate limit exceeded. Please try again later.", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
    }

    await requireSubscriptionOrFreeUsage(req);

    const body = await req.json();
    const { prompt: _prompt, promptData }: { prompt: string; promptData: AIPromptData } = body;
    const userContentParts = buildUserContentPartsFromPromptData(promptData);

    const result = streamText({
      system: ENHANCE_PROMPT_SYSTEM,
      messages: [
        {
          role: "user",
          content: userContentParts,
        },
      ],
      model: myProvider.languageModel("prompt-enhancement"),
      providerOptions: baseProviderOptions,
      experimental_transform: smoothStream({
        delayInMs: 10,
        chunking: "word",
      }),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    return handleError(error, { route: "/api/enhance-prompt" });
  }
}

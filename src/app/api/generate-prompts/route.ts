import { NextResponse } from "next/server";
import { PROMPT_VARIATIONS } from "@/lib/config";
import { generatePromptsWithLlama, handleReplicateError } from "@/lib/replicate";
import type { PinIdea, PromptResponse } from "@/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      ideaId?: string;
      idea?: PinIdea;
      variations?: number;
    };

    if (!body.ideaId || !body.idea) {
      return NextResponse.json(
        { success: false, message: "Invalid input. Please check your idea." },
        { status: 400 },
      );
    }

    const variations = body.variations;
    if (!PROMPT_VARIATIONS.includes(variations as (typeof PROMPT_VARIATIONS)[number])) {
      return NextResponse.json(
        { success: false, message: "Invalid input. Please check your idea." },
        { status: 400 },
      );
    }

    const prompts = await generatePromptsWithLlama(body.idea, variations as number);

    const response: PromptResponse = {
      success: true,
      ideaId: body.ideaId,
      prompts,
      variationCount: prompts.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    const handled = handleReplicateError(error);
    return NextResponse.json(
      { success: false, message: handled.message },
      { status: handled.status ?? 500 },
    );
  }
}

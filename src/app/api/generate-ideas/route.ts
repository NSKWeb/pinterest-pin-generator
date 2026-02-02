import { NextResponse } from "next/server";
import { IDEA_OPTIONS, PIN_NICHES } from "@/lib/config";
import { generateIdeasWithLlama, handleReplicateError } from "@/lib/replicate";
import type { IdeaResponse } from "@/types";

const normalizeInput = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      topic?: string;
      niche?: string;
      count?: number;
    };

    const topic = normalizeInput(body.topic);
    const niche = normalizeInput(body.niche);
    const count = body.count;

    if (!topic || topic.length > 50) {
      return NextResponse.json(
        { success: false, message: "Invalid input. Please check your topic and niche." },
        { status: 400 },
      );
    }

    if (!niche || !PIN_NICHES.includes(niche as (typeof PIN_NICHES)[number])) {
      return NextResponse.json(
        { success: false, message: "Invalid input. Please check your topic and niche." },
        { status: 400 },
      );
    }

    if (!IDEA_OPTIONS.includes(count as (typeof IDEA_OPTIONS)[number])) {
      return NextResponse.json(
        { success: false, message: "Invalid input. Please check your topic and niche." },
        { status: 400 },
      );
    }

    const ideas = await generateIdeasWithLlama(topic, niche, count as number);

    const response: IdeaResponse = {
      success: true,
      ideas,
      count: ideas.length,
      generatedAt: new Date().toISOString(),
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

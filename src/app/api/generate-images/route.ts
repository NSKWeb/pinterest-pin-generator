import { NextRequest, NextResponse } from "next/server";
import { generateImagesWithStableDiffusion, handleReplicateError } from "@/lib/replicate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, negative_prompt, variations, quality, aspectRatio } = body;

    if (!prompt) {
      return NextResponse.json({ message: "Prompt is required" }, { status: 400 });
    }

    const num_inference_steps = quality === "best" ? 50 : 25;
    
    const prediction = await generateImagesWithStableDiffusion({
      prompt,
      negative_prompt: negative_prompt || "ugly, deformed, blurry, low quality, distorted",
      num_outputs: variations || 1,
      num_inference_steps,
      aspect_ratio: aspectRatio || "1000x1500",
    });

    return NextResponse.json({
      success: true,
      predictionId: prediction.id,
      status: prediction.status,
    });
  } catch (error) {
    console.error("[API Generate Images] Error:", error);
    const { message, status } = handleReplicateError(error);
    return NextResponse.json({ message }, { status });
  }
}

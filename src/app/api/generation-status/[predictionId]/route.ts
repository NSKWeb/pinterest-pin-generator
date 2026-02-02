import { NextRequest, NextResponse } from "next/server";
import { pollPredictionStatus, handleReplicateError } from "@/lib/replicate";

export async function GET(
  req: NextRequest,
  { params }: { params: { predictionId: string } }
) {
  try {
    const predictionId = params.predictionId;

    if (!predictionId) {
      return NextResponse.json({ message: "Prediction ID is required" }, { status: 400 });
    }

    const prediction = await pollPredictionStatus(predictionId);

    return NextResponse.json({
      success: true,
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    });
  } catch (error) {
    console.error("[API Generation Status] Error:", error);
    const { message, status } = handleReplicateError(error);
    return NextResponse.json({ message }, { status });
  }
}

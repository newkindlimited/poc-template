import { NextResponse } from "next/server";
import { runSeed } from "@/db/seed";

/**
 * One-shot seed endpoint. Hit by middleware on first request after deploy.
 * Idempotent — skip if already seeded.
 */
export async function GET() {
  try {
    const result = await runSeed();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

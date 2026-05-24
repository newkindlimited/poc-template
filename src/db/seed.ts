import { db } from "./index";
import { meta } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Idempotent seed runner. Called by /api/seed on first request.
 *
 * Claude Code REPLACES this with a full seed function that populates 30+
 * entities per major table with industry-realistic data — actual UK firm
 * names, real-looking SKUs, plausible quote histories, etc. The richness
 * of the seed is what makes the POC "hit different" — not feature count.
 */
export async function runSeed() {
  // Idempotency check
  try {
    const existing = await db.select().from(meta).where(eq(meta.key, "seeded"));
    if (existing[0]?.value === "1") {
      return { status: "already_seeded" };
    }
  } catch {
    // Schema may not exist yet — let it run
  }

  // CLAUDE: replace everything below with the real seed for this target

  await db.insert(meta).values({ key: "seeded", value: "1" }).onConflictDoNothing();
  return { status: "seeded" };
}

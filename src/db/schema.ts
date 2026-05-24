import { pgTable, uuid, text, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";

// Claude Code REPLACES this entire file with the target's actual data model.
// The schema below is a stub — a "seeded" flag table so we know not to
// re-seed on every cold start.

export const meta = pgTable("forge_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Re-export so Claude Code can append without re-importing helpers
export { pgTable, uuid, text, timestamp, integer, decimal, boolean };

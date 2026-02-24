import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  displayName: text("display_name").notNull(),
  pronouns: text("pronouns"),
  tagline: text("tagline"),
  voiceNotes: text("voice_notes").notNull(),
  boundaries: text("boundaries").notNull(),
  beliefs: text("beliefs").notNull(),
  regrets: text("regrets"),
  memory1: text("memory_1").notNull(),
  memory2: text("memory_2"),
  verifierRules: text("verifier_rules").notNull(),
  futureAudience: text("future_audience"),
  profileData: jsonb("profile_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

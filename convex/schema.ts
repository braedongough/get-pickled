import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  batches: defineTable({
    name: v.string(),
    ingredientId: v.string(),
    method: v.union(v.literal("quick"), v.literal("fermented")),
    brineId: v.string(),
    startedAt: v.number(),
    readyDays: v.number(),
    shelfLifeDays: v.number(),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("eaten"),
      v.literal("discarded"),
    ),
  }).index("by_status", ["status"]),

  recipes: defineTable({
    name: v.string(),
    method: v.union(v.literal("quick"), v.literal("fermented")),
    description: v.optional(v.string()),
    ingredients: v.array(v.string()),
    steps: v.array(v.string()),
  }),
});

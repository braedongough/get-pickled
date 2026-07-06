import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("batches").order("desc").take(100);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    ingredientId: v.string(),
    method: v.union(v.literal("quick"), v.literal("fermented")),
    brineId: v.string(),
    startedAt: v.number(),
    readyDays: v.number(),
    shelfLifeDays: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("batches", { ...args, status: "active" });
  },
});

export const setStatus = mutation({
  args: {
    id: v.id("batches"),
    status: v.union(
      v.literal("active"),
      v.literal("eaten"),
      v.literal("discarded"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch("batches", args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("batches") },
  handler: async (ctx, args) => {
    await ctx.db.delete("batches", args.id);
  },
});

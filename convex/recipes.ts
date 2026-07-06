import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("recipes").order("desc").take(100);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    method: v.union(v.literal("quick"), v.literal("fermented")),
    description: v.optional(v.string()),
    ingredients: v.array(v.string()),
    steps: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("recipes", args);
  },
});

export const remove = mutation({
  args: { id: v.id("recipes") },
  handler: async (ctx, args) => {
    await ctx.db.delete("recipes", args.id);
  },
});

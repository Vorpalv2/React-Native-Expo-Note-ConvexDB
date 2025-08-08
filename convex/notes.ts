import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const get = query(async (ctx) => {
  const notes = await ctx.db.query("notes").collect();
  return notes;
});

export const deleteTask = mutation({
  args: {
    id: v.id("notes"),
  },
  handler: async (ctx, args) => {
    console.log("Attempting to delete note with ID:", args.id);
    try {
      await ctx.db.delete(args.id);
      console.log("Successfully deleted note");
      return { success: true };
    } catch (error) {
      console.error("Failed to delete note:", error);
      return { success: false, error };
    }
  },
});

export const createTask = mutation({
  args: { title: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    try {
      const noteID = await ctx.db.insert("notes", {
        title: args.title,
        content: args.content,
        isCompleted: false,
      });
      // do something with `taskId`
      console.log(noteID);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },
});

export const updateIsCompletedTask = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    try {
      const { id } = args;
      const existingNote = await ctx.db.get(id);

      if (!existingNote) {
        return { success: false, error: "Note not found" };
      }

      await ctx.db.patch(id, {
        isCompleted: !existingNote.isCompleted,
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to update note:", error);
      return { success: false, error };
    }
  },
});

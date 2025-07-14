import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getSessionActiveOrgId } from "../utils";
import { eq, and } from "drizzle-orm";
import { files } from "~/db/schema";
import { z } from "zod";

export const filesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const orgId = getSessionActiveOrgId(ctx.session);
    return ctx.db.select().from(files).where(eq(files.organizationId, orgId));
  }),

  getById: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const orgId = getSessionActiveOrgId(ctx.session);

    const [result] = await ctx.db
      .select()
      .from(files)
      .where(and(eq(files.id, input.id), eq(files.organizationId, orgId)));

    if (!result) throw new Error("File not found");
    return result;
  }),

  create: protectedProcedure
    .input(
      z.object({ name: z.string(), data: z.record(z.string(), z.any()).optional().default({}) })
    )
    .mutation(async ({ ctx, input }) => {
      const orgId = getSessionActiveOrgId(ctx.session);
      const userId = ctx.session?.userId;
      if (!userId) throw new Error("Missing user context");

      const [file] = await ctx.db
        .insert(files)
        .values({
          id: crypto.randomUUID(),
          organizationId: orgId,
          creatorId: userId,
          name: input.name,
          data: input.data,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      return file;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        data: z.record(z.string(), z.any()).default({})
      })
    )
    .mutation(async ({ ctx, input }) => {
      const orgId = getSessionActiveOrgId(ctx.session);
      const userId = ctx.session?.userId;
      if (!userId) throw new Error("Missing user context");

      const [file] = await ctx.db
        .update(files)
        .set({
          ...(input.name ? { name: input.name } : {}),
          ...(input.data ? { data: input.data } : {}),
          updatedAt: new Date()
        })
        .where(and(eq(files.id, input.id), eq(files.organizationId, orgId)))
        .returning();

      if (!file) throw new Error("File not found or not authorized");
      return file;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const orgId = getSessionActiveOrgId(ctx.session);

      const [file] = await ctx.db
        .delete(files)
        .where(and(eq(files.id, input.id), eq(files.organizationId, orgId)))
        .returning();

      if (!file) throw new Error("File not found or not authorized");
      return file;
    })
});

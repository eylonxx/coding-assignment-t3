import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),
  addCategory: protectedProcedure
    .input(
      z.object({ userId: z.string(), color: z.string(), name: z.string() })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.create({
        data: {
          name: input.name,
          color: input.color,
          userId: input.userId,
        },
      });
    }),
  deleteCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.delete({
        where: { id: input.id },
      });
    }),
});

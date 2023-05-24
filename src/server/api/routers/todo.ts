import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany();
  }),
  addTodo: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        isDone: z.boolean(),
        scheduledDate: z.date(),
        catId: z.string(),
        userId: z.string(),
        rank: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          title: input.title,
          isDone: input.isDone,
          scheduledDate: input.scheduledDate,
          userId: input.userId,
          catId: input.catId,
          rank: input.rank,
        },
      });
    }),
  updateTodo: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        isDone: z.boolean(),
        scheduledDate: z.date(),
        catId: z.string(),
        rank: z.string(),
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: { id: input.id },
        data: {
          title: input.title,
          isDone: input.isDone,
          scheduledDate: input.scheduledDate,
          catId: input.catId,
          rank: input.rank,
        },
      });
    }),
  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: { id: input.id },
      });
    }),
  updateRanks: protectedProcedure
    .input(z.array(z.object({ id: z.string(), rank: z.string() })))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(
        input.map(({ id, rank }) =>
          ctx.prisma.todo.update({
            where: { id },
            data: { rank },
          })
        )
      );
    }),
});

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const skillRouter = router({
  list: publicProcedure
    .input(
      z.object({
        category: z.enum(["technical", "soft", "domain", "tool", "language", "certification"]).optional(),
        search: z.string().optional(),
        parentId: z.string().nullable().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.skill.findMany({
        where: {
          ...(input?.category && { category: input.category }),
          ...(input?.search && {
            name: { contains: input.search, mode: "insensitive" },
          }),
          ...(input?.parentId !== undefined && { parentId: input.parentId }),
        },
        orderBy: { demandScore: "desc" },
        include: { children: true },
      });
    }),

  getUserSkills: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.userSkill.findMany({
      where: { userId: ctx.session.user.id },
      include: { skill: true },
      orderBy: { yearsOfExperience: "desc" },
    });
  }),

  addUserSkill: protectedProcedure
    .input(
      z.object({
        skillId: z.string(),
        level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
        yearsOfExperience: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: ctx.session.user.id,
            skillId: input.skillId,
          },
        },
        update: {
          level: input.level,
          yearsOfExperience: input.yearsOfExperience,
        },
        create: {
          userId: ctx.session.user.id,
          ...input,
        },
      });
    }),
});

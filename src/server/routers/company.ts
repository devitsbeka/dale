import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const companyRouter = router({
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        industry: z.string().optional(),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(50).default(20),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { page = 1, pageSize = 20, search, industry } = input ?? {};
      const skip = (page - 1) * pageSize;

      const where = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { industry: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        ...(industry && { industry }),
      };

      const [items, total] = await Promise.all([
        ctx.db.company.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { healthScore: "desc" },
        }),
        ctx.db.company.count({ where }),
      ]);

      return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const company = await ctx.db.company.findUnique({
        where: { id: input.id },
      });
      if (!company) return null;

      // Get jobs at this company
      const jobs = await ctx.db.job.findMany({
        where: { company: company.name, active: true },
        take: 10,
        orderBy: { postedAt: "desc" },
        include: { skills: { include: { skill: true } } },
      });

      // Get salary data for this company
      const salaryProfiles = await ctx.db.companySalaryProfile.findMany({
        where: { company: company.name },
        orderBy: { baseSalaryP50: "desc" },
      });

      return { ...company, jobs, salaryProfiles };
    }),
});

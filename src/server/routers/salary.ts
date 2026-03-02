import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const salaryRouter = router({
  explore: publicProcedure
    .input(
      z.object({
        title: z.string().optional(),
        country: z.string().optional(),
        level: z.enum(["intern", "junior", "mid", "senior", "lead", "principal", "director", "vp", "c_level"]).optional(),
        company: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.salaryDataPoint.findMany({
        where: {
          ...(input?.title && {
            title: { contains: input.title, mode: "insensitive" },
          }),
          ...(input?.country && { country: input.country }),
          ...(input?.level && { level: input.level }),
          ...(input?.company && {
            company: { contains: input.company, mode: "insensitive" },
          }),
        },
        orderBy: { reportedAt: "desc" },
        take: 200,
      });

      if (data.length === 0) return null;

      const baseSalaries = data.map((d) => d.baseSalary).sort((a, b) => a - b);
      const totalComps = data.map((d) => d.totalCompensation).sort((a, b) => a - b);

      const percentile = (arr: number[], p: number) => {
        const idx = Math.ceil((p / 100) * arr.length) - 1;
        return arr[Math.max(0, idx)];
      };

      return {
        count: data.length,
        base: {
          p25: percentile(baseSalaries, 25),
          p50: percentile(baseSalaries, 50),
          p75: percentile(baseSalaries, 75),
          min: baseSalaries[0],
          max: baseSalaries[baseSalaries.length - 1],
        },
        totalComp: {
          p25: percentile(totalComps, 25),
          p50: percentile(totalComps, 50),
          p75: percentile(totalComps, 75),
          min: totalComps[0],
          max: totalComps[totalComps.length - 1],
        },
        dataPoints: data.slice(0, 50),
      };
    }),
});

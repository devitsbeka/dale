import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const negotiationRouter = router({
  listOffers: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.offer.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  getOffer: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.offer.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),

  createOffer: protectedProcedure
    .input(
      z.object({
        company: z.string().min(1),
        title: z.string().min(1),
        baseSalary: z.number().min(0),
        bonus: z.number().optional(),
        equity: z.number().optional(),
        signingBonus: z.number().optional(),
        currency: z.string().default("USD"),
        location: z.string().optional(),
        remotePolicy: z.string().optional(),
        startDate: z.string().optional(),
        deadline: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.offer.create({
        data: {
          userId: ctx.session.user.id,
          company: input.company,
          title: input.title,
          baseSalary: input.baseSalary,
          bonus: input.bonus,
          equity: input.equity,
          signingBonus: input.signingBonus,
          currency: input.currency,
          location: input.location,
          remotePolicy: input.remotePolicy,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          deadline: input.deadline ? new Date(input.deadline) : undefined,
          notes: input.notes,
        },
      });
    }),

  updateOffer: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        accepted: z.boolean().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.offer.update({
        where: { id: input.id },
        data: {
          ...(input.accepted !== undefined && { accepted: input.accepted }),
          ...(input.notes !== undefined && { notes: input.notes }),
        },
      });
    }),

  deleteOffer: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.offer.delete({
        where: { id: input.id },
      });
    }),

  // Get market comparison for a given offer
  marketComparison: protectedProcedure
    .input(z.object({ title: z.string(), location: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.salaryDataPoint.findMany({
        where: {
          title: { contains: input.title, mode: "insensitive" },
          ...(input.location && { location: { contains: input.location, mode: "insensitive" } }),
        },
      });
      if (data.length === 0) return null;

      const bases = data.map((d) => d.baseSalary).sort((a, b) => a - b);
      const totals = data.map((d) => d.totalCompensation).sort((a, b) => a - b);

      const percentile = (arr: number[], p: number) => {
        const idx = Math.ceil((p / 100) * arr.length) - 1;
        return arr[Math.max(0, idx)];
      };

      return {
        count: data.length,
        base: { p25: percentile(bases, 25), p50: percentile(bases, 50), p75: percentile(bases, 75) },
        total: { p25: percentile(totals, 25), p50: percentile(totals, 50), p75: percentile(totals, 75) },
      };
    }),
});

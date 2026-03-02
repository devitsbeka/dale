import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { computeMatchScore, computeBatchMatchScores } from "@/lib/match-scoring";

export const jobRouter = router({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(20),
        search: z.string().optional(),
        country: z.string().optional(),
        remotePolicy: z.enum(["remote", "hybrid", "onsite"]).optional(),
        type: z.enum(["full_time", "part_time", "contract", "freelance", "internship"]).optional(),
        level: z.enum(["intern", "junior", "mid", "senior", "lead", "principal", "director", "vp", "c_level"]).optional(),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { page = 1, pageSize = 20, search, country, remotePolicy, type, level, salaryMin, salaryMax } = input ?? {};
      const skip = (page - 1) * pageSize;

      const where = {
        active: true,
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { company: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        ...(country && { country }),
        ...(remotePolicy && { remotePolicy }),
        ...(type && { type }),
        ...(level && { level }),
        ...(salaryMin && { salaryMax: { gte: salaryMin } }),
        ...(salaryMax && { salaryMin: { lte: salaryMax } }),
      };

      const [items, total] = await Promise.all([
        ctx.db.job.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: [{ featured: "desc" }, { postedAt: "desc" }],
          include: { skills: { include: { skill: true } } },
        }),
        ctx.db.job.count({ where }),
      ]);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.job.findUnique({
        where: { id: input.id },
        include: {
          skills: { include: { skill: true } },
        },
      });
    }),

  save: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.savedJob.create({
        data: {
          userId: ctx.session.user.id,
          jobId: input.jobId,
        },
      });
    }),

  unsave: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.savedJob.delete({
        where: {
          userId_jobId: {
            userId: ctx.session.user.id,
            jobId: input.jobId,
          },
        },
      });
    }),

  applyToJob: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        coverLetter: z.string().optional(),
        resumeUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.application.create({
        data: {
          userId: ctx.session.user.id,
          jobId: input.jobId,
          coverLetter: input.coverLetter,
          resumeUrl: input.resumeUrl,
        },
      });
    }),

  matchScore: protectedProcedure
    .input(z.object({ jobId: z.string() }))
    .query(async ({ ctx, input }) => {
      const job = await ctx.db.job.findUnique({
        where: { id: input.jobId },
        include: { skills: { include: { skill: true } } },
      });
      if (!job) return null;
      return computeMatchScore(ctx.db, ctx.session.user.id, job);
    }),

  batchMatchScores: protectedProcedure
    .input(z.object({ jobIds: z.array(z.string()).max(50) }))
    .query(async ({ ctx, input }) => {
      const jobs = await ctx.db.job.findMany({
        where: { id: { in: input.jobIds } },
        include: { skills: { include: { skill: true } } },
      });
      const scores = await computeBatchMatchScores(ctx.db, ctx.session.user.id, jobs);
      return Object.fromEntries(scores);
    }),
});

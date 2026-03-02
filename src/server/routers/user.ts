import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.userProfile.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        workExperiences: { orderBy: { startDate: "desc" } },
        educations: { orderBy: { startDate: "desc" } },
      },
    });
    return profile;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        headline: z.string().optional(),
        bio: z.string().optional(),
        location: z.string().optional(),
        country: z.string().optional(),
        avatarUrl: z.string().url().optional(),
        linkedinUrl: z.string().url().optional(),
        githubUrl: z.string().url().optional(),
        websiteUrl: z.string().url().optional(),
        yearsOfExperience: z.number().min(0).optional(),
        currentTitle: z.string().optional(),
        desiredTitle: z.string().optional(),
        desiredSalaryMin: z.number().optional(),
        desiredSalaryMax: z.number().optional(),
        desiredSalaryCurrency: z.string().optional(),
        openToRemote: z.boolean().optional(),
        openToRelocation: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userProfile.upsert({
        where: { userId: ctx.session.user.id },
        update: input,
        create: { userId: ctx.session.user.id, ...input },
      });
    }),

  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.db.userProfile.update({
      where: { userId: ctx.session.user.id },
      data: { onboardingCompleted: true },
    });
  }),
});

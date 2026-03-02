import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import {
  awardXP, updateStreak, getLevelForXP, getXPForNextLevel,
  getLevelProgress, LEVEL_TITLES,
  type XPAction,
} from "@/lib/game-engine";

export const gameRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.gameProfile.upsert({
      where: { userId: ctx.session.user.id },
      create: { userId: ctx.session.user.id },
      update: {},
    });

    const level = getLevelForXP(profile.xp);
    const nextLevelXP = getXPForNextLevel(level);
    const progress = getLevelProgress(profile.xp, level);
    const title = LEVEL_TITLES[level - 1] ?? "Legend";

    return {
      ...profile,
      level,
      title,
      nextLevelXP,
      progress: Math.round(progress * 100),
    };
  }),

  awardXP: protectedProcedure
    .input(z.object({ action: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return awardXP(ctx.db, ctx.session.user.id, input.action as XPAction);
    }),

  updateStreak: protectedProcedure.mutation(async ({ ctx }) => {
    return updateStreak(ctx.db, ctx.session.user.id);
  }),

  getBadges: protectedProcedure.query(async ({ ctx }) => {
    const [allBadges, userBadges] = await Promise.all([
      ctx.db.badge.findMany({ orderBy: { category: "asc" } }),
      ctx.db.userBadge.findMany({
        where: { userId: ctx.session.user.id },
        select: { badgeId: true, earnedAt: true },
      }),
    ]);

    const earnedSet = new Map(userBadges.map((ub) => [ub.badgeId, ub.earnedAt]));

    return allBadges.map((b) => ({
      ...b,
      earned: earnedSet.has(b.id),
      earnedAt: earnedSet.get(b.id) ?? null,
    }));
  }),

  getQuests: protectedProcedure.query(async ({ ctx }) => {
    const quests = await ctx.db.quest.findMany({
      where: { active: true },
      include: {
        users: {
          where: { userId: ctx.session.user.id },
          take: 1,
        },
      },
    });

    return quests.map((q) => ({
      id: q.id,
      name: q.name,
      description: q.description,
      type: q.type,
      xpReward: q.xpReward,
      requirement: q.requirement as { target: number },
      progress: q.users[0]?.progress ?? 0,
      completed: q.users[0]?.completed ?? false,
      completedAt: q.users[0]?.completedAt ?? null,
    }));
  }),

  getLeaderboard: protectedProcedure.query(async ({ ctx }) => {
    const profiles = await ctx.db.gameProfile.findMany({
      take: 20,
      orderBy: { xp: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return profiles.map((p, i) => ({
      rank: i + 1,
      userId: p.userId,
      name: p.user.name ?? p.user.email?.split("@")[0] ?? "Anonymous",
      xp: p.xp,
      level: getLevelForXP(p.xp),
      title: LEVEL_TITLES[getLevelForXP(p.xp) - 1] ?? "Legend",
      streak: p.streak,
      isCurrentUser: p.userId === ctx.session.user.id,
    }));
  }),
});

import type { PrismaClient } from "@/generated/prisma/client";

// XP thresholds for each level
const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500,
  10000, 13000, 16500, 20500, 25000, 30000, 36000, 43000, 51000, 60000,
];

export function getLevelForXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) return Infinity;
  return LEVEL_THRESHOLDS[currentLevel];
}

export function getLevelProgress(xp: number, level: number): number {
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? currentThreshold + 1000;
  const progress = (xp - currentThreshold) / (nextThreshold - currentThreshold);
  return Math.min(1, Math.max(0, progress));
}

export const LEVEL_TITLES = [
  "Newcomer", "Explorer", "Seeker", "Learner", "Contributor",
  "Builder", "Achiever", "Specialist", "Expert", "Master",
  "Virtuoso", "Champion", "Titan", "Legend", "Transcendent",
  "Mythic", "Cosmic", "Ethereal", "Infinite", "Omniscient",
];

export type XPAction =
  | "complete_profile"
  | "add_skill"
  | "apply_job"
  | "save_job"
  | "add_experience"
  | "complete_onboarding"
  | "daily_login"
  | "ai_chat"
  | "add_offer"
  | "explore_salary";

const XP_REWARDS: Record<XPAction, number> = {
  complete_profile: 100,
  add_skill: 25,
  apply_job: 50,
  save_job: 10,
  add_experience: 75,
  complete_onboarding: 200,
  daily_login: 15,
  ai_chat: 20,
  add_offer: 40,
  explore_salary: 10,
};

export async function awardXP(
  db: PrismaClient,
  userId: string,
  action: XPAction
): Promise<{ xpGained: number; newTotal: number; newLevel: number; leveledUp: boolean }> {
  const xpGained = XP_REWARDS[action];

  const profile = await db.gameProfile.upsert({
    where: { userId },
    create: { userId, xp: xpGained, level: 1 },
    update: { xp: { increment: xpGained } },
  });

  const newLevel = getLevelForXP(profile.xp);
  const leveledUp = newLevel > profile.level;

  if (leveledUp) {
    await db.gameProfile.update({
      where: { userId },
      data: { level: newLevel },
    });
  }

  return { xpGained, newTotal: profile.xp, newLevel, leveledUp };
}

export async function updateStreak(
  db: PrismaClient,
  userId: string
): Promise<{ streak: number; isNew: boolean }> {
  const profile = await db.gameProfile.findUnique({ where: { userId } });
  if (!profile) {
    const created = await db.gameProfile.create({
      data: { userId, streak: 1, lastActiveAt: new Date() },
    });
    return { streak: created.streak, isNew: true };
  }

  const now = new Date();
  const lastActive = new Date(profile.lastActiveAt);
  const dayDiff = Math.floor((now.getTime() - lastActive.getTime()) / 86400000);

  if (dayDiff === 0) return { streak: profile.streak, isNew: false };

  const newStreak = dayDiff === 1 ? profile.streak + 1 : 1;
  const longestStreak = Math.max(profile.longestStreak, newStreak);

  await db.gameProfile.update({
    where: { userId },
    data: { streak: newStreak, longestStreak, lastActiveAt: now },
  });

  return { streak: newStreak, isNew: true };
}

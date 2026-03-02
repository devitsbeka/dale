import type { PrismaClient } from "@/generated/prisma/client";

interface MatchResult {
  overall: number; // 0-100
  skills: { score: number; matched: string[]; missing: string[]; total: number };
  salary: { score: number; inRange: boolean; jobMin: number | null; jobMax: number | null };
  location: { score: number; match: "exact" | "country" | "remote" | "mismatch" };
  level: { score: number; match: "exact" | "close" | "stretch" | "mismatch" };
}

const WEIGHTS = {
  skills: 0.45,
  salary: 0.2,
  location: 0.2,
  level: 0.15,
};

const LEVEL_ORDER = [
  "intern", "junior", "mid", "senior", "lead", "principal", "director", "vp", "c_level",
];

export async function computeMatchScore(
  db: PrismaClient,
  userId: string,
  job: {
    id: string;
    level: string;
    remotePolicy: string;
    location: string;
    country: string;
    salaryMin: number | null;
    salaryMax: number | null;
    skills: Array<{ skill: { id: string; name: string; slug: string } }>;
  }
): Promise<MatchResult> {
  const [profile, userSkills] = await Promise.all([
    db.userProfile.findUnique({ where: { userId } }),
    db.userSkill.findMany({ where: { userId }, include: { skill: true } }),
  ]);

  // Skills matching
  const userSkillIds = new Set(userSkills.map((us) => us.skillId));
  const jobSkillNames = job.skills.map((js) => js.skill.name);
  const matched = job.skills.filter((js) => userSkillIds.has(js.skill.id)).map((js) => js.skill.name);
  const missing = job.skills.filter((js) => !userSkillIds.has(js.skill.id)).map((js) => js.skill.name);
  const skillScore = job.skills.length > 0
    ? Math.round((matched.length / job.skills.length) * 100)
    : 50; // No skills listed = neutral

  // Salary matching
  let salaryScore = 50; // Default: no data
  let inRange = false;
  if (profile?.desiredSalaryMin && job.salaryMax) {
    if (profile.desiredSalaryMin <= job.salaryMax && (!profile.desiredSalaryMax || profile.desiredSalaryMax >= (job.salaryMin ?? 0))) {
      salaryScore = 100;
      inRange = true;
    } else if (profile.desiredSalaryMin > job.salaryMax) {
      const gap = (profile.desiredSalaryMin - job.salaryMax) / profile.desiredSalaryMin;
      salaryScore = Math.max(0, Math.round(100 - gap * 200));
    } else {
      salaryScore = 70; // Overqualified salary-wise
    }
  }

  // Location matching
  let locationScore = 50;
  let locationMatch: "exact" | "country" | "remote" | "mismatch" = "mismatch";
  if (job.remotePolicy === "remote") {
    locationScore = profile?.openToRemote !== false ? 100 : 80;
    locationMatch = "remote";
  } else if (profile?.country && job.country === profile.country) {
    if (profile.location && job.location.toLowerCase().includes(profile.location.toLowerCase())) {
      locationScore = 100;
      locationMatch = "exact";
    } else {
      locationScore = 75;
      locationMatch = "country";
    }
  } else if (profile?.openToRelocation) {
    locationScore = 60;
    locationMatch = "country";
  }

  // Level matching
  let levelScore = 50;
  let levelMatch: "exact" | "close" | "stretch" | "mismatch" = "mismatch";
  if (profile?.currentTitle) {
    const userLevel = inferLevel(profile.currentTitle, profile.yearsOfExperience ?? 0);
    const jobLevelIdx = LEVEL_ORDER.indexOf(job.level);
    const userLevelIdx = LEVEL_ORDER.indexOf(userLevel);
    const diff = Math.abs(jobLevelIdx - userLevelIdx);
    if (diff === 0) {
      levelScore = 100;
      levelMatch = "exact";
    } else if (diff === 1) {
      levelScore = 80;
      levelMatch = "close";
    } else if (diff === 2) {
      levelScore = 50;
      levelMatch = "stretch";
    } else {
      levelScore = 20;
      levelMatch = "mismatch";
    }
  }

  const overall = Math.round(
    skillScore * WEIGHTS.skills +
    salaryScore * WEIGHTS.salary +
    locationScore * WEIGHTS.location +
    levelScore * WEIGHTS.level
  );

  return {
    overall,
    skills: { score: skillScore, matched, missing, total: jobSkillNames.length },
    salary: { score: salaryScore, inRange, jobMin: job.salaryMin, jobMax: job.salaryMax },
    location: { score: locationScore, match: locationMatch },
    level: { score: levelScore, match: levelMatch },
  };
}

function inferLevel(title: string, yearsOfExperience: number): string {
  const t = title.toLowerCase();
  if (t.includes("intern")) return "intern";
  if (t.includes("junior") || t.includes("jr")) return "junior";
  if (t.includes("senior") || t.includes("sr")) return "senior";
  if (t.includes("lead") || t.includes("team lead")) return "lead";
  if (t.includes("principal") || t.includes("staff")) return "principal";
  if (t.includes("director")) return "director";
  if (t.includes("vp") || t.includes("vice president")) return "vp";
  if (t.includes("cto") || t.includes("ceo") || t.includes("coo") || t.includes("chief")) return "c_level";
  // Infer from years
  if (yearsOfExperience <= 1) return "junior";
  if (yearsOfExperience <= 4) return "mid";
  if (yearsOfExperience <= 8) return "senior";
  if (yearsOfExperience <= 12) return "lead";
  return "principal";
}

export async function computeBatchMatchScores(
  db: PrismaClient,
  userId: string,
  jobs: Array<{
    id: string;
    level: string;
    remotePolicy: string;
    location: string;
    country: string;
    salaryMin: number | null;
    salaryMax: number | null;
    skills: Array<{ skill: { id: string; name: string; slug: string } }>;
  }>
): Promise<Map<string, number>> {
  // Fetch user data once
  const [profile, userSkills] = await Promise.all([
    db.userProfile.findUnique({ where: { userId } }),
    db.userSkill.findMany({ where: { userId }, include: { skill: true } }),
  ]);

  const userSkillIds = new Set(userSkills.map((us) => us.skillId));
  const userLevel = profile?.currentTitle
    ? inferLevel(profile.currentTitle, profile.yearsOfExperience ?? 0)
    : "mid";

  const results = new Map<string, number>();

  for (const job of jobs) {
    const skillScore = job.skills.length > 0
      ? Math.round((job.skills.filter((js) => userSkillIds.has(js.skill.id)).length / job.skills.length) * 100)
      : 50;

    let salaryScore = 50;
    if (profile?.desiredSalaryMin && job.salaryMax) {
      if (profile.desiredSalaryMin <= job.salaryMax && (!profile.desiredSalaryMax || profile.desiredSalaryMax >= (job.salaryMin ?? 0))) {
        salaryScore = 100;
      } else if (profile.desiredSalaryMin > job.salaryMax) {
        const gap = (profile.desiredSalaryMin - job.salaryMax) / profile.desiredSalaryMin;
        salaryScore = Math.max(0, Math.round(100 - gap * 200));
      } else {
        salaryScore = 70;
      }
    }

    let locationScore = 50;
    if (job.remotePolicy === "remote") {
      locationScore = profile?.openToRemote !== false ? 100 : 80;
    } else if (profile?.country && job.country === profile.country) {
      locationScore = profile.location && job.location.toLowerCase().includes(profile.location.toLowerCase()) ? 100 : 75;
    } else if (profile?.openToRelocation) {
      locationScore = 60;
    }

    let levelScore = 50;
    const jobLevelIdx = LEVEL_ORDER.indexOf(job.level);
    const userLevelIdx = LEVEL_ORDER.indexOf(userLevel);
    const diff = Math.abs(jobLevelIdx - userLevelIdx);
    if (diff === 0) levelScore = 100;
    else if (diff === 1) levelScore = 80;
    else if (diff === 2) levelScore = 50;
    else levelScore = 20;

    const overall = Math.round(
      skillScore * WEIGHTS.skills +
      salaryScore * WEIGHTS.salary +
      locationScore * WEIGHTS.location +
      levelScore * WEIGHTS.level
    );

    results.set(job.id, overall);
  }

  return results;
}

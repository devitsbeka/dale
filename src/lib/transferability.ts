import type { PrismaClient } from "@/generated/prisma/client";

interface TransferableRole {
  title: string;
  transferScore: number; // 0-100
  matchedSkills: string[];
  gapSkills: string[];
  salaryRange: { min: number; max: number } | null;
  jobCount: number;
}

interface AdjacentSkill {
  id: string;
  name: string;
  category: string;
  demandScore: number;
  growthRate: number;
  coOccurrence: number; // How often this skill appears alongside user's skills
}

export async function getTransferableRoles(
  db: PrismaClient,
  userId: string,
  limit = 10
): Promise<TransferableRole[]> {
  const userSkills = await db.userSkill.findMany({
    where: { userId },
    include: { skill: true },
  });

  if (userSkills.length === 0) return [];

  const userSkillIds = new Set(userSkills.map((us) => us.skillId));

  // Find all distinct job titles and their required skills
  const jobs = await db.job.findMany({
    where: { active: true },
    select: {
      title: true,
      salaryMin: true,
      salaryMax: true,
      skills: { include: { skill: true } },
    },
  });

  // Group jobs by normalized title
  const titleMap = new Map<string, {
    titles: string[];
    skillSets: Set<string>[];
    skillNames: Map<string, string>;
    salaryMins: number[];
    salaryMaxs: number[];
    count: number;
  }>();

  for (const job of jobs) {
    const normalizedTitle = normalizeTitle(job.title);
    const existing = titleMap.get(normalizedTitle);

    if (existing) {
      existing.count++;
      const skillSet = new Set(job.skills.map((js) => js.skill.id));
      existing.skillSets.push(skillSet);
      for (const js of job.skills) {
        existing.skillNames.set(js.skill.id, js.skill.name);
      }
      if (job.salaryMin) existing.salaryMins.push(job.salaryMin);
      if (job.salaryMax) existing.salaryMaxs.push(job.salaryMax);
    } else {
      const skillNames = new Map<string, string>();
      for (const js of job.skills) {
        skillNames.set(js.skill.id, js.skill.name);
      }
      titleMap.set(normalizedTitle, {
        titles: [job.title],
        skillSets: [new Set(job.skills.map((js) => js.skill.id))],
        skillNames,
        salaryMins: job.salaryMin ? [job.salaryMin] : [],
        salaryMaxs: job.salaryMax ? [job.salaryMax] : [],
        count: 1,
      });
    }
  }

  // Score each role
  const results: TransferableRole[] = [];

  for (const [, data] of titleMap) {
    // Merge all skill IDs across job postings for this title
    const allSkillIds = new Set<string>();
    for (const ss of data.skillSets) {
      for (const id of ss) allSkillIds.add(id);
    }

    if (allSkillIds.size === 0) continue;

    const matched: string[] = [];
    const gap: string[] = [];

    for (const skillId of allSkillIds) {
      if (userSkillIds.has(skillId)) {
        matched.push(data.skillNames.get(skillId) ?? skillId);
      } else {
        gap.push(data.skillNames.get(skillId) ?? skillId);
      }
    }

    const transferScore = Math.round((matched.length / allSkillIds.size) * 100);

    // Need at least some overlap
    if (transferScore < 20 || matched.length === 0) continue;

    const salaryRange = data.salaryMins.length > 0 && data.salaryMaxs.length > 0
      ? {
          min: Math.round(median(data.salaryMins)),
          max: Math.round(median(data.salaryMaxs)),
        }
      : null;

    results.push({
      title: data.titles[0],
      transferScore,
      matchedSkills: matched,
      gapSkills: gap,
      salaryRange,
      jobCount: data.count,
    });
  }

  // Sort by transfer score descending, then by job count
  results.sort((a, b) => b.transferScore - a.transferScore || b.jobCount - a.jobCount);

  return results.slice(0, limit);
}

export async function getAdjacentSkills(
  db: PrismaClient,
  userId: string,
  limit = 15
): Promise<AdjacentSkill[]> {
  const userSkills = await db.userSkill.findMany({
    where: { userId },
    select: { skillId: true },
  });

  if (userSkills.length === 0) return [];

  const userSkillIds = new Set(userSkills.map((us) => us.skillId));

  // Find jobs that require any of the user's skills
  const relatedJobs = await db.jobSkill.findMany({
    where: { skillId: { in: [...userSkillIds] } },
    select: { jobId: true },
    distinct: ["jobId"],
  });

  const jobIds = relatedJobs.map((j) => j.jobId);

  // Find all skills in those jobs (co-occurring skills)
  const coSkills = await db.jobSkill.findMany({
    where: { jobId: { in: jobIds } },
    include: { skill: true },
  });

  // Count co-occurrence per skill
  const coMap = new Map<string, { skill: typeof coSkills[0]["skill"]; count: number }>();
  for (const cs of coSkills) {
    if (userSkillIds.has(cs.skillId)) continue; // Skip skills user already has
    const existing = coMap.get(cs.skillId);
    if (existing) {
      existing.count++;
    } else {
      coMap.set(cs.skillId, { skill: cs.skill, count: 1 });
    }
  }

  const results: AdjacentSkill[] = [];
  for (const [, { skill, count }] of coMap) {
    results.push({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      demandScore: skill.demandScore,
      growthRate: skill.growthRate,
      coOccurrence: count,
    });
  }

  // Sort by co-occurrence * demand score
  results.sort((a, b) => (b.coOccurrence * b.demandScore) - (a.coOccurrence * a.demandScore));

  return results.slice(0, limit);
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\b(sr|senior|jr|junior|lead|staff|principal|i{1,3}|[123])\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

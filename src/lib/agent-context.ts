import { db } from "./db";
import type { AgentDef } from "./agents";

/**
 * Fetches the user's full context from the database and builds
 * an enriched system prompt for the given agent.
 */
export async function buildAgentContext(userId: string, agent: AgentDef): Promise<string> {
  // Fetch user data in parallel
  const [user, skills, applications, savedJobs, offers, gameProfile] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            workExperiences: { orderBy: { startDate: "desc" }, take: 5 },
            educations: { orderBy: { startDate: "desc" }, take: 3 },
          },
        },
      },
    }),
    db.userSkill.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { level: "desc" },
    }),
    db.application.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { appliedAt: "desc" },
      take: 10,
    }),
    db.savedJob.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.offer.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.gameProfile.findUnique({ where: { userId } }),
  ]);

  if (!user) return agent.systemPrompt;

  const profile = user.profile;
  const lines: string[] = [agent.systemPrompt, "", "---", "## USER CONTEXT (from database — use this to personalize all responses)", ""];

  // Profile
  if (profile) {
    lines.push("### Profile");
    lines.push(`- Name: ${user.name ?? "Unknown"}`);
    if (profile.currentTitle) lines.push(`- Current Title: ${profile.currentTitle}`);
    if (profile.headline) lines.push(`- Headline: ${profile.headline}`);
    if (profile.location) lines.push(`- Location: ${profile.location}${profile.country ? `, ${profile.country}` : ""}`);
    if (profile.yearsOfExperience) lines.push(`- Years of Experience: ${profile.yearsOfExperience}`);
    if (profile.desiredTitle) lines.push(`- Desired Title: ${profile.desiredTitle}`);
    if (profile.desiredSalaryMin || profile.desiredSalaryMax) {
      const min = profile.desiredSalaryMin ? `$${(profile.desiredSalaryMin / 1000).toFixed(0)}k` : "?";
      const max = profile.desiredSalaryMax ? `$${(profile.desiredSalaryMax / 1000).toFixed(0)}k` : "?";
      lines.push(`- Desired Salary: ${min} – ${max} ${profile.desiredSalaryCurrency}`);
    }
    lines.push(`- Open to Remote: ${profile.openToRemote ? "Yes" : "No"}`);
    lines.push(`- Open to Relocation: ${profile.openToRelocation ? "Yes" : "No"}`);
    if (profile.bio) lines.push(`- Bio: ${profile.bio.slice(0, 300)}`);
    lines.push("");
  }

  // Work Experience
  if (profile?.workExperiences && profile.workExperiences.length > 0) {
    lines.push("### Work Experience");
    for (const w of profile.workExperiences) {
      const end = w.current ? "Present" : w.endDate?.toISOString().slice(0, 7) ?? "?";
      lines.push(`- ${w.title} at ${w.company} (${w.startDate.toISOString().slice(0, 7)} – ${end})`);
      if (w.description) lines.push(`  ${w.description.slice(0, 200)}`);
    }
    lines.push("");
  }

  // Education
  if (profile?.educations && profile.educations.length > 0) {
    lines.push("### Education");
    for (const e of profile.educations) {
      lines.push(`- ${e.degree}${e.field ? ` in ${e.field}` : ""} — ${e.institution}`);
    }
    lines.push("");
  }

  // Skills
  if (skills.length > 0) {
    lines.push("### Skills");
    const grouped: Record<string, string[]> = {};
    for (const us of skills) {
      const cat = us.skill.category ?? "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(`${us.skill.name} (${us.level}, ${us.yearsOfExperience}yr)`);
    }
    for (const [cat, items] of Object.entries(grouped)) {
      lines.push(`- ${cat}: ${items.join(", ")}`);
    }
    lines.push("");
  }

  // Recent Applications
  if (applications.length > 0) {
    lines.push("### Recent Applications");
    for (const app of applications.slice(0, 5)) {
      const job = app.job;
      lines.push(`- ${job.title} at ${job.company} — Status: ${app.status}`);
    }
    lines.push("");
  }

  // Saved Jobs
  if (savedJobs.length > 0) {
    lines.push("### Saved Jobs (interested in)");
    for (const sj of savedJobs.slice(0, 5)) {
      const job = sj.job;
      lines.push(`- ${job.title} at ${job.company} (${job.location})`);
    }
    lines.push("");
  }

  // Active Offers
  if (offers.length > 0) {
    lines.push("### Active Offers");
    for (const o of offers) {
      const status = o.accepted === true ? "Accepted" : o.accepted === false ? "Declined" : "Pending";
      lines.push(`- ${o.title} at ${o.company}: $${o.baseSalary.toLocaleString()} base + $${o.equity?.toLocaleString() ?? "0"} equity — ${status}`);
    }
    lines.push("");
  }

  // Game Profile
  if (gameProfile) {
    lines.push(`### Career Game: Level ${gameProfile.level}, ${gameProfile.xp} XP, ${gameProfile.streak}-day streak`);
    lines.push("");
  }

  lines.push("---");
  lines.push("Use the above context to give personalized, specific advice. Reference the user's actual skills, experience, and goals. Never ask for information you already have.");

  return lines.join("\n");
}

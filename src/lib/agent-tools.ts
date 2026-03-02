import { db } from "./db";
import type Anthropic from "@anthropic-ai/sdk";

/**
 * Tool definitions that Claude can call during agent conversations.
 * Each agent gets a relevant subset of tools.
 */

export const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: "search_jobs",
    description: "Search the job database by title, skills, location, level, or remote policy. Returns matching jobs with salary info.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Search query (job title, keyword, or skill)" },
        location: { type: "string", description: "Country or city to filter by" },
        remote: { type: "string", enum: ["remote", "hybrid", "onsite"], description: "Remote work policy" },
        level: { type: "string", enum: ["intern", "junior", "mid", "senior", "lead", "principal", "director", "vp", "c_level"], description: "Job level" },
        limit: { type: "number", description: "Max results (default 10)" },
      },
      required: [],
    },
  },
  {
    name: "get_salary_data",
    description: "Query salary data for a specific job title, level, and location. Returns percentile ranges (p25, p50, p75).",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Job title to look up" },
        country: { type: "string", description: "Country code or name" },
        level: { type: "string", description: "Job level (junior, mid, senior, etc.)" },
        company: { type: "string", description: "Specific company name (optional)" },
      },
      required: ["title"],
    },
  },
  {
    name: "lookup_company",
    description: "Look up a company by name. Returns industry, size, health score, culture score, and open jobs.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Company name to search for" },
      },
      required: ["name"],
    },
  },
  {
    name: "find_skills_in_demand",
    description: "Find skills with highest demand score and growth rate, optionally filtered by category.",
    input_schema: {
      type: "object" as const,
      properties: {
        category: { type: "string", enum: ["technical", "soft", "domain", "tool", "language", "certification"], description: "Skill category" },
        limit: { type: "number", description: "Max results (default 15)" },
      },
      required: [],
    },
  },
  {
    name: "get_user_applications",
    description: "Get the user's job application history with status and timeline.",
    input_schema: {
      type: "object" as const,
      properties: {
        status: { type: "string", enum: ["applied", "screening", "interviewing", "offered", "accepted", "rejected", "withdrawn"], description: "Filter by status" },
      },
      required: [],
    },
  },
];

// Map agent IDs to relevant tools
const AGENT_TOOLS: Record<string, string[]> = {
  scout: ["search_jobs", "get_salary_data", "find_skills_in_demand", "get_user_applications"],
  researcher: ["lookup_company", "search_jobs", "get_salary_data"],
  builder: ["search_jobs", "find_skills_in_demand", "get_user_applications"],
  negotiator: ["get_salary_data", "lookup_company", "get_user_applications"],
  trainer: ["find_skills_in_demand", "search_jobs"],
  networker: ["lookup_company", "search_jobs"],
  guardian: ["find_skills_in_demand", "search_jobs", "lookup_company"],
  strategist: ["search_jobs", "get_salary_data", "find_skills_in_demand", "lookup_company", "get_user_applications"],
};

export function getToolsForAgent(agentId: string): Anthropic.Tool[] {
  const toolNames = AGENT_TOOLS[agentId] ?? [];
  return TOOL_DEFINITIONS.filter((t) => toolNames.includes(t.name));
}

/**
 * Execute a tool call and return the result as a string.
 */
export async function executeTool(name: string, input: Record<string, unknown>, userId: string): Promise<string> {
  switch (name) {
    case "search_jobs": {
      const { query, location, remote, level, limit = 10 } = input as {
        query?: string; location?: string; remote?: string; level?: string; limit?: number;
      };
      const where: Record<string, unknown> = {};
      if (query) where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
      if (location) where.country = { contains: location, mode: "insensitive" };
      if (remote) where.remotePolicy = remote;
      if (level) where.level = level;

      const jobs = await db.job.findMany({
        where,
        include: { skills: { include: { skill: true } } },
        take: Math.min(limit, 15),
        orderBy: { postedAt: "desc" },
      });

      if (jobs.length === 0) return "No jobs found matching those criteria.";

      return jobs.map((j) => {
        const skills = j.skills.map((s) => s.skill.name).join(", ");
        const salary = j.salaryMin && j.salaryMax
          ? `$${(j.salaryMin / 1000).toFixed(0)}k–$${(j.salaryMax / 1000).toFixed(0)}k`
          : "Not listed";
        return `• ${j.title} at ${j.company} (${j.location}) — ${salary} — Level: ${j.level} — Skills: ${skills || "Not specified"}`;
      }).join("\n");
    }

    case "get_salary_data": {
      const { title, country, level, company } = input as {
        title: string; country?: string; level?: string; company?: string;
      };
      const where: Record<string, unknown> = {
        title: { contains: title, mode: "insensitive" },
      };
      if (country) where.country = { contains: country, mode: "insensitive" };
      if (level) where.level = level;
      if (company) where.company = { contains: company, mode: "insensitive" };

      const dataPoints = await db.salaryDataPoint.findMany({ where, take: 100 });

      if (dataPoints.length === 0) return `No salary data found for "${title}"${country ? ` in ${country}` : ""}.`;

      const bases = dataPoints.map((d) => d.baseSalary).sort((a, b) => a - b);
      const totals = dataPoints.map((d) => d.totalCompensation).sort((a, b) => a - b);
      const p = (arr: number[], pct: number) => arr[Math.floor(arr.length * pct)] ?? 0;

      return [
        `Salary data for "${title}" (${dataPoints.length} data points):`,
        `Base Salary — P25: $${p(bases, 0.25).toLocaleString()} | P50: $${p(bases, 0.5).toLocaleString()} | P75: $${p(bases, 0.75).toLocaleString()}`,
        `Total Comp  — P25: $${p(totals, 0.25).toLocaleString()} | P50: $${p(totals, 0.5).toLocaleString()} | P75: $${p(totals, 0.75).toLocaleString()}`,
        `Avg Years of Experience: ${(dataPoints.reduce((s, d) => s + d.yearsOfExperience, 0) / dataPoints.length).toFixed(1)}`,
      ].join("\n");
    }

    case "lookup_company": {
      const { name: companyName } = input as { name: string };
      const company = await db.company.findFirst({
        where: { name: { contains: companyName, mode: "insensitive" } },
      });

      if (!company) return `Company "${companyName}" not found in database.`;

      // Find jobs and salary profiles by company name (string match, not relation)
      const [jobs, salaryProfiles] = await Promise.all([
        db.job.findMany({
          where: { company: { contains: companyName, mode: "insensitive" } },
          take: 5,
          orderBy: { postedAt: "desc" },
        }),
        db.companySalaryProfile.findMany({
          where: { company: { contains: companyName, mode: "insensitive" } },
          take: 5,
        }),
      ]);

      const lines = [
        `${company.name} — ${company.industry ?? "Unknown industry"}`,
        `Size: ${company.size ?? "?"} | Health Score: ${company.healthScore ?? "?"}/100 | Culture Score: ${company.cultureScore ?? "?"}/100`,
        company.description ? `Description: ${company.description.slice(0, 300)}` : "",
        jobs.length > 0 ? `Open Positions: ${jobs.map((j) => j.title).join(", ")}` : "No open positions listed.",
        salaryProfiles.length > 0
          ? `Salary Profiles: ${salaryProfiles.map((s) => `${s.title}: $${s.baseSalaryP50.toLocaleString()} median`).join(", ")}`
          : "",
      ];
      return lines.filter(Boolean).join("\n");
    }

    case "find_skills_in_demand": {
      const { category, limit = 15 } = input as { category?: string; limit?: number };
      const where: Record<string, unknown> = {};
      if (category) where.category = category;

      const skills = await db.skill.findMany({
        where,
        orderBy: { demandScore: "desc" },
        take: Math.min(limit, 20),
      });

      if (skills.length === 0) return "No skills found.";

      return skills.map((s) =>
        `• ${s.name} (${s.category}) — Demand: ${s.demandScore}/100, Growth: ${(s.growthRate * 100).toFixed(0)}%`
      ).join("\n");
    }

    case "get_user_applications": {
      const { status } = input as { status?: string };
      const where: Record<string, unknown> = { userId };
      if (status) where.status = status;

      const apps = await db.application.findMany({
        where,
        include: { job: true },
        orderBy: { appliedAt: "desc" },
        take: 20,
      });

      if (apps.length === 0) return "No applications found.";

      return apps.map((a) => {
        const j = a.job;
        return `• ${j.title} at ${j.company} — Status: ${a.status} — Applied: ${a.appliedAt.toISOString().slice(0, 10)}`;
      }).join("\n");
    }

    default:
      return `Unknown tool: ${name}`;
  }
}

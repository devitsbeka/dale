/**
 * Client-safe tool metadata for displaying in the UI.
 * No server-side imports (no db, no Anthropic SDK).
 */

export const TOOL_LABELS: Record<string, { label: string; icon: string }> = {
  search_jobs: { label: "Job Search", icon: "🔍" },
  get_salary_data: { label: "Salary Data", icon: "💰" },
  lookup_company: { label: "Company Intel", icon: "🏢" },
  find_skills_in_demand: { label: "Skill Demand", icon: "📊" },
  get_user_applications: { label: "My Applications", icon: "📋" },
};

export const AGENT_TOOL_MAP: Record<string, string[]> = {
  scout: ["search_jobs", "get_salary_data", "find_skills_in_demand", "get_user_applications"],
  researcher: ["lookup_company", "search_jobs", "get_salary_data"],
  builder: ["search_jobs", "find_skills_in_demand", "get_user_applications"],
  negotiator: ["get_salary_data", "lookup_company", "get_user_applications"],
  trainer: ["find_skills_in_demand", "search_jobs"],
  networker: ["lookup_company", "search_jobs"],
  guardian: ["find_skills_in_demand", "search_jobs", "lookup_company"],
  strategist: ["search_jobs", "get_salary_data", "find_skills_in_demand", "lookup_company", "get_user_applications"],
};

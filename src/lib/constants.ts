// ============================================================================
// Planeta.id — Application Constants
// ============================================================================

export const APP_NAME = "Planeta.id";
export const APP_DESCRIPTION = "Career Operating System for Earth";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3456";

// Logo.dev for company logos
export const LOGO_DEV_TOKEN = "pk_JsCdE0PFQ2mPn6GETPLiIw";
export const getLogoUrl = (domain: string) =>
  `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Onboarding steps
export const ONBOARDING_STEPS = [
  { id: "basics", label: "Basic Info", description: "Tell us about yourself" },
  { id: "experience", label: "Experience", description: "Your work history" },
  { id: "skills", label: "Skills", description: "What you know" },
  { id: "salary", label: "Salary", description: "Compensation expectations" },
  { id: "preferences", label: "Preferences", description: "Job preferences" },
] as const;

// Job levels with display labels
export const JOB_LEVELS = {
  intern: "Intern",
  junior: "Junior",
  mid: "Mid-Level",
  senior: "Senior",
  lead: "Lead",
  principal: "Principal",
  director: "Director",
  vp: "VP",
  c_level: "C-Level",
} as const;

// Job types with display labels
export const JOB_TYPES = {
  full_time: "Full-Time",
  part_time: "Part-Time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
} as const;

// Remote policies with display labels
export const REMOTE_POLICIES = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-Site",
} as const;

// Skill categories
export const SKILL_CATEGORIES = {
  technical: "Technical",
  soft: "Soft Skills",
  domain: "Domain",
  tool: "Tools",
  language: "Language",
  certification: "Certification",
} as const;

// Currencies
export const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar" },
  EUR: { symbol: "\u20AC", name: "Euro" },
  GBP: { symbol: "\u00A3", name: "British Pound" },
  GEL: { symbol: "\u20BE", name: "Georgian Lari" },
  CAD: { symbol: "CA$", name: "Canadian Dollar" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
} as const;

// Sidebar navigation config
export const DASHBOARD_NAV = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: "BarChartSquare02" },
      { label: "Jobs", href: "/jobs", icon: "Briefcase01" },
      { label: "Skills", href: "/skills", icon: "Target04" },
      { label: "Salary", href: "/salary", icon: "CurrencyDollar" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Career Paths", href: "/paths", icon: "Route" },
      { label: "Opportunity Radar", href: "/radar", icon: "Radar" },
      { label: "Companies", href: "/companies", icon: "Building07" },
      { label: "Relocation", href: "/relocation", icon: "Globe01" },
      { label: "Immigration", href: "/immigration", icon: "Passport" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "AI Agents", href: "/agents", icon: "Stars02" },
      { label: "Negotiation", href: "/negotiation", icon: "MessageSmileSquare" },
      { label: "Career Map", href: "/career-map", icon: "Map01" },
      { label: "Indices", href: "/indices", icon: "TrendUp01" },
    ],
  },
] as const;

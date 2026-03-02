// ============================================================================
// Planeta.id — Core Type Definitions
// ============================================================================

// --- Enums ---

export type JobType = "full_time" | "part_time" | "contract" | "freelance" | "internship";
export type JobLevel = "intern" | "junior" | "mid" | "senior" | "lead" | "principal" | "director" | "vp" | "c_level";
export type RemotePolicy = "remote" | "hybrid" | "onsite";
export type ApplicationStatus = "saved" | "applied" | "screening" | "interviewing" | "offered" | "accepted" | "rejected" | "withdrawn";
export type SkillCategory = "technical" | "soft" | "domain" | "tool" | "language" | "certification";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type Currency = "USD" | "EUR" | "GBP" | "GEL" | "CAD" | "AUD";
export type PayPeriod = "hourly" | "monthly" | "yearly";

// --- User & Profile ---

export interface UserProfile {
  id: string;
  userId: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  country: string | null;
  avatarUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  yearsOfExperience: number;
  currentTitle: string | null;
  desiredTitle: string | null;
  desiredSalaryMin: number | null;
  desiredSalaryMax: number | null;
  desiredSalaryCurrency: Currency;
  openToRemote: boolean;
  openToRelocation: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExperience {
  id: string;
  profileId: string;
  company: string;
  title: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string | null;
}

export interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  field: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
}

// --- Jobs ---

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  companyDomain: string | null;
  location: string;
  country: string;
  remotePolicy: RemotePolicy;
  type: JobType;
  level: JobLevel;
  description: string;
  requirements: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: Currency;
  salaryPeriod: PayPeriod;
  skills: string[];
  postedAt: Date;
  expiresAt: Date | null;
  applicationUrl: string | null;
  featured: boolean;
}

export interface JobWithMatch extends Job {
  matchScore: number;
  matchBreakdown: {
    skills: number;
    salary: number;
    location: number;
    experience: number;
  };
}

// --- Skills ---

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: SkillCategory;
  parentId: string | null;
  description: string | null;
  demandScore: number;
  growthRate: number;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  level: SkillLevel;
  yearsOfExperience: number;
  verified: boolean;
  skill: Skill;
}

// --- Salary ---

export interface SalaryDataPoint {
  id: string;
  title: string;
  level: JobLevel;
  location: string;
  country: string;
  company: string | null;
  baseSalary: number;
  totalCompensation: number;
  currency: Currency;
  yearsOfExperience: number;
  reportedAt: Date;
}

// --- Navigation ---

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
}

// --- API ---

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

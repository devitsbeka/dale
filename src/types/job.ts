// ============================================
// JOB TYPES
// ============================================

// Job source APIs
export type JobSource =
  | 'remotive'
  | 'remoteok'
  | 'arbeitnow'
  | 'himalayas'
  | 'themuse'
  | 'jobicy'
  | 'usajobs'
  | 'adzuna'
  | 'findwork'
  | 'linkedin'
  | 'greenhouse'
  | 'indeed';

// Location types
export type LocationType = 'remote' | 'onsite' | 'hybrid';

// Experience levels
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive' | 'any';

// Employment types
export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship'
  | 'freelance'
  | 'temporary';

// Application status
export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interviewing'
  | 'offer'
  | 'rejected'
  | 'withdrawn'
  | 'accepted';

// Job categories
export type JobCategory =
  | 'engineering'
  | 'software-dev'
  | 'data'
  | 'devops'
  | 'design'
  | 'product'
  | 'marketing'
  | 'sales'
  | 'customer-support'
  | 'hr'
  | 'finance'
  | 'legal'
  | 'operations'
  | 'writing'
  | 'qa'
  | 'management'
  | 'other';

// ============================================
// CORE JOB INTERFACE
// ============================================

export interface Job {
  id: string;
  externalId: string;
  source: JobSource;

  // Core info
  title: string;
  company: string;
  companyLogo?: string | null;
  companyUrl?: string | null;
  location?: string | null;
  locationType: LocationType;

  // Job details
  description: string;
  descriptionHtml?: string | null;
  requirements?: string | null;
  benefits?: string | null;

  // Categorization
  category?: JobCategory | string | null;
  tags: string[];
  experienceLevel?: ExperienceLevel | null;
  employmentType?: EmploymentType | null;

  // Compensation
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  salaryPeriod?: string | null;

  // Application
  applyUrl: string;
  applicationEmail?: string | null;

  // Metadata
  publishedAt?: Date | string | null;
  expiresAt?: Date | string | null;
  fetchedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;

  // UI state (not persisted)
  isSaved?: boolean;
  hasApplied?: boolean;
}

// Job with relations
export interface JobWithRelations extends Job {
  savedBy?: SavedJob[];
  applications?: JobApplication[];
}

// ============================================
// SAVED JOB
// ============================================

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  notes?: string | null;
  priority: number; // 0=normal, 1=high, 2=very high
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SavedJobWithJob extends SavedJob {
  job: Job;
}

// ============================================
// JOB APPLICATION
// ============================================

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  resumeId?: string | null;

  // Status
  status: ApplicationStatus;

  // Details
  coverLetter?: string | null;
  appliedAt: Date | string;
  appliedVia: 'direct' | 'linkedin' | 'email' | 'referral';

  // Interview tracking
  interviewRounds: number;
  nextStepDate?: Date | string | null;
  nextStepNotes?: string | null;

  // Offer
  offeredSalary?: number | null;
  offeredCurrency?: string | null;
  offerDeadline?: Date | string | null;

  // Notes
  notes?: string | null;
  timeline?: ApplicationTimelineEntry[] | string | null;

  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface JobApplicationWithRelations extends JobApplication {
  job: Job;
  resume?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface ApplicationTimelineEntry {
  status: ApplicationStatus;
  date: string;
  notes?: string;
}

// ============================================
// JOB ALERT
// ============================================

export interface JobAlert {
  id: string;
  userId: string;
  name: string;

  // Search criteria
  keywords?: string | null;
  locations: string[];
  categories: string[];
  locationType?: LocationType | null;
  experienceLevel?: ExperienceLevel | null;
  employmentType?: EmploymentType | null;
  salaryMin?: number | null;

  // Settings
  frequency: 'instant' | 'daily' | 'weekly';
  isActive: boolean;
  lastSentAt?: Date | string | null;

  createdAt: Date | string;
  updatedAt: Date | string;
}

// ============================================
// SEARCH & FILTER
// ============================================

export interface JobFilters {
  query?: string;
  locations?: string[];
  locationType?: LocationType[];
  categories?: JobCategory[];
  experienceLevel?: ExperienceLevel[];
  employmentType?: EmploymentType[];
  salaryMin?: number;
  salaryMax?: number;
  sources?: JobSource[];
  postedWithin?: 'day' | 'week' | 'month' | 'any';
  sortBy?: 'relevance' | 'date' | 'salary';
  sortOrder?: 'asc' | 'desc';
}

export interface JobSearchParams extends JobFilters {
  page?: number;
  limit?: number;
}

export interface JobSearchResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    availableCategories: { value: string; label: string; count: number }[];
    availableLocations: { value: string; label: string; count: number }[];
    availableSources: { value: JobSource; label: string; count: number }[];
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

// Remotive API
export interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string | null;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

export interface RemotiveResponse {
  'job-count': number;
  jobs: RemotiveJob[];
}

// RemoteOK API
export interface RemoteOKJob {
  id: string;
  epoch: number;
  date: string;
  company: string;
  company_logo: string;
  position: string;
  tags: string[];
  description: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  url: string;
  apply_url: string;
}

// Arbeitnow API
export interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

export interface ArbeitnowResponse {
  data: ArbeitnowJob[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    info: string;
    terms: string;
  };
}

// Himalayas API
export interface HimalayasJob {
  id: string;
  title: string;
  excerpt: string;
  companyName: string;
  companyLogo: string;
  locationRestrictions: string[];
  categories: string[];
  seniority: string;
  timezoneRestrictions: string[];
  publishedDate: string;
  applicationLink: string;
}

export interface HimalayasResponse {
  jobs: HimalayasJob[];
  offset: number;
  limit: number;
  totalJobs: number;
  totalPages: number;
}

// The Muse API
export interface TheMuseJob {
  id: number;
  name: string;
  type: string;
  publication_date: string;
  short_name: string;
  model_type: string;
  locations: { name: string }[];
  categories: { name: string }[];
  levels: { name: string; short_name: string }[];
  tags: string[];
  refs: {
    landing_page: string;
  };
  company: {
    id: number;
    name: string;
    short_name: string;
  };
  contents: string;
}

export interface TheMuseResponse {
  page: number;
  page_count: number;
  items_per_page: number;
  took: number;
  timed_out: boolean;
  total: number;
  results: TheMuseJob[];
}

// Jobicy API
export interface JobicyJob {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  jobIndustry: string[];
  jobType: string[];
  jobGeo: string;
  jobLevel: string;
  jobExcerpt: string;
  jobDescription: string;
  pubDate: string;
  annualSalaryMin?: string;
  annualSalaryMax?: string;
  salaryCurrency?: string;
}

export interface JobicyResponse {
  jobCount: number;
  jobs: JobicyJob[];
}

// USAJobs API
export interface USAJobsJob {
  MatchedObjectId: string;
  MatchedObjectDescriptor: {
    PositionID: string;
    PositionTitle: string;
    PositionURI: string;
    ApplyURI: string[];
    PositionLocation: {
      LocationName: string;
      CountryCode: string;
      CityName: string;
    }[];
    OrganizationName: string;
    DepartmentName: string;
    JobCategory: {
      Name: string;
      Code: string;
    }[];
    PositionSchedule: {
      Name: string;
      Code: string;
    }[];
    PositionOfferingType: {
      Name: string;
      Code: string;
    }[];
    QualificationSummary: string;
    PositionRemuneration: {
      MinimumRange: string;
      MaximumRange: string;
      RateIntervalCode: string;
      Description: string;
    }[];
    PositionStartDate: string;
    PositionEndDate: string;
    PublicationStartDate: string;
    ApplicationCloseDate: string;
    UserArea: {
      Details: {
        JobSummary: string;
        WhoMayApply: {
          Name: string;
          Code: string;
        };
        TeleworkEligible: boolean;
      };
    };
  };
}

export interface USAJobsResponse {
  SearchResult: {
    SearchResultCount: number;
    SearchResultCountAll: number;
    SearchResultItems: USAJobsJob[];
  };
}

// FindWork API
export interface FindWorkJob {
  id: string;
  role: string;
  company_name: string;
  company_num_employees: string | null;
  employment_type: string;
  location: string;
  remote: boolean;
  logo: string | null;
  url: string;
  text: string;
  date_posted: string;
  keywords: string[];
  source: string;
}

export interface FindWorkResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FindWorkJob[];
}

// ============================================
// AGGREGATED STATS
// ============================================

export interface JobStats {
  totalJobs: number;
  newToday: number;
  byCategory: Record<string, number>;
  byLocationType: Record<LocationType, number>;
  bySource: Record<JobSource, number>;
  avgSalary?: {
    min: number;
    max: number;
    currency: string;
  };
}

// Application stats
export interface ApplicationStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  responseRate: number;
  avgTimeToResponse: number; // in days
  weeklyApplications: { week: string; count: number }[];
}

// ============================================
// UI STATE
// ============================================

export interface JobsState {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  filters: JobFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  selectedJob: Job | null;
}

export interface SavedJobsState {
  savedJobs: SavedJobWithJob[];
  isLoading: boolean;
  error: string | null;
}

export interface ApplicationsState {
  applications: JobApplicationWithRelations[];
  isLoading: boolean;
  error: string | null;
  stats: ApplicationStats | null;
}

// ============================================
// FORM DATA
// ============================================

export interface ApplyFormData {
  resumeId: string;
  coverLetter?: string;
  appliedVia?: 'direct' | 'linkedin' | 'email' | 'referral';
  notes?: string;
}

export interface UpdateApplicationData {
  status?: ApplicationStatus;
  interviewRounds?: number;
  nextStepDate?: string;
  nextStepNotes?: string;
  offeredSalary?: number;
  offeredCurrency?: string;
  offerDeadline?: string;
  notes?: string;
}

// ============================================
// CONSTANTS
// ============================================

export const JOB_CATEGORIES: { value: JobCategory; label: string }[] = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'software-dev', label: 'Software Development' },
  { value: 'data', label: 'Data Science' },
  { value: 'devops', label: 'DevOps & SRE' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'customer-support', label: 'Customer Support' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'legal', label: 'Legal' },
  { value: 'operations', label: 'Operations' },
  { value: 'writing', label: 'Writing & Content' },
  { value: 'qa', label: 'QA & Testing' },
  { value: 'management', label: 'Management' },
  { value: 'other', label: 'Other' },
];

export const LOCATION_TYPES: { value: LocationType; label: string }[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'executive', label: 'Executive' },
  { value: 'any', label: 'Any Level' },
];

export const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'temporary', label: 'Temporary' },
];

export const APPLICATION_STATUSES: {
  value: ApplicationStatus;
  label: string;
  color: string;
}[] = [
  { value: 'applied', label: 'Applied', color: 'blue' },
  { value: 'screening', label: 'Screening', color: 'yellow' },
  { value: 'interviewing', label: 'Interviewing', color: 'purple' },
  { value: 'offer', label: 'Offer', color: 'green' },
  { value: 'accepted', label: 'Accepted', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'gray' },
];

export const JOB_SOURCES: { value: JobSource; label: string; url: string }[] = [
  { value: 'remotive', label: 'Remotive', url: 'https://remotive.com' },
  { value: 'remoteok', label: 'RemoteOK', url: 'https://remoteok.com' },
  { value: 'arbeitnow', label: 'Arbeitnow', url: 'https://arbeitnow.com' },
  { value: 'himalayas', label: 'Himalayas', url: 'https://himalayas.app' },
  { value: 'themuse', label: 'The Muse', url: 'https://themuse.com' },
  { value: 'jobicy', label: 'Jobicy', url: 'https://jobicy.com' },
  { value: 'usajobs', label: 'USAJobs', url: 'https://usajobs.gov' },
  { value: 'adzuna', label: 'Adzuna', url: 'https://adzuna.com' },
  { value: 'findwork', label: 'Findwork', url: 'https://findwork.dev' },
];

export const POSTED_WITHIN_OPTIONS = [
  { value: 'day', label: 'Last 24 hours' },
  { value: 'week', label: 'Last 7 days' },
  { value: 'month', label: 'Last 30 days' },
  { value: 'any', label: 'Any time' },
];

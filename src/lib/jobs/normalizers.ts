/**
 * Job Normalizers
 * Converts different API responses to our unified Job format
 */

import type {
  Job,
  JobSource,
  LocationType,
  ExperienceLevel,
  EmploymentType,
  RemotiveJob,
  RemoteOKJob,
  ArbeitnowJob,
  HimalayasJob,
  TheMuseJob,
  JobicyJob,
  USAJobsJob,
  FindWorkJob,
} from '@/types/job';

// Generate a unique ID for a job
function generateJobId(source: JobSource, externalId: string): string {
  return `${source}-${externalId}`;
}

// Parse salary string to min/max numbers
function parseSalaryRange(
  salary: string | null | undefined
): { min: number | null; max: number | null; currency: string } {
  if (!salary) return { min: null, max: null, currency: 'USD' };

  // Clean up the string
  const cleaned = salary.replace(/[,\s]/g, '').toLowerCase();

  // Try to find currency
  let currency = 'USD';
  if (cleaned.includes('eur') || cleaned.includes('€')) currency = 'EUR';
  else if (cleaned.includes('gbp') || cleaned.includes('£')) currency = 'GBP';

  // Extract numbers
  const numbers = cleaned.match(/\d+/g);
  if (!numbers) return { min: null, max: null, currency };

  const values = numbers.map((n) => parseInt(n, 10)).filter((n) => n > 100);

  if (values.length === 0) return { min: null, max: null, currency };
  if (values.length === 1) return { min: values[0], max: values[0], currency };

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    currency,
  };
}

// Normalize category strings to our categories
function normalizeCategory(category: string | null | undefined): string | null {
  if (!category) return null;

  const lower = category.toLowerCase();

  // Engineering & Development
  if (
    lower.includes('engineer') ||
    lower.includes('developer') ||
    lower.includes('programming') ||
    lower.includes('software')
  ) {
    return 'software-dev';
  }

  // Data
  if (
    lower.includes('data') ||
    lower.includes('analytics') ||
    lower.includes('machine learning') ||
    lower.includes('ai ')
  ) {
    return 'data';
  }

  // DevOps
  if (
    lower.includes('devops') ||
    lower.includes('sre') ||
    lower.includes('infrastructure') ||
    lower.includes('cloud')
  ) {
    return 'devops';
  }

  // Design
  if (
    lower.includes('design') ||
    lower.includes('ux') ||
    lower.includes('ui') ||
    lower.includes('creative')
  ) {
    return 'design';
  }

  // Product
  if (lower.includes('product')) {
    return 'product';
  }

  // Marketing
  if (
    lower.includes('marketing') ||
    lower.includes('seo') ||
    lower.includes('growth')
  ) {
    return 'marketing';
  }

  // Sales
  if (
    lower.includes('sales') ||
    lower.includes('business development') ||
    lower.includes('account')
  ) {
    return 'sales';
  }

  // Customer Support
  if (
    lower.includes('customer') ||
    lower.includes('support') ||
    lower.includes('success')
  ) {
    return 'customer-support';
  }

  // HR
  if (
    lower.includes('hr') ||
    lower.includes('human resources') ||
    lower.includes('recruiting') ||
    lower.includes('talent')
  ) {
    return 'hr';
  }

  // Finance
  if (
    lower.includes('finance') ||
    lower.includes('accounting') ||
    lower.includes('financial')
  ) {
    return 'finance';
  }

  // Legal
  if (lower.includes('legal') || lower.includes('compliance')) {
    return 'legal';
  }

  // Operations
  if (lower.includes('operations') || lower.includes('ops')) {
    return 'operations';
  }

  // Writing
  if (
    lower.includes('writing') ||
    lower.includes('content') ||
    lower.includes('copywriting') ||
    lower.includes('editor')
  ) {
    return 'writing';
  }

  // QA
  if (lower.includes('qa') || lower.includes('quality') || lower.includes('testing')) {
    return 'qa';
  }

  // Management
  if (
    lower.includes('management') ||
    lower.includes('manager') ||
    lower.includes('director') ||
    lower.includes('lead')
  ) {
    return 'management';
  }

  return 'other';
}

// Normalize experience level
function normalizeExperienceLevel(level: string | null | undefined): ExperienceLevel | null {
  if (!level) return null;

  const lower = level.toLowerCase();

  if (lower.includes('entry') || lower.includes('junior') || lower.includes('intern')) {
    return 'entry';
  }
  if (lower.includes('mid') || lower.includes('intermediate')) {
    return 'mid';
  }
  if (lower.includes('senior') || lower.includes('sr') || lower.includes('lead')) {
    return 'senior';
  }
  if (
    lower.includes('executive') ||
    lower.includes('director') ||
    lower.includes('vp') ||
    lower.includes('chief')
  ) {
    return 'executive';
  }

  return null;
}

// Normalize employment type
function normalizeEmploymentType(type: string | null | undefined): EmploymentType | null {
  if (!type) return 'full-time';

  const lower = type.toLowerCase();

  if (lower.includes('full')) return 'full-time';
  if (lower.includes('part')) return 'part-time';
  if (lower.includes('contract') || lower.includes('freelance')) return 'contract';
  if (lower.includes('intern')) return 'internship';
  if (lower.includes('temp')) return 'temporary';

  return 'full-time';
}

// Determine location type from job data
function determineLocationType(
  isRemote: boolean | undefined,
  location: string | null | undefined
): LocationType {
  if (isRemote === true) return 'remote';

  if (location) {
    const lower = location.toLowerCase();
    if (lower.includes('remote')) return 'remote';
    if (lower.includes('hybrid')) return 'hybrid';
  }

  return 'onsite';
}

// Strip HTML tags from description
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================
// NORMALIZERS FOR EACH API
// ============================================

export function normalizeRemotiveJob(job: RemotiveJob): Job {
  const salary = parseSalaryRange(job.salary);

  return {
    id: generateJobId('remotive', String(job.id)),
    externalId: String(job.id),
    source: 'remotive',
    title: job.title,
    company: job.company_name,
    companyLogo: job.company_logo || null,
    companyUrl: null,
    location: job.candidate_required_location || 'Worldwide',
    locationType: 'remote',
    description: stripHtml(job.description),
    descriptionHtml: job.description,
    requirements: null,
    benefits: null,
    category: normalizeCategory(job.category),
    tags: job.tags || [],
    experienceLevel: null,
    employmentType: normalizeEmploymentType(job.job_type),
    salaryMin: salary.min,
    salaryMax: salary.max,
    salaryCurrency: salary.currency,
    salaryPeriod: 'yearly',
    applyUrl: job.url,
    applicationEmail: null,
    publishedAt: job.publication_date,
    expiresAt: null,
    fetchedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeRemoteOKJob(job: RemoteOKJob): Job {
  return {
    id: generateJobId('remoteok', job.id),
    externalId: job.id,
    source: 'remoteok',
    title: job.position,
    company: job.company,
    companyLogo: job.company_logo || null,
    companyUrl: null,
    location: job.location || 'Worldwide',
    locationType: 'remote',
    description: stripHtml(job.description),
    descriptionHtml: job.description,
    requirements: null,
    benefits: null,
    category: normalizeCategory(job.tags?.[0]),
    tags: job.tags || [],
    experienceLevel: null,
    employmentType: 'full-time',
    salaryMin: job.salary_min || null,
    salaryMax: job.salary_max || null,
    salaryCurrency: 'USD',
    salaryPeriod: 'yearly',
    applyUrl: job.apply_url || job.url,
    applicationEmail: null,
    publishedAt: job.date,
    expiresAt: null,
    fetchedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeArbeitnowJob(job: ArbeitnowJob): Job {
  return {
    id: generateJobId('arbeitnow', job.slug),
    externalId: job.slug,
    source: 'arbeitnow',
    title: job.title,
    company: job.company_name,
    companyLogo: null,
    companyUrl: null,
    location: job.location || 'Europe',
    locationType: job.remote ? 'remote' : 'onsite',
    description: stripHtml(job.description),
    descriptionHtml: job.description,
    requirements: null,
    benefits: null,
    category: normalizeCategory(job.tags?.[0]),
    tags: job.tags || [],
    experienceLevel: null,
    employmentType: normalizeEmploymentType(job.job_types?.[0]),
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryPeriod: null,
    applyUrl: job.url,
    applicationEmail: null,
    publishedAt: new Date(job.created_at * 1000).toISOString(),
    expiresAt: null,
    fetchedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeHimalayasJob(job: HimalayasJob): Job {
  return {
    id: generateJobId('himalayas', job.id),
    externalId: job.id,
    source: 'himalayas',
    title: job.title,
    company: job.companyName,
    companyLogo: job.companyLogo || null,
    companyUrl: null,
    location:
      job.locationRestrictions?.length > 0
        ? job.locationRestrictions.join(', ')
        : 'Worldwide',
    locationType: 'remote',
    description: job.excerpt,
    descriptionHtml: null,
    requirements: null,
    benefits: null,
    category: normalizeCategory(job.categories?.[0]),
    tags: job.categories || [],
    experienceLevel: normalizeExperienceLevel(job.seniority),
    employmentType: 'full-time',
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryPeriod: null,
    applyUrl: job.applicationLink,
    applicationEmail: null,
    publishedAt: job.publishedDate,
    expiresAt: null,
    fetchedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeTheMuseJob(job: TheMuseJob): Job {
  return {
    id: generateJobId('themuse', String(job.id)),
    externalId: String(job.id),
    source: 'themuse',
    title: job.name,
    company: job.company.name,
    companyLogo: null,
    companyUrl: null,
    location: job.locations?.map((l) => l.name).join(', ') || 'United States',
    locationType: determineLocationType(
      job.locations?.some((l) => l.name.toLowerCase().includes('remote')),
      job.locations?.[0]?.name
    ),
    description: stripHtml(job.contents),
    descriptionHtml: job.contents,
    requirements: null,
    benefits: null,
    category: normalizeCategory(job.categories?.[0]?.name),
    tags: job.categories?.map((c) => c.name) || [],
    experienceLevel: normalizeExperienceLevel(job.levels?.[0]?.name),
    employmentType: normalizeEmploymentType(job.type),
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryPeriod: null,
    applyUrl: job.refs.landing_page,
    applicationEmail: null,
    publishedAt: job.publication_date,
    expiresAt: null,
    fetchedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeJobicyJob(job: JobicyJob): Job {
  const salaryMin = job.annualSalaryMin ? parseInt(job.annualSalaryMin, 10) : null;
  const salaryMax = job.annualSalaryMax ? parseInt(job.annualSalaryMax, 10) : null;

  return {
    id: generateJobId('jobicy', String(job.id)),
    externalId: String(job.id),
    source: 'jobicy',
    title: job.jobTitle,
    company: job.companyName,
    companyLogo: job.companyLogo || null,
    companyUrl: null,
    location: job.jobGeo || 'Worldwide',
    locationType: 'remote',
    description: stripHtml(job.jobDescription || job.jobExcerpt),
    descriptionHtml: job.jobDescription,
    requirements: null,
    benefits: null,
    category: normalizeCategory(job.jobIndustry?.[0]),
    tags: job.jobIndustry || [],
    experienceLevel: normalizeExperienceLevel(job.jobLevel),
    employmentType: normalizeEmploymentType(job.jobType?.[0]),
    salaryMin: salaryMin && salaryMin > 100 ? salaryMin : null,
    salaryMax: salaryMax && salaryMax > 100 ? salaryMax : null,
    salaryCurrency: job.salaryCurrency || 'USD',
    salaryPeriod: 'yearly',
    applyUrl: job.url,
    applicationEmail: null,
    publishedAt: job.pubDate,
    expiresAt: null,
    fetchedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeUSAJobsJob(job: USAJobsJob): Job {
  const desc = job.MatchedObjectDescriptor;
  const remuneration = desc.PositionRemuneration?.[0];
  const salaryMin = remuneration?.MinimumRange
    ? parseInt(remuneration.MinimumRange, 10)
    : null;
  const salaryMax = remuneration?.MaximumRange
    ? parseInt(remuneration.MaximumRange, 10)
    : null;

  return {
    id: generateJobId('usajobs', job.MatchedObjectId),
    externalId: job.MatchedObjectId,
    source: 'usajobs',
    title: desc.PositionTitle,
    company: desc.OrganizationName,
    companyLogo: null,
    companyUrl: null,
    location:
      desc.PositionLocation?.map((l) => l.LocationName).join(', ') || 'United States',
    locationType: desc.UserArea?.Details?.TeleworkEligible ? 'remote' : 'onsite',
    description: stripHtml(
      desc.UserArea?.Details?.JobSummary || desc.QualificationSummary
    ),
    descriptionHtml: null,
    requirements: desc.QualificationSummary,
    benefits: null,
    category: normalizeCategory(desc.JobCategory?.[0]?.Name),
    tags: desc.JobCategory?.map((c) => c.Name) || [],
    experienceLevel: null,
    employmentType: normalizeEmploymentType(desc.PositionSchedule?.[0]?.Name),
    salaryMin,
    salaryMax,
    salaryCurrency: 'USD',
    salaryPeriod: remuneration?.RateIntervalCode === 'PA' ? 'yearly' : 'hourly',
    applyUrl: desc.ApplyURI?.[0] || desc.PositionURI,
    applicationEmail: null,
    publishedAt: desc.PublicationStartDate,
    expiresAt: desc.ApplicationCloseDate,
    fetchedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeFindWorkJob(job: FindWorkJob): Job {
  return {
    id: generateJobId('findwork', job.id),
    externalId: job.id,
    source: 'findwork',
    title: job.role,
    company: job.company_name,
    companyLogo: job.logo || null,
    companyUrl: null,
    location: job.location || 'Worldwide',
    locationType: job.remote ? 'remote' : 'onsite',
    description: stripHtml(job.text),
    descriptionHtml: job.text,
    requirements: null,
    benefits: null,
    category: normalizeCategory(job.keywords?.[0]),
    tags: job.keywords || [],
    experienceLevel: null,
    employmentType: normalizeEmploymentType(job.employment_type),
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: null,
    salaryPeriod: null,
    applyUrl: job.url,
    applicationEmail: null,
    publishedAt: job.date_posted,
    expiresAt: null,
    fetchedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

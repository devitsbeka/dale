/**
 * Apify Job Normalizers
 * Convert actor outputs to our unified Job format
 */

import type { Job } from '@/types/job';
import {
  normalizeJobTitle,
  normalizeCompanyName,
  normalizeDescription,
  normalizeLocation,
  getCompanyLogoUrl,
  normalizeUrl,
  normalizeSalary,
  extractSkillsFromDescription,
} from '@/lib/jobs/semantic-normalizer';

/**
 * Normalize LinkedIn job from curious_coder/linkedin-jobs-scraper
 */
export function normalizeLinkedInJob(item: any): Job | null {
  try {
    // Semantic normalization
    const normalizedTitle = normalizeJobTitle(item.title || item.jobTitle);
    const normalizedCompany = normalizeCompanyName(item.companyName || item.company);
    const normalizedDesc = normalizeDescription(
      item.description || item.jobDescription,
      item.descriptionHtml
    );
    const normalizedLoc = normalizeLocation(item.location);
    const normalizedSalary = normalizeSalary(
      item.salaryRange?.min,
      item.salaryRange?.max,
      'yearly'
    );

    // Get company logo (fallback to Clearbit if not provided)
    const companyLogo =
      item.companyLogo ||
      item.companyLogoUrl ||
      getCompanyLogoUrl(
        normalizedCompany.name,
        item.companyUrl || item.companyLinkedInUrl
      );

    // Extract skills from description if not provided
    const tags = item.skills && item.skills.length > 0
      ? item.skills
      : extractSkillsFromDescription(normalizedDesc);

    return {
      id: `linkedin-${item.jobId || item.id}`,
      externalId: item.jobId || item.id,
      source: 'linkedin',
      title: normalizedTitle,
      company: normalizedCompany.displayName,
      companyLogo,
      companyUrl: normalizeUrl(item.companyUrl || item.companyLinkedInUrl),
      location: normalizedLoc.display,
      locationType: normalizedLoc.isRemote
        ? 'remote'
        : item.workplaceType?.toLowerCase() === 'hybrid'
        ? 'hybrid'
        : 'onsite',
      description: normalizedDesc,
      descriptionHtml: item.descriptionHtml || null,
      requirements: null,
      benefits: null,
      category: categorizeJob(normalizedTitle),
      tags,
      experienceLevel: normalizeExperienceLevel(item.seniorityLevel),
      employmentType: normalizeEmploymentType(item.employmentType),
      salaryMin: normalizedSalary.min,
      salaryMax: normalizedSalary.max,
      salaryCurrency: item.salaryCurrency || 'USD',
      salaryPeriod: normalizedSalary.period,
      applyUrl: normalizeUrl(item.applyUrl || item.url || item.link) || '#',
      applicationEmail: null,
      publishedAt: item.postedAt || item.listedAt || new Date().toISOString(),
      expiresAt: null,
      fetchedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error normalizing LinkedIn job:', error);
    return null;
  }
}

/**
 * Normalize Greenhouse job from bytepulselabs/greenhouse-job-scraper
 */
export function normalizeGreenhouseJob(item: any): Job | null {
  try {
    // Semantic normalization
    const normalizedTitle = normalizeJobTitle(item.title);
    const normalizedCompany = normalizeCompanyName(item.companyName);
    const normalizedDesc = normalizeDescription(item.content, item.content);
    const normalizedLoc = normalizeLocation(item.location?.name);

    // Extract company URL from job URL
    let companyUrl: string | null = null;
    if (item.absoluteUrl) {
      try {
        companyUrl = new URL(item.absoluteUrl).origin;
      } catch (e) {
        companyUrl = null;
      }
    }

    // Get company logo
    const companyLogo = getCompanyLogoUrl(normalizedCompany.name, companyUrl);

    // Extract tags from departments and description
    const departmentTags = item.departments?.map((d: any) => d.name) || [];
    const descriptionTags = extractSkillsFromDescription(normalizedDesc);
    const tags = [...new Set([...departmentTags, ...descriptionTags])].slice(0, 20);

    return {
      id: `greenhouse-${item.id}`,
      externalId: String(item.id),
      source: 'greenhouse',
      title: normalizedTitle,
      company: normalizedCompany.displayName,
      companyLogo,
      companyUrl: normalizeUrl(companyUrl),
      location: normalizedLoc.display,
      locationType: normalizedLoc.isRemote ? 'remote' : 'onsite',
      description: normalizedDesc,
      descriptionHtml: item.content,
      requirements: null,
      benefits: null,
      category: categorizeJob(normalizedTitle),
      tags,
      experienceLevel: null,
      employmentType: 'full-time',
      salaryMin: null,
      salaryMax: null,
      salaryCurrency: null,
      salaryPeriod: null,
      applyUrl: normalizeUrl(item.absoluteUrl) || '#',
      applicationEmail: null,
      publishedAt: item.updatedAt || new Date().toISOString(),
      expiresAt: null,
      fetchedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error normalizing Greenhouse job:', error);
    return null;
  }
}

/**
 * Normalize Indeed job from misceres/indeed-scraper
 */
export function normalizeIndeedJob(item: any): Job | null {
  try {
    // Semantic normalization
    const normalizedTitle = normalizeJobTitle(item.title || item.jobTitle);
    const normalizedCompany = normalizeCompanyName(item.company || item.companyName);
    const normalizedDesc = normalizeDescription(
      item.description || item.snippet,
      item.descriptionHtml
    );
    const normalizedLoc = normalizeLocation(
      item.location || item.formattedLocation
    );

    // Parse salary if provided as string
    const parsedSalary = parseSalary(item.salary);
    const salaryMin = item.salary?.min || parsedSalary?.min || null;
    const salaryMax = item.salary?.max || parsedSalary?.max || null;
    const normalizedSalary = normalizeSalary(salaryMin, salaryMax, 'yearly');

    // Get company logo
    const companyLogo =
      item.companyLogo || getCompanyLogoUrl(normalizedCompany.name, item.companyUrl);

    // Extract skills from description if not provided
    const tags =
      item.tags && item.tags.length > 0
        ? item.tags
        : extractSkillsFromDescription(normalizedDesc);

    return {
      id: `indeed-${item.id || item.jobkey}`,
      externalId: item.id || item.jobkey,
      source: 'indeed',
      title: normalizedTitle,
      company: normalizedCompany.displayName,
      companyLogo,
      companyUrl: normalizeUrl(item.companyUrl),
      location: normalizedLoc.display,
      locationType: normalizedLoc.isRemote || item.isRemote ? 'remote' : 'onsite',
      description: normalizedDesc,
      descriptionHtml: item.descriptionHtml || null,
      requirements: null,
      benefits: null,
      category: categorizeJob(normalizedTitle),
      tags,
      experienceLevel: null,
      employmentType: item.jobType || 'full-time',
      salaryMin: normalizedSalary.min,
      salaryMax: normalizedSalary.max,
      salaryCurrency: 'USD',
      salaryPeriod: normalizedSalary.period,
      applyUrl: normalizeUrl(item.url || item.link) || '#',
      applicationEmail: null,
      publishedAt: item.postedAt || item.date || new Date().toISOString(),
      expiresAt: null,
      fetchedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error normalizing Indeed job:', error);
    return null;
  }
}

/**
 * Helper: Categorize job based on title
 */
function categorizeJob(title: string): string {
  const lower = title.toLowerCase();

  if (
    lower.includes('engineer') ||
    lower.includes('developer') ||
    lower.includes('programmer')
  ) {
    return 'software-dev';
  }
  if (lower.includes('data') || lower.includes('analytics')) {
    return 'data';
  }
  if (lower.includes('design') || lower.includes('ux')) {
    return 'design';
  }
  if (lower.includes('product')) {
    return 'product';
  }
  if (lower.includes('marketing')) {
    return 'marketing';
  }
  if (lower.includes('sales')) {
    return 'sales';
  }

  return 'other';
}

/**
 * Helper: Normalize experience level
 */
function normalizeExperienceLevel(level: string | undefined): 'entry' | 'mid' | 'senior' | 'executive' | null {
  if (!level) return null;

  const lower = level.toLowerCase();

  if (lower.includes('entry') || lower.includes('junior')) return 'entry';
  if (lower.includes('mid') || lower.includes('intermediate')) return 'mid';
  if (lower.includes('senior') || lower.includes('lead')) return 'senior';
  if (lower.includes('executive') || lower.includes('director')) return 'executive';

  return null;
}

/**
 * Helper: Normalize employment type
 */
function normalizeEmploymentType(type: string | undefined): 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance' | 'temporary' {
  if (!type) return 'full-time';

  const lower = type.toLowerCase();

  if (lower.includes('full')) return 'full-time';
  if (lower.includes('part')) return 'part-time';
  if (lower.includes('contract')) return 'contract';
  if (lower.includes('intern')) return 'internship';
  if (lower.includes('freelance')) return 'freelance';
  if (lower.includes('temp')) return 'temporary';

  return 'full-time';
}

/**
 * Helper: Parse salary from string
 */
function parseSalary(salary: any): { min: number; max: number } | null {
  if (!salary || typeof salary !== 'string') return null;

  const numbers = salary.match(/\d+/g);
  if (!numbers) return null;

  const values = numbers.map((n) => parseInt(n, 10)).filter((n) => n > 1000);

  if (values.length === 0) return null;
  if (values.length === 1) return { min: values[0], max: values[0] };

  return { min: Math.min(...values), max: Math.max(...values) };
}

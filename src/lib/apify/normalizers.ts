/**
 * Apify Job Normalizers
 * Convert actor outputs to our unified Job format
 */

import type { Job } from '@/types/job';

/**
 * Normalize LinkedIn job from curious_coder/linkedin-jobs-scraper
 */
export function normalizeLinkedInJob(item: any): Job | null {
  try {
    return {
      id: `linkedin-${item.jobId || item.id}`,
      externalId: item.jobId || item.id,
      source: 'linkedin',
      title: item.title || item.jobTitle,
      company: item.companyName || item.company,
      companyLogo: item.companyLogo || item.companyLogoUrl,
      companyUrl: item.companyUrl || item.companyLinkedInUrl,
      location: item.location || 'Remote',
      locationType: item.workplaceType?.toLowerCase() === 'remote' ? 'remote' :
                    item.workplaceType?.toLowerCase() === 'hybrid' ? 'hybrid' : 'onsite',
      description: item.description || item.jobDescription || '',
      descriptionHtml: item.descriptionHtml || null,
      requirements: null,
      benefits: null,
      category: categorizeJob(item.title),
      tags: item.skills || [],
      experienceLevel: normalizeExperienceLevel(item.seniorityLevel),
      employmentType: normalizeEmploymentType(item.employmentType),
      salaryMin: item.salaryRange?.min || null,
      salaryMax: item.salaryRange?.max || null,
      salaryCurrency: item.salaryCurrency || 'USD',
      salaryPeriod: 'yearly',
      applyUrl: item.applyUrl || item.url || item.link,
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
    return {
      id: `greenhouse-${item.id}`,
      externalId: String(item.id),
      source: 'greenhouse',
      title: item.title,
      company: item.companyName || 'Unknown Company',
      companyLogo: null,
      companyUrl: item.absoluteUrl ? new URL(item.absoluteUrl).origin : null,
      location: item.location?.name || 'Remote',
      locationType: item.location?.name?.toLowerCase().includes('remote') ? 'remote' : 'onsite',
      description: stripHtml(item.content || ''),
      descriptionHtml: item.content,
      requirements: null,
      benefits: null,
      category: categorizeJob(item.title),
      tags: item.departments?.map((d: any) => d.name) || [],
      experienceLevel: null,
      employmentType: 'full-time',
      salaryMin: null,
      salaryMax: null,
      salaryCurrency: null,
      salaryPeriod: null,
      applyUrl: item.absoluteUrl,
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
    return {
      id: `indeed-${item.id || item.jobkey}`,
      externalId: item.id || item.jobkey,
      source: 'indeed',
      title: item.title || item.jobTitle,
      company: item.company || item.companyName,
      companyLogo: item.companyLogo || null,
      companyUrl: item.companyUrl || null,
      location: item.location || item.formattedLocation || 'Remote',
      locationType: item.isRemote ? 'remote' : 'onsite',
      description: item.description || item.snippet || '',
      descriptionHtml: item.descriptionHtml || null,
      requirements: null,
      benefits: null,
      category: categorizeJob(item.title),
      tags: item.tags || [],
      experienceLevel: null,
      employmentType: item.jobType || 'full-time',
      salaryMin: item.salary?.min || parseSalary(item.salary)?.min || null,
      salaryMax: item.salary?.max || parseSalary(item.salary)?.max || null,
      salaryCurrency: 'USD',
      salaryPeriod: 'yearly',
      applyUrl: item.url || item.link,
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
 * Helper: Strip HTML tags
 */
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

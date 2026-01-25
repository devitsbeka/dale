/**
 * Deduplicator - Detects and handles duplicate jobs
 */

import type { Job } from '@/types/job';
import type { JobFingerprint, DeduplicationResult } from './types';

/**
 * Normalize string for fingerprinting
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Create a fingerprint hash for a job
 */
export function createJobFingerprint(job: Job): JobFingerprint {
  const normalizedTitle = normalizeString(job.title);
  const normalizedCompany = normalizeString(job.company);
  const hash = `${normalizedTitle}-${normalizedCompany}`;

  return {
    title: normalizedTitle,
    company: normalizedCompany,
    hash,
  };
}

/**
 * Calculate data quality score for a job
 * Higher score = better quality data
 */
export function calculateQualityScore(job: Job): number {
  let score = 0;

  // Title and company are required, give base score
  score += 10;

  // Description quality
  if (job.description && job.description.length > 100) score += 15;
  if (job.descriptionHtml) score += 5;

  // Salary information
  if (job.salaryMin || job.salaryMax) score += 10;
  if (job.salaryMin && job.salaryMax) score += 5;

  // Additional details
  if (job.requirements) score += 8;
  if (job.benefits) score += 7;
  if (job.companyLogo) score += 5;
  if (job.companyUrl) score += 5;

  // Categorization
  if (job.category) score += 5;
  if (job.tags && job.tags.length > 0) score += 5;
  if (job.experienceLevel) score += 5;
  if (job.employmentType) score += 5;

  // Location details
  if (job.location) score += 5;

  // Application details
  if (job.applyUrl) score += 5;
  if (job.applicationEmail) score += 3;

  // Dates
  if (job.publishedAt) score += 5;

  return score;
}

/**
 * Check if two jobs are duplicates based on fingerprints
 */
export function areDuplicates(job1: Job, job2: Job): boolean {
  const fp1 = createJobFingerprint(job1);
  const fp2 = createJobFingerprint(job2);

  return fp1.hash === fp2.hash;
}

/**
 * Select the better job from duplicates based on quality score
 */
export function selectBetterJob(job1: Job, job2: Job): Job {
  const score1 = calculateQualityScore(job1);
  const score2 = calculateQualityScore(job2);

  // If scores are equal, prefer the more recently published
  if (score1 === score2) {
    const date1 = job1.publishedAt ? new Date(job1.publishedAt).getTime() : 0;
    const date2 = job2.publishedAt ? new Date(job2.publishedAt).getTime() : 0;
    return date1 >= date2 ? job1 : job2;
  }

  return score1 > score2 ? job1 : job2;
}

/**
 * Deduplicate a list of jobs, keeping highest quality versions
 */
export function deduplicateJobs(jobs: Job[]): Job[] {
  const fingerprintMap = new Map<string, Job>();

  for (const job of jobs) {
    const fingerprint = createJobFingerprint(job);

    if (fingerprintMap.has(fingerprint.hash)) {
      // Found duplicate, keep the better one
      const existing = fingerprintMap.get(fingerprint.hash)!;
      const better = selectBetterJob(existing, job);
      fingerprintMap.set(fingerprint.hash, better);
    } else {
      fingerprintMap.set(fingerprint.hash, job);
    }
  }

  return Array.from(fingerprintMap.values());
}

/**
 * Group jobs by fingerprint for batch deduplication
 */
export function groupJobsByFingerprint(jobs: Job[]): Map<string, Job[]> {
  const groups = new Map<string, Job[]>();

  for (const job of jobs) {
    const fingerprint = createJobFingerprint(job);
    const existing = groups.get(fingerprint.hash) || [];
    existing.push(job);
    groups.set(fingerprint.hash, existing);
  }

  return groups;
}

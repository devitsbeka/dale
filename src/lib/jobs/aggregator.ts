/**
 * Job Aggregator
 * Combines jobs from multiple sources with caching, deduplication, and filtering
 */

import type { Job, JobSearchParams, JobFilters, JobSource } from '@/types/job';
import { JOB_FETCHERS } from './sources';

// ============================================
// IN-MEMORY CACHE
// ============================================

interface CacheEntry {
  jobs: Job[];
  timestamp: number;
  params: string;
}

const jobCache: Map<string, CacheEntry> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(params: JobSearchParams): string {
  return JSON.stringify({
    query: params.query || '',
    categories: params.categories?.sort() || [],
    locations: params.locations?.sort() || [],
    locationType: params.locationType?.sort() || [],
    sources: params.sources?.sort() || [],
  });
}

function getFromCache(params: JobSearchParams): Job[] | null {
  const key = getCacheKey(params);
  const entry = jobCache.get(key);

  if (!entry) return null;

  // Check if cache is still valid
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    jobCache.delete(key);
    return null;
  }

  return entry.jobs;
}

function setCache(params: JobSearchParams, jobs: Job[]): void {
  const key = getCacheKey(params);
  jobCache.set(key, {
    jobs,
    timestamp: Date.now(),
    params: key,
  });

  // Limit cache size
  if (jobCache.size > 50) {
    const oldest = Array.from(jobCache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp
    )[0];
    if (oldest) {
      jobCache.delete(oldest[0]);
    }
  }
}

// ============================================
// DEDUPLICATION
// ============================================

function generateJobFingerprint(job: Job): string {
  // Create a fingerprint based on title, company, and location
  const title = job.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const company = job.company.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${title}-${company}`;
}

function deduplicateJobs(jobs: Job[]): Job[] {
  const seen = new Map<string, Job>();

  for (const job of jobs) {
    const fingerprint = generateJobFingerprint(job);

    if (!seen.has(fingerprint)) {
      seen.set(fingerprint, job);
    } else {
      // If we've seen this job, keep the one with more data
      const existing = seen.get(fingerprint)!;
      const existingScore = scoreJobData(existing);
      const newScore = scoreJobData(job);

      if (newScore > existingScore) {
        seen.set(fingerprint, job);
      }
    }
  }

  return Array.from(seen.values());
}

function scoreJobData(job: Job): number {
  let score = 0;
  if (job.description?.length > 100) score += 2;
  if (job.descriptionHtml) score += 1;
  if (job.salaryMin) score += 2;
  if (job.salaryMax) score += 2;
  if (job.companyLogo) score += 1;
  if (job.tags?.length > 0) score += 1;
  if (job.experienceLevel) score += 1;
  if (job.requirements) score += 1;
  if (job.benefits) score += 1;
  return score;
}

// ============================================
// FILTERING
// ============================================

function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter((job) => {
    // Query filter (search in title, company, description)
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchText = `${job.title} ${job.company} ${job.description} ${job.tags?.join(' ')}`.toLowerCase();
      if (!searchText.includes(query)) {
        return false;
      }
    }

    // Location filter
    if (filters.locations?.length) {
      const jobLocation = (job.location || '').toLowerCase();
      const matchesLocation = filters.locations.some(
        (loc) => jobLocation.includes(loc.toLowerCase()) || loc.toLowerCase() === 'worldwide'
      );
      if (!matchesLocation && jobLocation !== 'worldwide' && !jobLocation.includes('remote')) {
        return false;
      }
    }

    // Location type filter (remote/onsite/hybrid)
    if (filters.locationType?.length) {
      if (!filters.locationType.includes(job.locationType)) {
        return false;
      }
    }

    // Category filter
    if (filters.categories?.length) {
      if (!job.category || !filters.categories.includes(job.category as never)) {
        return false;
      }
    }

    // Experience level filter
    if (filters.experienceLevel?.length) {
      if (
        !job.experienceLevel ||
        (!filters.experienceLevel.includes(job.experienceLevel) &&
          !filters.experienceLevel.includes('any'))
      ) {
        return false;
      }
    }

    // Employment type filter
    if (filters.employmentType?.length) {
      if (
        !job.employmentType ||
        !filters.employmentType.includes(job.employmentType)
      ) {
        return false;
      }
    }

    // Salary filter
    if (filters.salaryMin) {
      if (!job.salaryMin || job.salaryMin < filters.salaryMin) {
        return false;
      }
    }

    if (filters.salaryMax) {
      if (!job.salaryMax || job.salaryMax > filters.salaryMax) {
        return false;
      }
    }

    // Posted within filter
    if (filters.postedWithin && filters.postedWithin !== 'any') {
      if (job.publishedAt) {
        const publishedDate = new Date(job.publishedAt);
        const now = new Date();
        const diffDays = Math.floor(
          (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (filters.postedWithin === 'day' && diffDays > 1) return false;
        if (filters.postedWithin === 'week' && diffDays > 7) return false;
        if (filters.postedWithin === 'month' && diffDays > 30) return false;
      }
    }

    return true;
  });
}

// ============================================
// SORTING
// ============================================

function sortJobs(
  jobs: Job[],
  sortBy: 'relevance' | 'date' | 'salary' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
): Job[] {
  const sorted = [...jobs];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        comparison = dateB - dateA;
        break;

      case 'salary':
        const salaryA = a.salaryMax || a.salaryMin || 0;
        const salaryB = b.salaryMax || b.salaryMin || 0;
        comparison = salaryB - salaryA;
        break;

      case 'relevance':
        // Relevance is based on data quality and recency
        const scoreA = scoreJobData(a) + (a.publishedAt ? 5 : 0);
        const scoreB = scoreJobData(b) + (b.publishedAt ? 5 : 0);
        comparison = scoreB - scoreA;
        break;
    }

    return sortOrder === 'asc' ? -comparison : comparison;
  });

  return sorted;
}

// ============================================
// MAIN AGGREGATOR
// ============================================

export interface AggregateResult {
  jobs: Job[];
  total: number;
  sources: { source: JobSource; count: number; error?: string }[];
  fromCache: boolean;
}

export async function aggregateJobs(
  params: JobSearchParams = {}
): Promise<AggregateResult> {
  // Check cache first
  const cachedJobs = getFromCache(params);
  if (cachedJobs) {
    const filtered = filterJobs(cachedJobs, params);
    const sorted = sortJobs(filtered, params.sortBy, params.sortOrder);

    // Paginate
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const paginated = sorted.slice(start, start + limit);

    return {
      jobs: paginated,
      total: filtered.length,
      sources: [],
      fromCache: true,
    };
  }

  // Determine which fetchers to use
  const activeFetchers = params.sources
    ? JOB_FETCHERS.filter((f) => params.sources!.includes(f.name as JobSource))
    : JOB_FETCHERS;

  // Fetch from all sources in parallel
  const fetchResults = await Promise.allSettled(
    activeFetchers.map(async (fetcher) => {
      try {
        const jobs = await fetcher.fetch(params);
        return {
          source: fetcher.name as JobSource,
          jobs,
          error: undefined,
        };
      } catch (error) {
        return {
          source: fetcher.name as JobSource,
          jobs: [] as Job[],
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    })
  );

  // Collect all jobs and track source results
  const allJobs: Job[] = [];
  const sourceResults: { source: JobSource; count: number; error?: string }[] = [];

  for (const result of fetchResults) {
    if (result.status === 'fulfilled') {
      allJobs.push(...result.value.jobs);
      sourceResults.push({
        source: result.value.source,
        count: result.value.jobs.length,
        error: result.value.error,
      });
    } else {
      sourceResults.push({
        source: 'remotive' as JobSource, // Fallback
        count: 0,
        error: result.reason?.message || 'Fetch failed',
      });
    }
  }

  // Deduplicate jobs
  const uniqueJobs = deduplicateJobs(allJobs);

  // Cache the raw results
  setCache(params, uniqueJobs);

  // Apply filters
  const filtered = filterJobs(uniqueJobs, params);

  // Sort
  const sorted = sortJobs(filtered, params.sortBy, params.sortOrder);

  // Paginate
  const page = params.page || 1;
  const limit = params.limit || 20;
  const start = (page - 1) * limit;
  const paginated = sorted.slice(start, start + limit);

  return {
    jobs: paginated,
    total: filtered.length,
    sources: sourceResults,
    fromCache: false,
  };
}

// ============================================
// STATS & ANALYTICS
// ============================================

export interface JobStats {
  totalJobs: number;
  byCategory: Record<string, number>;
  byLocationType: Record<string, number>;
  bySource: Record<string, number>;
  avgSalary?: {
    min: number;
    max: number;
    count: number;
  };
  topTags: { tag: string; count: number }[];
  topLocations: { location: string; count: number }[];
}

export function calculateJobStats(jobs: Job[]): JobStats {
  const byCategory: Record<string, number> = {};
  const byLocationType: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  const tagCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};

  let salarySum = { min: 0, max: 0, count: 0 };

  for (const job of jobs) {
    // Category
    const category = job.category || 'other';
    byCategory[category] = (byCategory[category] || 0) + 1;

    // Location type
    byLocationType[job.locationType] = (byLocationType[job.locationType] || 0) + 1;

    // Source
    bySource[job.source] = (bySource[job.source] || 0) + 1;

    // Tags
    for (const tag of job.tags || []) {
      const normalizedTag = tag.toLowerCase();
      tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
    }

    // Location
    if (job.location) {
      const normalizedLocation = job.location.split(',')[0].trim();
      locationCounts[normalizedLocation] = (locationCounts[normalizedLocation] || 0) + 1;
    }

    // Salary
    if (job.salaryMin && job.salaryMax) {
      salarySum.min += job.salaryMin;
      salarySum.max += job.salaryMax;
      salarySum.count += 1;
    }
  }

  // Top tags
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tag, count]) => ({ tag, count }));

  // Top locations
  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([location, count]) => ({ location, count }));

  return {
    totalJobs: jobs.length,
    byCategory,
    byLocationType,
    bySource,
    avgSalary:
      salarySum.count > 0
        ? {
            min: Math.round(salarySum.min / salarySum.count),
            max: Math.round(salarySum.max / salarySum.count),
            count: salarySum.count,
          }
        : undefined,
    topTags,
    topLocations,
  };
}

// ============================================
// REFRESH CACHE
// ============================================

let isRefreshing = false;
let lastRefresh = 0;
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export async function refreshJobsCache(): Promise<void> {
  if (isRefreshing) return;
  if (Date.now() - lastRefresh < REFRESH_INTERVAL) return;

  isRefreshing = true;
  lastRefresh = Date.now();

  try {
    // Fetch fresh jobs with no filters (to populate cache)
    await aggregateJobs({});
  } finally {
    isRefreshing = false;
  }
}

// Export cache clear function
export function clearJobsCache(): void {
  jobCache.clear();
}

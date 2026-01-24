/**
 * Job Sources - Individual API Fetchers
 * Each function fetches jobs from a specific API and returns normalized Job objects
 */

import type { Job, JobSearchParams } from '@/types/job';
import {
  normalizeRemotiveJob,
  normalizeRemoteOKJob,
  normalizeArbeitnowJob,
  normalizeHimalayasJob,
  normalizeTheMuseJob,
  normalizeJobicyJob,
  normalizeUSAJobsJob,
  normalizeFindWorkJob,
} from './normalizers';

// ============================================
// API CONFIGURATIONS
// ============================================

const API_TIMEOUT = 10000; // 10 seconds

// Helper for fetch with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Dale-Jobs-Aggregator/1.0',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ============================================
// REMOTIVE (Free, no auth)
// https://remotive.com/api/remote-jobs
// ============================================

export async function fetchRemotiveJobs(params: JobSearchParams = {}): Promise<Job[]> {
  try {
    let url = 'https://remotive.com/api/remote-jobs';
    const queryParams: string[] = [];

    if (params.query) {
      queryParams.push(`search=${encodeURIComponent(params.query)}`);
    }

    if (params.categories?.length) {
      // Remotive uses category slug like "software-dev", "data", etc.
      queryParams.push(`category=${params.categories[0]}`);
    }

    if (params.limit) {
      queryParams.push(`limit=${params.limit}`);
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.error(`Remotive API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.jobs || []).map(normalizeRemotiveJob);
  } catch (error) {
    console.error('Error fetching Remotive jobs:', error);
    return [];
  }
}

// ============================================
// REMOTEOK (Free, no auth)
// https://remoteok.com/api
// ============================================

export async function fetchRemoteOKJobs(params: JobSearchParams = {}): Promise<Job[]> {
  try {
    let url = 'https://remoteok.com/api';

    // RemoteOK uses tags in the URL
    if (params.query) {
      const tag = params.query.toLowerCase().replace(/\s+/g, '-');
      url += `?tag=${encodeURIComponent(tag)}`;
    }

    const response = await fetchWithTimeout(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`RemoteOK API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    // RemoteOK returns an array where first item is a legal notice
    const jobs = Array.isArray(data) ? data.slice(1) : [];

    return jobs
      .filter((job: unknown) => job && typeof job === 'object' && 'id' in job)
      .map(normalizeRemoteOKJob);
  } catch (error) {
    console.error('Error fetching RemoteOK jobs:', error);
    return [];
  }
}

// ============================================
// ARBEITNOW (Free, no auth)
// https://www.arbeitnow.com/api/job-board-api
// ============================================

export async function fetchArbeitnowJobs(params: JobSearchParams = {}): Promise<Job[]> {
  try {
    let url = 'https://www.arbeitnow.com/api/job-board-api';
    const queryParams: string[] = [];

    if (params.page) {
      queryParams.push(`page=${params.page}`);
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.error(`Arbeitnow API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.data || []).map(normalizeArbeitnowJob);
  } catch (error) {
    console.error('Error fetching Arbeitnow jobs:', error);
    return [];
  }
}

// ============================================
// HIMALAYAS (Free, no auth)
// https://himalayas.app/jobs/api
// ============================================

export async function fetchHimalayasJobs(params: JobSearchParams = {}): Promise<Job[]> {
  try {
    let url = 'https://himalayas.app/jobs/api';
    const queryParams: string[] = [];

    if (params.limit) {
      queryParams.push(`limit=${params.limit}`);
    }

    if (params.page) {
      queryParams.push(`offset=${((params.page - 1) * (params.limit || 50))}`);
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.error(`Himalayas API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.jobs || []).map(normalizeHimalayasJob);
  } catch (error) {
    console.error('Error fetching Himalayas jobs:', error);
    return [];
  }
}

// ============================================
// THE MUSE (Free public API)
// https://www.themuse.com/developers/api/v2
// ============================================

export async function fetchTheMuseJobs(params: JobSearchParams = {}): Promise<Job[]> {
  try {
    let url = 'https://www.themuse.com/api/public/jobs';
    const queryParams: string[] = [];

    // Use api_key if available, otherwise public access
    queryParams.push('api_key=');

    if (params.page) {
      queryParams.push(`page=${params.page - 1}`); // The Muse uses 0-indexed pages
    }

    if (params.query) {
      queryParams.push(`keyword=${encodeURIComponent(params.query)}`);
    }

    if (params.locations?.length) {
      params.locations.forEach((loc) => {
        queryParams.push(`location=${encodeURIComponent(loc)}`);
      });
    }

    if (params.categories?.length) {
      params.categories.forEach((cat) => {
        queryParams.push(`category=${encodeURIComponent(cat)}`);
      });
    }

    if (params.experienceLevel?.length) {
      params.experienceLevel.forEach((level) => {
        const museLevel = level === 'entry' ? 'Entry Level' :
          level === 'mid' ? 'Mid Level' :
          level === 'senior' ? 'Senior Level' :
          level === 'executive' ? 'Management' : level;
        queryParams.push(`level=${encodeURIComponent(museLevel)}`);
      });
    }

    url += `?${queryParams.join('&')}`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.error(`The Muse API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.results || []).map(normalizeTheMuseJob);
  } catch (error) {
    console.error('Error fetching The Muse jobs:', error);
    return [];
  }
}

// ============================================
// JOBICY (Free, no auth)
// https://jobicy.com/api/v2/remote-jobs
// ============================================

export async function fetchJobicyJobs(params: JobSearchParams = {}): Promise<Job[]> {
  try {
    let url = 'https://jobicy.com/api/v2/remote-jobs';
    const queryParams: string[] = [];

    if (params.limit) {
      queryParams.push(`count=${Math.min(params.limit, 50)}`); // Max 50
    } else {
      queryParams.push('count=50');
    }

    // Jobicy uses specific category slugs
    if (params.categories?.length) {
      const categoryMap: Record<string, string> = {
        'software-dev': 'dev',
        'engineering': 'dev',
        'data': 'data',
        'design': 'design',
        'marketing': 'marketing',
        'sales': 'sales',
        'customer-support': 'customer-service',
        'hr': 'hr',
        'finance': 'finance',
        'writing': 'copywriting',
      };
      const cat = categoryMap[params.categories[0]] || params.categories[0];
      queryParams.push(`industry=${cat}`);
    }

    // Location (geo)
    if (params.locations?.length) {
      queryParams.push(`geo=${encodeURIComponent(params.locations[0])}`);
    }

    url += `?${queryParams.join('&')}`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.error(`Jobicy API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.jobs || []).map(normalizeJobicyJob);
  } catch (error) {
    console.error('Error fetching Jobicy jobs:', error);
    return [];
  }
}

// ============================================
// USAJOBS (Free, requires API key - using public access)
// https://developer.usajobs.gov/
// ============================================

export async function fetchUSAJobsJobs(params: JobSearchParams = {}): Promise<Job[]> {
  try {
    // USAJobs requires registration for API key
    // Using public search page as fallback
    let url = 'https://data.usajobs.gov/api/search';
    const queryParams: string[] = [];

    if (params.query) {
      queryParams.push(`Keyword=${encodeURIComponent(params.query)}`);
    }

    if (params.locations?.length) {
      queryParams.push(`LocationName=${encodeURIComponent(params.locations[0])}`);
    }

    // Remote filter
    if (params.locationType?.includes('remote')) {
      queryParams.push('RemoteIndicator=true');
    }

    if (params.page) {
      queryParams.push(`Page=${params.page}`);
    }

    queryParams.push('ResultsPerPage=50');

    url += `?${queryParams.join('&')}`;

    // USAJobs requires specific headers
    const response = await fetchWithTimeout(url, {
      headers: {
        'Host': 'data.usajobs.gov',
        'User-Agent': process.env.USAJOBS_EMAIL || 'dale@example.com',
        'Authorization-Key': process.env.USAJOBS_API_KEY || '',
      },
    });

    if (!response.ok) {
      // USAJobs API requires registration - skip silently
      return [];
    }

    const data = await response.json();
    return (data.SearchResult?.SearchResultItems || []).map(normalizeUSAJobsJob);
  } catch (error) {
    // USAJobs often fails without proper API key - this is expected
    return [];
  }
}

// ============================================
// FINDWORK.DEV (Free, limited)
// https://findwork.dev/developers/
// ============================================

export async function fetchFindWorkJobs(params: JobSearchParams = {}): Promise<Job[]> {
  try {
    let url = 'https://findwork.dev/api/jobs/';
    const queryParams: string[] = [];

    if (params.query) {
      queryParams.push(`search=${encodeURIComponent(params.query)}`);
    }

    if (params.locations?.length) {
      queryParams.push(`location=${encodeURIComponent(params.locations[0])}`);
    }

    if (params.locationType?.includes('remote')) {
      queryParams.push('remote=true');
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const response = await fetchWithTimeout(url, {
      headers: {
        'Authorization': `Token ${process.env.FINDWORK_API_KEY || ''}`,
      },
    });

    if (!response.ok) {
      // FindWork requires API key
      return [];
    }

    const data = await response.json();
    return (data.results || []).map(normalizeFindWorkJob);
  } catch (error) {
    return [];
  }
}

// ============================================
// EXPORT ALL FETCHERS
// ============================================

export interface JobFetcher {
  name: string;
  fetch: (params: JobSearchParams) => Promise<Job[]>;
  priority: number; // Lower = higher priority
  rateLimit?: number; // Minimum ms between requests
}

export const JOB_FETCHERS: JobFetcher[] = [
  {
    name: 'remotive',
    fetch: fetchRemotiveJobs,
    priority: 1,
    rateLimit: 1000,
  },
  {
    name: 'remoteok',
    fetch: fetchRemoteOKJobs,
    priority: 2,
    rateLimit: 2000,
  },
  {
    name: 'himalayas',
    fetch: fetchHimalayasJobs,
    priority: 3,
    rateLimit: 1000,
  },
  {
    name: 'themuse',
    fetch: fetchTheMuseJobs,
    priority: 4,
    rateLimit: 500,
  },
  {
    name: 'jobicy',
    fetch: fetchJobicyJobs,
    priority: 5,
    rateLimit: 1000,
  },
  {
    name: 'arbeitnow',
    fetch: fetchArbeitnowJobs,
    priority: 6,
    rateLimit: 1000,
  },
  {
    name: 'usajobs',
    fetch: fetchUSAJobsJobs,
    priority: 7,
    rateLimit: 500,
  },
  {
    name: 'findwork',
    fetch: fetchFindWorkJobs,
    priority: 8,
    rateLimit: 1000,
  },
];

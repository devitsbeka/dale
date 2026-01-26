/**
 * useJobs Hook
 * Manages job search, filtering, and pagination state
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Job, JobFilters, JobSearchParams } from '@/types/job';

interface UseJobsState {
  jobs: Job[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: JobFilters;
  fromCache: boolean;
  stats: {
    totalJobs: number;
    byLocationType: Record<string, number>;
    avgSalary?: {
      min: number;
      max: number;
      count: number;
    };
  } | null;
  filterOptions: {
    availableCategories: { value: string; label: string; count: number }[];
    availableLocations: { value: string; label: string; count: number }[];
    availableTags: { value: string; label: string; count: number }[];
  };
}

interface UseJobsActions {
  fetchJobs: (params?: JobSearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
  setFilters: (filters: Partial<JobFilters>) => void;
  clearFilters: () => void;
  search: (query: string) => void;
  refresh: () => Promise<void>;
}

interface UseJobsReturn extends UseJobsState, UseJobsActions {}

const DEFAULT_FILTERS: JobFilters = {
  query: '',
  locations: [],
  locationType: [],
  categories: [],
  experienceLevel: [],
  employmentType: [],
  sources: [],
  postedWithin: 'any',
  sortBy: 'date',
  sortOrder: 'desc',
};

export function useJobs(initialFilters?: Partial<JobFilters>): UseJobsReturn {
  // Load cached stats from localStorage
  const getCachedStats = () => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem('jobs_stats_cache');
      if (cached) {
        const { stats, timestamp } = JSON.parse(cached);
        // Return cached stats if less than 5 minutes old
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          return stats;
        }
      }
    } catch (error) {
      console.error('Failed to load cached stats:', error);
    }
    return null;
  };

  const getCachedPagination = () => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem('jobs_pagination_cache');
      if (cached) {
        const { pagination, timestamp } = JSON.parse(cached);
        // Return cached pagination if less than 5 minutes old
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          return pagination;
        }
      }
    } catch (error) {
      console.error('Failed to load cached pagination:', error);
    }
    return null;
  };

  const cachedStats = getCachedStats();
  const cachedPagination = getCachedPagination();

  const [state, setState] = useState<UseJobsState>({
    jobs: [],
    isLoading: !cachedStats, // Don't show loading if we have cache
    isLoadingMore: false,
    error: null,
    pagination: cachedPagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
    filters: { ...DEFAULT_FILTERS, ...initialFilters },
    fromCache: !!cachedStats,
    stats: cachedStats,
    filterOptions: {
      availableCategories: [],
      availableLocations: [],
      availableTags: [],
    },
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const buildQueryString = useCallback((params: JobSearchParams): string => {
    const queryParams = new URLSearchParams();

    if (params.query) queryParams.set('q', params.query);
    if (params.page) queryParams.set('page', String(params.page));
    if (params.limit) queryParams.set('limit', String(params.limit));
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);
    if (params.postedWithin) queryParams.set('postedWithin', params.postedWithin);

    if (params.locations?.length) {
      queryParams.set('locations', params.locations.join(','));
    }
    if (params.categories?.length) {
      queryParams.set('categories', params.categories.join(','));
    }
    if (params.locationType?.length) {
      queryParams.set('locationType', params.locationType.join(','));
    }
    if (params.experienceLevel?.length) {
      queryParams.set('experienceLevel', params.experienceLevel.join(','));
    }
    if (params.employmentType?.length) {
      queryParams.set('employmentType', params.employmentType.join(','));
    }
    if (params.sources?.length) {
      queryParams.set('sources', params.sources.join(','));
    }
    if (params.salaryMin) {
      queryParams.set('salaryMin', String(params.salaryMin));
    }
    if (params.salaryMax) {
      queryParams.set('salaryMax', String(params.salaryMax));
    }

    return queryParams.toString();
  }, []);

  const fetchJobs = useCallback(
    async (params?: JobSearchParams) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const searchParams: JobSearchParams = {
        ...state.filters,
        page: 1,
        limit: state.pagination.limit,
        ...params,
      };

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const queryString = buildQueryString(searchParams);
        const response = await fetch(`/api/jobs?${queryString}`, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();

        // Cache stats and pagination in localStorage
        if (data.stats) {
          try {
            localStorage.setItem(
              'jobs_stats_cache',
              JSON.stringify({
                stats: data.stats,
                timestamp: Date.now(),
              })
            );
          } catch (error) {
            console.error('Failed to cache stats:', error);
          }
        }

        if (data.pagination) {
          try {
            localStorage.setItem(
              'jobs_pagination_cache',
              JSON.stringify({
                pagination: data.pagination,
                timestamp: Date.now(),
              })
            );
          } catch (error) {
            console.error('Failed to cache pagination:', error);
          }
        }

        setState((prev) => ({
          ...prev,
          jobs: data.jobs || [],
          isLoading: false,
          pagination: data.pagination,
          fromCache: data.fromCache,
          stats: data.stats,
          filterOptions: data.filters || prev.filterOptions,
          filters: searchParams,
        }));
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return; // Ignore abort errors
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        }));
      }
    },
    [state.filters, state.pagination.limit, buildQueryString]
  );

  const loadMore = useCallback(async () => {
    if (state.isLoadingMore || state.pagination.page >= state.pagination.totalPages) {
      return;
    }

    setState((prev) => ({ ...prev, isLoadingMore: true }));

    try {
      const nextPage = state.pagination.page + 1;
      const queryString = buildQueryString({
        ...state.filters,
        page: nextPage,
        limit: state.pagination.limit,
      });

      const response = await fetch(`/api/jobs?${queryString}`);

      if (!response.ok) {
        throw new Error('Failed to load more jobs');
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        jobs: [...prev.jobs, ...(data.jobs || [])],
        isLoadingMore: false,
        pagination: {
          ...data.pagination,
          page: nextPage,
        },
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoadingMore: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, [state, buildQueryString]);

  const setFilters = useCallback((newFilters: Partial<JobFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: DEFAULT_FILTERS,
    }));
  }, []);

  const search = useCallback(
    (query: string) => {
      fetchJobs({ query, page: 1 });
    },
    [fetchJobs]
  );

  const refresh = useCallback(() => {
    return fetchJobs({ ...state.filters, page: 1 });
  }, [fetchJobs, state.filters]);

  // Initial fetch
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    fetchJobs,
    loadMore,
    setFilters,
    clearFilters,
    search,
    refresh,
  };
}

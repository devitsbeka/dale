/**
 * useJobApplications Hook
 * Manages job applications state and actions
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  Job,
  JobApplicationWithRelations,
  ApplicationStatus,
  ApplyFormData,
  UpdateApplicationData,
} from '@/types/job';

interface ApplicationStats {
  total: number;
  byStatus: Record<string, number>;
  responseRate: number;
}

interface UseJobApplicationsState {
  applications: JobApplicationWithRelations[];
  appliedJobIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  stats: ApplicationStats | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseJobApplicationsActions {
  fetchApplications: (status?: ApplicationStatus) => Promise<void>;
  applyToJob: (
    job: Job,
    data: ApplyFormData
  ) => Promise<{ success: boolean; application?: JobApplicationWithRelations; error?: string }>;
  updateApplication: (
    applicationId: string,
    data: UpdateApplicationData
  ) => Promise<boolean>;
  withdrawApplication: (applicationId: string) => Promise<boolean>;
  hasApplied: (jobId: string) => boolean;
  getApplicationForJob: (jobId: string) => JobApplicationWithRelations | undefined;
}

interface UseJobApplicationsReturn
  extends UseJobApplicationsState,
    UseJobApplicationsActions {}

export function useJobApplications(): UseJobApplicationsReturn {
  // Load cached stats from localStorage
  const getCachedStats = () => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem('applications_stats_cache');
      if (cached) {
        const { stats, timestamp } = JSON.parse(cached);
        // Return cached stats if less than 2 minutes old
        if (Date.now() - timestamp < 2 * 60 * 1000) {
          return stats;
        }
      }
    } catch (error) {
      console.error('Failed to load cached applications stats:', error);
    }
    return null;
  };

  const cachedStats = getCachedStats();

  const [state, setState] = useState<UseJobApplicationsState>({
    applications: [],
    appliedJobIds: new Set(),
    isLoading: !cachedStats, // Don't show loading if we have cache
    error: null,
    stats: cachedStats,
    pagination: {
      page: 1,
      limit: 50,
      total: cachedStats?.total || 0,
      totalPages: cachedStats ? Math.ceil(cachedStats.total / 50) : 0,
    },
  });

  const fetchApplications = useCallback(
    async (status?: ApplicationStatus) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        let url = '/api/jobs/applications?limit=100';
        if (status) {
          url += `&status=${status}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        const applications = data.applications || [];

        // Cache the stats
        if (data.stats) {
          try {
            localStorage.setItem(
              'applications_stats_cache',
              JSON.stringify({
                stats: data.stats,
                timestamp: Date.now(),
              })
            );
          } catch (error) {
            console.error('Failed to cache applications stats:', error);
          }
        }

        setState((prev) => ({
          ...prev,
          applications,
          appliedJobIds: new Set(
            applications.map((a: JobApplicationWithRelations) => a.jobId)
          ),
          isLoading: false,
          stats: data.stats,
          pagination: data.pagination,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        }));
      }
    },
    []
  );

  const applyToJob = useCallback(
    async (
      job: Job,
      data: ApplyFormData
    ): Promise<{
      success: boolean;
      application?: JobApplicationWithRelations;
      error?: string;
    }> => {
      try {
        const response = await fetch('/api/jobs/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: job.id,
            jobData: job,
            resumeId: data.resumeId,
            coverLetter: data.coverLetter,
            appliedVia: data.appliedVia || 'direct',
            notes: data.notes,
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: responseData.error || 'Failed to submit application',
          };
        }

        const newApplication = responseData.application;

        setState((prev) => {
          const newApplications = [newApplication, ...prev.applications];
          return {
            ...prev,
            applications: newApplications,
            appliedJobIds: new Set(newApplications.map((a) => a.jobId)),
            stats: prev.stats
              ? {
                  ...prev.stats,
                  total: prev.stats.total + 1,
                  byStatus: {
                    ...prev.stats.byStatus,
                    applied: (prev.stats.byStatus.applied || 0) + 1,
                  },
                }
              : null,
          };
        });

        return { success: true, application: newApplication };
      } catch (error) {
        console.error('Error applying to job:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        };
      }
    },
    []
  );

  const updateApplication = useCallback(
    async (applicationId: string, data: UpdateApplicationData): Promise<boolean> => {
      try {
        const response = await fetch('/api/jobs/applications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicationId,
            ...data,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update application');
        }

        const responseData = await response.json();
        const updatedApplication = responseData.application;

        setState((prev) => ({
          ...prev,
          applications: prev.applications.map((a) =>
            a.id === applicationId ? updatedApplication : a
          ),
        }));

        return true;
      } catch (error) {
        console.error('Error updating application:', error);
        return false;
      }
    },
    []
  );

  const withdrawApplication = useCallback(
    async (applicationId: string): Promise<boolean> => {
      try {
        const response = await fetch(
          `/api/jobs/applications?applicationId=${applicationId}`,
          {
            method: 'DELETE',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to withdraw application');
        }

        setState((prev) => ({
          ...prev,
          applications: prev.applications.map((a) =>
            a.id === applicationId ? { ...a, status: 'withdrawn' as const } : a
          ),
        }));

        return true;
      } catch (error) {
        console.error('Error withdrawing application:', error);
        return false;
      }
    },
    []
  );

  const hasApplied = useCallback(
    (jobId: string): boolean => {
      return state.appliedJobIds.has(jobId);
    },
    [state.appliedJobIds]
  );

  const getApplicationForJob = useCallback(
    (jobId: string): JobApplicationWithRelations | undefined => {
      return state.applications.find((a) => a.jobId === jobId);
    },
    [state.applications]
  );

  // Initial fetch
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    ...state,
    fetchApplications,
    applyToJob,
    updateApplication,
    withdrawApplication,
    hasApplied,
    getApplicationForJob,
  };
}

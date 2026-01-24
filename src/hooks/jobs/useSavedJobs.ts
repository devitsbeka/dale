/**
 * useSavedJobs Hook
 * Manages saved/bookmarked jobs state and actions
 */

import { useState, useCallback, useEffect } from 'react';
import type { Job, SavedJobWithJob } from '@/types/job';

interface UseSavedJobsState {
  savedJobs: SavedJobWithJob[];
  savedJobIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseSavedJobsActions {
  fetchSavedJobs: () => Promise<void>;
  saveJob: (job: Job, notes?: string, priority?: number) => Promise<boolean>;
  unsaveJob: (jobId: string) => Promise<boolean>;
  toggleSave: (job: Job) => Promise<boolean>;
  updateSavedJob: (
    jobId: string,
    data: { notes?: string; priority?: number }
  ) => Promise<boolean>;
  isJobSaved: (jobId: string) => boolean;
}

interface UseSavedJobsReturn extends UseSavedJobsState, UseSavedJobsActions {}

export function useSavedJobs(): UseSavedJobsReturn {
  const [state, setState] = useState<UseSavedJobsState>({
    savedJobs: [],
    savedJobIds: new Set(),
    isLoading: true,
    error: null,
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
      totalPages: 0,
    },
  });

  const fetchSavedJobs = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/jobs/saved?limit=100');

      if (!response.ok) {
        throw new Error('Failed to fetch saved jobs');
      }

      const data = await response.json();
      const savedJobs = data.savedJobs || [];

      setState((prev) => ({
        ...prev,
        savedJobs,
        savedJobIds: new Set(savedJobs.map((s: SavedJobWithJob) => s.jobId)),
        isLoading: false,
        pagination: data.pagination,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, []);

  const saveJob = useCallback(
    async (job: Job, notes?: string, priority: number = 0): Promise<boolean> => {
      try {
        const response = await fetch('/api/jobs/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: job.id,
            jobData: job,
            notes,
            priority,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save job');
        }

        const data = await response.json();

        setState((prev) => {
          const newSavedJobs = [
            { ...data.savedJob, job },
            ...prev.savedJobs.filter((s) => s.jobId !== job.id),
          ];

          return {
            ...prev,
            savedJobs: newSavedJobs,
            savedJobIds: new Set(newSavedJobs.map((s) => s.jobId)),
          };
        });

        return true;
      } catch (error) {
        console.error('Error saving job:', error);
        return false;
      }
    },
    []
  );

  const unsaveJob = useCallback(async (jobId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/jobs/saved?jobId=${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to unsave job');
      }

      setState((prev) => {
        const newSavedJobs = prev.savedJobs.filter((s) => s.jobId !== jobId);

        return {
          ...prev,
          savedJobs: newSavedJobs,
          savedJobIds: new Set(newSavedJobs.map((s) => s.jobId)),
        };
      });

      return true;
    } catch (error) {
      console.error('Error unsaving job:', error);
      return false;
    }
  }, []);

  const toggleSave = useCallback(
    async (job: Job): Promise<boolean> => {
      const isSaved = state.savedJobIds.has(job.id);

      if (isSaved) {
        return unsaveJob(job.id);
      } else {
        return saveJob(job);
      }
    },
    [state.savedJobIds, saveJob, unsaveJob]
  );

  const updateSavedJob = useCallback(
    async (
      jobId: string,
      data: { notes?: string; priority?: number }
    ): Promise<boolean> => {
      try {
        const savedJob = state.savedJobs.find((s) => s.jobId === jobId);
        if (!savedJob) return false;

        const response = await fetch('/api/jobs/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId,
            notes: data.notes ?? savedJob.notes,
            priority: data.priority ?? savedJob.priority,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update saved job');
        }

        setState((prev) => ({
          ...prev,
          savedJobs: prev.savedJobs.map((s) =>
            s.jobId === jobId ? { ...s, ...data } : s
          ),
        }));

        return true;
      } catch (error) {
        console.error('Error updating saved job:', error);
        return false;
      }
    },
    [state.savedJobs]
  );

  const isJobSaved = useCallback(
    (jobId: string): boolean => {
      return state.savedJobIds.has(jobId);
    },
    [state.savedJobIds]
  );

  // Initial fetch
  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  return {
    ...state,
    fetchSavedJobs,
    saveJob,
    unsaveJob,
    toggleSave,
    updateSavedJob,
    isJobSaved,
  };
}

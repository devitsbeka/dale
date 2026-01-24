'use client';

/**
 * Jobs Context
 * Provides job search, saved jobs, and applications state throughout the app
 */

import React, { createContext, useContext, useMemo, ReactNode, useState } from 'react';
import { useJobs, useSavedJobs, useJobApplications } from '@/hooks/jobs';
import type { Job } from '@/types/job';

// Context value type
interface JobsContextValue {
  // Jobs search
  jobs: ReturnType<typeof useJobs>;

  // Saved jobs
  savedJobs: ReturnType<typeof useSavedJobs>;

  // Applications
  applications: ReturnType<typeof useJobApplications>;

  // UI state
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (open: boolean) => void;
  jobToApply: Job | null;
  setJobToApply: (job: Job | null) => void;

  // Combined helpers
  isJobSavedOrApplied: (jobId: string) => { saved: boolean; applied: boolean };
}

const JobsContext = createContext<JobsContextValue | null>(null);

interface JobsProviderProps {
  children: ReactNode;
}

export function JobsProvider({ children }: JobsProviderProps) {
  // Core hooks
  const jobs = useJobs();
  const savedJobs = useSavedJobs();
  const applications = useJobApplications();

  // UI state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);

  // Combined helper
  const isJobSavedOrApplied = useMemo(
    () => (jobId: string) => ({
      saved: savedJobs.isJobSaved(jobId),
      applied: applications.hasApplied(jobId),
    }),
    [savedJobs, applications]
  );

  const value = useMemo(
    () => ({
      jobs,
      savedJobs,
      applications,
      selectedJob,
      setSelectedJob,
      isApplyModalOpen,
      setIsApplyModalOpen,
      jobToApply,
      setJobToApply,
      isJobSavedOrApplied,
    }),
    [
      jobs,
      savedJobs,
      applications,
      selectedJob,
      isApplyModalOpen,
      jobToApply,
      isJobSavedOrApplied,
    ]
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobsContext() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobsContext must be used within a JobsProvider');
  }
  return context;
}

// Export individual selectors for optimization
export function useJobSearch() {
  const { jobs } = useJobsContext();
  return jobs;
}

export function useJobSaved() {
  const { savedJobs } = useJobsContext();
  return savedJobs;
}

export function useJobApps() {
  const { applications } = useJobsContext();
  return applications;
}

export function useSelectedJob() {
  const { selectedJob, setSelectedJob } = useJobsContext();
  return { selectedJob, setSelectedJob };
}

export function useApplyModal() {
  const { isApplyModalOpen, setIsApplyModalOpen, jobToApply, setJobToApply } =
    useJobsContext();
  return { isApplyModalOpen, setIsApplyModalOpen, jobToApply, setJobToApply };
}

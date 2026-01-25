/**
 * TypeScript types for job synchronization system
 */

export interface SyncResult {
  source: string;
  success: boolean;
  jobsCreated: number;
  jobsUpdated: number;
  jobsSkipped: number;
  errors: string[];
  duration: number;
}

export interface SyncProgress {
  syncLogId: string;
  sourcesTotal: number;
  sourcesCompleted: number;
  sourcesSkipped: number;
  jobsCreated: number;
  jobsUpdated: number;
  errors: string[];
}

export interface SourceSyncOptions {
  source: string;
  incremental?: boolean;
  sinceDays?: number;
  batchSize?: number;
  maxJobs?: number;
}

export interface JobFingerprint {
  title: string;
  company: string;
  hash: string;
}

export interface DeduplicationResult {
  isDuplicate: boolean;
  existingJobId?: string;
  qualityScore: number;
}

export type SyncType = 'daily' | 'hourly' | 'manual';
export type SyncStatus = 'pending' | 'running' | 'completed' | 'failed';

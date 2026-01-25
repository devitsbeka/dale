/**
 * Apify Job Loader Service
 * Orchestrates actor runs, progress tracking, and job syncing
 */

import { PrismaClient } from '@prisma/client';
import { apifyClient } from './client';
import { APIFY_ACTORS, ApifyJobLoadStatus } from './types';
import {
  normalizeLinkedInJob,
  normalizeGreenhouseJob,
  normalizeIndeedJob,
} from './normalizers';
import { BatchProcessor } from '../jobs/sync';
import type { Job } from '@/types/job';

const prisma = new PrismaClient();

// In-memory progress tracking
const loadStatuses = new Map<string, ApifyJobLoadStatus>();

export class ApifyJobLoader {
  /**
   * Start loading jobs from all configured actors
   */
  async startAllLoads(): Promise<string[]> {
    const runIds: string[] = [];

    for (const actor of APIFY_ACTORS) {
      const runId = await this.startLoad(actor.actorId, actor.input);
      runIds.push(runId);
    }

    return runIds;
  }

  /**
   * Start loading jobs from a specific actor
   */
  async startLoad(actorId: string, input: Record<string, any>): Promise<string> {
    const actor = APIFY_ACTORS.find((a) => a.actorId === actorId);
    if (!actor) {
      throw new Error(`Unknown actor: ${actorId}`);
    }

    // Start the actor run
    const run = await apifyClient.startActor(actorId, input);

    // Initialize status tracking
    const status: ApifyJobLoadStatus = {
      runId: run.id,
      actorName: actor.name,
      status: 'running',
      progress: 0,
      jobsFetched: 0,
      jobsSynced: 0,
      errors: [],
      startedAt: new Date(),
      estimatedCost: actor.estimatedCost,
    };

    loadStatuses.set(run.id, status);

    // Process in background
    this.processLoad(run.id, actorId).catch((error) => {
      console.error(`Error processing load ${run.id}:`, error);
      const status = loadStatuses.get(run.id);
      if (status) {
        status.status = 'failed';
        status.errors.push(error.message);
      }
    });

    return run.id;
  }

  /**
   * Process an actor run (background)
   */
  private async processLoad(runId: string, actorId: string): Promise<void> {
    const status = loadStatuses.get(runId);
    if (!status) return;

    try {
      // Wait for actor to complete
      status.progress = 30;
      const completedRun = await apifyClient.waitForRun(actorId, runId, {
        maxWaitTime: 600000, // 10 minutes
        checkInterval: 10000, // 10 seconds
      });

      if (completedRun.status !== 'SUCCEEDED') {
        throw new Error(`Actor run failed: ${completedRun.status}`);
      }

      // Fetch results
      status.status = 'processing';
      status.progress = 50;
      const items = await apifyClient.getAllDatasetItems(
        completedRun.defaultDatasetId
      );

      status.jobsFetched = items.length;
      status.progress = 70;

      // Normalize jobs
      const jobs = this.normalizeJobs(actorId, items);
      status.progress = 80;

      // Sync to database
      const batchProcessor = new BatchProcessor(prisma);
      const { created, updated } = await batchProcessor.batchUpsert(jobs);

      status.jobsSynced = created + updated;
      status.progress = 100;
      status.status = 'completed';
      status.completedAt = new Date();

      console.log(
        `✅ ${status.actorName}: Synced ${status.jobsSynced} jobs (${created} new, ${updated} updated)`
      );
    } catch (error) {
      console.error(`❌ ${status.actorName} failed:`, error);
      status.status = 'failed';
      status.errors.push(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      await prisma.$disconnect();
    }
  }

  /**
   * Normalize jobs based on actor type
   */
  private normalizeJobs(actorId: string, items: any[]): Job[] {
    const jobs: Job[] = [];

    for (const item of items) {
      let job: Job | null = null;

      if (actorId.includes('linkedin')) {
        job = normalizeLinkedInJob(item);
      } else if (actorId.includes('greenhouse')) {
        job = normalizeGreenhouseJob(item);
      } else if (actorId.includes('indeed')) {
        job = normalizeIndeedJob(item);
      }

      if (job) {
        jobs.push(job);
      }
    }

    return jobs;
  }

  /**
   * Get status of a specific load
   */
  getLoadStatus(runId: string): ApifyJobLoadStatus | null {
    return loadStatuses.get(runId) || null;
  }

  /**
   * Get all load statuses
   */
  getAllLoadStatuses(): ApifyJobLoadStatus[] {
    return Array.from(loadStatuses.values());
  }

  /**
   * Clear old statuses (older than 1 hour)
   */
  clearOldStatuses(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    for (const [runId, status] of loadStatuses.entries()) {
      if (status.startedAt < oneHourAgo && status.status !== 'running') {
        loadStatuses.delete(runId);
      }
    }
  }

  /**
   * Get total jobs synced across all loads
   */
  getTotalJobsSynced(): number {
    return Array.from(loadStatuses.values()).reduce(
      (sum, status) => sum + status.jobsSynced,
      0
    );
  }
}

export const apifyJobLoader = new ApifyJobLoader();

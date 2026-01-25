/**
 * Source Processor - Main sync orchestrator for individual job sources
 */

import { PrismaClient } from '@prisma/client';
import { JOB_FETCHERS } from '../sources';
import { BatchProcessor } from './batch-processor';
import { deduplicateJobs, calculateQualityScore } from './deduplicator';
import type { SyncResult, SourceSyncOptions } from './types';
import type { Job } from '@/types/job';

const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_MAX_JOBS = 1000;

export class SourceProcessor {
  private prisma: PrismaClient;
  private batchProcessor: BatchProcessor;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.batchProcessor = new BatchProcessor(prisma);
  }

  /**
   * Sync jobs from a single source
   */
  async syncSource(options: SourceSyncOptions): Promise<SyncResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let jobsCreated = 0;
    let jobsUpdated = 0;
    let jobsSkipped = 0;

    try {
      const fetcher = JOB_FETCHERS.find(f => f.name === options.source);
      if (!fetcher) {
        throw new Error(`Unknown job source: ${options.source}`);
      }

      console.log(`[${options.source}] Starting sync...`);

      // Respect rate limits
      if (fetcher.rateLimit) {
        await this.sleep(fetcher.rateLimit);
      }

      // Fetch jobs with pagination
      const jobs = await this.fetchPaginated(fetcher, options);

      console.log(`[${options.source}] Fetched ${jobs.length} jobs`);

      if (jobs.length === 0) {
        return {
          source: options.source,
          success: true,
          jobsCreated: 0,
          jobsUpdated: 0,
          jobsSkipped: 0,
          errors: [],
          duration: Date.now() - startTime,
        };
      }

      // Deduplicate jobs
      const uniqueJobs = deduplicateJobs(jobs);
      jobsSkipped = jobs.length - uniqueJobs.length;

      console.log(`[${options.source}] Deduplicating: ${jobs.length} -> ${uniqueJobs.length} unique jobs`);

      // Batch upsert to database
      const { created, updated } = await this.batchProcessor.batchUpsert(uniqueJobs);
      jobsCreated = created;
      jobsUpdated = updated;

      console.log(`[${options.source}] Sync complete: ${created} created, ${updated} updated`);

      return {
        source: options.source,
        success: true,
        jobsCreated,
        jobsUpdated,
        jobsSkipped,
        errors,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMessage);
      console.error(`[${options.source}] Sync failed:`, errorMessage);

      return {
        source: options.source,
        success: false,
        jobsCreated,
        jobsUpdated,
        jobsSkipped,
        errors,
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Fetch jobs with pagination support
   */
  private async fetchPaginated(
    fetcher: typeof JOB_FETCHERS[0],
    options: SourceSyncOptions
  ): Promise<Job[]> {
    const allJobs: Job[] = [];
    const maxJobs = options.maxJobs || DEFAULT_MAX_JOBS;
    let page = 1;
    let retryCount = 0;
    const maxRetries = 2;

    while (allJobs.length < maxJobs) {
      try {
        const params: any = {
          page,
          limit: Math.min(100, maxJobs - allJobs.length),
        };

        // For incremental sync, only fetch recent jobs
        if (options.incremental && options.sinceDays) {
          // This will be implemented per-source if they support date filtering
          // For now, we'll fetch and filter after
        }

        const jobs = await fetcher.fetch(params);

        if (jobs.length === 0) {
          // No more jobs available
          break;
        }

        // Filter by date if incremental
        let filteredJobs = jobs;
        if (options.incremental && options.sinceDays) {
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - options.sinceDays);

          filteredJobs = jobs.filter(job => {
            if (!job.publishedAt) return true; // Include if no date
            return new Date(job.publishedAt) >= cutoffDate;
          });
        }

        allJobs.push(...filteredJobs);

        // If we got fewer jobs than requested, we've reached the end
        if (jobs.length < params.limit) {
          break;
        }

        // If incremental and we're getting old jobs, stop pagination
        if (options.incremental && filteredJobs.length === 0) {
          console.log(`[${fetcher.name}] Reached jobs older than ${options.sinceDays} days, stopping pagination`);
          break;
        }

        page++;
        retryCount = 0; // Reset retry count on success

        // Rate limiting between pages
        if (fetcher.rateLimit) {
          await this.sleep(fetcher.rateLimit);
        }
      } catch (error) {
        retryCount++;
        console.error(`[${fetcher.name}] Error fetching page ${page} (attempt ${retryCount}/${maxRetries}):`, error);

        if (retryCount >= maxRetries) {
          console.error(`[${fetcher.name}] Max retries reached, stopping pagination`);
          break;
        }

        // Exponential backoff
        await this.sleep(1000 * Math.pow(2, retryCount));
      }
    }

    return allJobs;
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Sync all sources
   */
  async syncAllSources(incremental: boolean = false): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const fetcher of JOB_FETCHERS) {
      const result = await this.syncSource({
        source: fetcher.name,
        incremental,
        sinceDays: incremental ? 2 : undefined,
        maxJobs: incremental ? 100 : 1000,
      });

      results.push(result);
    }

    return results;
  }

  /**
   * Sync top priority sources only (for hourly sync)
   */
  async syncTopSources(): Promise<SyncResult[]> {
    const topSources = ['remotive', 'remoteok', 'himalayas'];
    const results: SyncResult[] = [];

    for (const sourceName of topSources) {
      const result = await this.syncSource({
        source: sourceName,
        incremental: true,
        sinceDays: 2,
        maxJobs: 200,
      });

      results.push(result);
    }

    return results;
  }
}

/**
 * Batch Processor - Handles efficient batch upserts to database
 */

import { PrismaClient } from '@prisma/client';
import type { Job } from '@/types/job';

const BATCH_SIZE = 50;
const MAX_DESCRIPTION_LENGTH = 5000;

export class BatchProcessor {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Upsert jobs in batches using transactions
   */
  async batchUpsert(jobs: Job[]): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;

    // Process in batches to manage memory
    for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
      const batch = jobs.slice(i, i + BATCH_SIZE);

      // Process each batch
      for (const job of batch) {
        const result = await this.upsertJob(job);
        if (result.created) created++;
        else updated++;
      }
    }

    return { created, updated };
  }

  /**
   * Upsert a single job
   */
  private async upsertJob(job: Job): Promise<{ created: boolean }> {
    const existingJob = await this.prisma.job.findUnique({
      where: {
        source_externalId: {
          source: job.source,
          externalId: job.externalId,
        },
      },
      select: { id: true },
    });

    const jobData = this.prepareJobData(job);

    await this.prisma.job.upsert({
      where: {
        source_externalId: {
          source: job.source,
          externalId: job.externalId,
        },
      },
      update: {
        ...jobData,
        lastSyncedAt: new Date(),
        syncStatus: 'active',
        updatedAt: new Date(),
      },
      create: {
        ...jobData,
        lastSyncedAt: new Date(),
        syncStatus: 'active',
        isActive: true,
        viewCount: 0,
      },
    });

    return { created: !existingJob };
  }

  /**
   * Prepare job data for database insertion
   */
  private prepareJobData(job: Job) {
    return {
      externalId: job.externalId,
      source: job.source,
      title: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      companyUrl: job.companyUrl,
      location: job.location,
      locationType: job.locationType,
      description: this.truncateDescription(job.description),
      descriptionHtml: job.descriptionHtml,
      requirements: job.requirements,
      benefits: job.benefits,
      category: job.category,
      tags: job.tags || [],
      experienceLevel: job.experienceLevel,
      employmentType: job.employmentType,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: job.salaryCurrency,
      salaryPeriod: job.salaryPeriod,
      applyUrl: job.applyUrl,
      applicationEmail: job.applicationEmail,
      publishedAt: job.publishedAt ? new Date(job.publishedAt) : null,
      expiresAt: job.expiresAt ? new Date(job.expiresAt) : null,
      fetchedAt: new Date(),
    };
  }

  /**
   * Truncate description to max length for storage optimization
   */
  private truncateDescription(description: string): string {
    if (description.length <= MAX_DESCRIPTION_LENGTH) {
      return description;
    }
    return description.substring(0, MAX_DESCRIPTION_LENGTH) + '...';
  }

  /**
   * Mark jobs as stale if not synced recently
   */
  async markStaleJobs(daysThreshold: number = 60): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

    const result = await this.prisma.job.updateMany({
      where: {
        publishedAt: {
          lt: cutoffDate,
        },
        syncStatus: 'active',
      },
      data: {
        syncStatus: 'stale',
        updatedAt: new Date(),
      },
    });

    return result.count;
  }

  /**
   * Delete expired jobs (stale for > 90 days with no relations)
   */
  async cleanupExpiredJobs(daysThreshold: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

    const result = await this.prisma.job.deleteMany({
      where: {
        publishedAt: {
          lt: cutoffDate,
        },
        syncStatus: 'stale',
        savedBy: {
          none: {},
        },
        applications: {
          none: {},
        },
      },
    });

    return result.count;
  }
}

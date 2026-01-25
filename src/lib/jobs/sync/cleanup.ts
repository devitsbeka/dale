/**
 * Cleanup Utilities for Stale Job Management
 * Standalone utilities that can be imported and used independently
 */

import { PrismaClient } from '@prisma/client';

/**
 * Mark jobs as stale if published date is older than threshold
 * Default: 60 days
 */
export async function markStaleJobs(
  prisma: PrismaClient,
  daysThreshold: number = 60
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

  const result = await prisma.job.updateMany({
    where: {
      publishedAt: {
        lt: cutoffDate,
      },
      syncStatus: 'active',
      isActive: true,
    },
    data: {
      syncStatus: 'stale',
      updatedAt: new Date(),
    },
  });

  console.log(`Marked ${result.count} jobs as stale (older than ${daysThreshold} days)`);
  return result.count;
}

/**
 * Delete expired jobs (stale for > threshold days with no user relations)
 * Default: 90 days
 */
export async function cleanupExpiredJobs(
  prisma: PrismaClient,
  daysThreshold: number = 90
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

  const result = await prisma.job.deleteMany({
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

  console.log(`Deleted ${result.count} expired jobs (older than ${daysThreshold} days with no relations)`);
  return result.count;
}

/**
 * Mark jobs from a specific source as inactive
 * Useful when a source is deprecated or removed
 */
export async function deactivateSourceJobs(
  prisma: PrismaClient,
  source: string
): Promise<number> {
  const result = await prisma.job.updateMany({
    where: {
      source,
      isActive: true,
    },
    data: {
      isActive: false,
      syncStatus: 'expired',
      updatedAt: new Date(),
    },
  });

  console.log(`Deactivated ${result.count} jobs from source: ${source}`);
  return result.count;
}

/**
 * Reactivate jobs that were incorrectly marked as stale
 * (e.g., if they have recent sync activity)
 */
export async function reactivateRecentJobs(
  prisma: PrismaClient,
  daysThreshold: number = 30
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

  const result = await prisma.job.updateMany({
    where: {
      lastSyncedAt: {
        gte: cutoffDate,
      },
      syncStatus: 'stale',
    },
    data: {
      syncStatus: 'active',
      isActive: true,
      updatedAt: new Date(),
    },
  });

  console.log(`Reactivated ${result.count} recently synced jobs`);
  return result.count;
}

/**
 * Get cleanup statistics
 */
export async function getCleanupStats(prisma: PrismaClient) {
  const [total, active, stale, expired] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { syncStatus: 'active' } }),
    prisma.job.count({ where: { syncStatus: 'stale' } }),
    prisma.job.count({ where: { syncStatus: 'expired' } }),
  ]);

  const oldJobsCount = await prisma.job.count({
    where: {
      publishedAt: {
        lt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days
      },
    },
  });

  return {
    total,
    active,
    stale,
    expired,
    oldJobsCount,
  };
}

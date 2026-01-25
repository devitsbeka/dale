/**
 * Sync Status API
 * GET /api/jobs/sync-status - Get current sync status and statistics
 */

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get latest sync logs
    const latestSyncs = await prisma.syncLog.findMany({
      orderBy: {
        startedAt: 'desc',
      },
      take: 10,
    });

    // Get the most recent completed sync
    const lastSuccessfulSync = await prisma.syncLog.findFirst({
      where: {
        status: 'completed',
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    // Get currently running syncs
    const runningSyncs = await prisma.syncLog.findMany({
      where: {
        status: 'running',
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    // Get job statistics
    const [
      totalJobs,
      activeJobs,
      staleJobs,
      newestJob,
      oldestJob,
      jobsBySource,
      jobsByStatus,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { isActive: true, syncStatus: 'active' } }),
      prisma.job.count({ where: { syncStatus: 'stale' } }),
      prisma.job.findFirst({
        where: { isActive: true },
        orderBy: { publishedAt: 'desc' },
        select: { publishedAt: true, title: true, company: true },
      }),
      prisma.job.findFirst({
        where: { isActive: true },
        orderBy: { publishedAt: 'asc' },
        select: { publishedAt: true },
      }),
      prisma.job.groupBy({
        by: ['source'],
        _count: true,
        orderBy: {
          _count: {
            source: 'desc',
          },
        },
      }),
      prisma.job.groupBy({
        by: ['syncStatus'],
        _count: true,
      }),
    ]);

    // Calculate database size estimate (rough approximation)
    const avgJobSize = 10000; // ~10KB per job
    const estimatedSizeMB = (totalJobs * avgJobSize) / (1024 * 1024);

    // Calculate sync health metrics
    const syncHealth = calculateSyncHealth(latestSyncs);

    return NextResponse.json({
      status: 'ok',
      lastSync: lastSuccessfulSync
        ? {
            id: lastSuccessfulSync.id,
            type: lastSuccessfulSync.syncType,
            startedAt: lastSuccessfulSync.startedAt,
            completedAt: lastSuccessfulSync.completedAt,
            duration: lastSuccessfulSync.duration,
            jobsCreated: lastSuccessfulSync.jobsCreated,
            jobsUpdated: lastSuccessfulSync.jobsUpdated,
            jobsStaled: lastSuccessfulSync.jobsStaled,
            jobsDeleted: lastSuccessfulSync.jobsDeleted,
            sourcesCompleted: lastSuccessfulSync.sourcesCompleted,
            sourcesTotal: lastSuccessfulSync.sourcesTotal,
          }
        : null,
      runningSyncs: runningSyncs.map(sync => ({
        id: sync.id,
        type: sync.syncType,
        startedAt: sync.startedAt,
        progress: `${sync.sourcesCompleted}/${sync.sourcesTotal}`,
        duration: Date.now() - new Date(sync.startedAt).getTime(),
      })),
      jobs: {
        total: totalJobs,
        active: activeJobs,
        stale: staleJobs,
        newest: newestJob
          ? {
              publishedAt: newestJob.publishedAt,
              title: newestJob.title,
              company: newestJob.company,
            }
          : null,
        oldestActive: oldestJob?.publishedAt || null,
        bySource: jobsBySource.map(item => ({
          source: item.source,
          count: item._count,
        })),
        byStatus: jobsByStatus.map(item => ({
          status: item.syncStatus,
          count: item._count,
        })),
      },
      database: {
        estimatedSizeMB: Math.round(estimatedSizeMB),
        withinFreeTier: estimatedSizeMB < 512, // Neon free tier is 512MB
      },
      health: syncHealth,
      recentSyncs: latestSyncs.slice(0, 5).map(sync => ({
        id: sync.id,
        type: sync.syncType,
        status: sync.status,
        startedAt: sync.startedAt,
        completedAt: sync.completedAt,
        duration: sync.duration,
        jobsCreated: sync.jobsCreated,
        jobsUpdated: sync.jobsUpdated,
        errors: sync.errors ? JSON.parse(sync.errors) : null,
      })),
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to fetch sync status',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Calculate sync health score and status
 */
function calculateSyncHealth(recentSyncs: any[]) {
  if (recentSyncs.length === 0) {
    return {
      status: 'unknown',
      score: 0,
      message: 'No sync history available',
    };
  }

  const last5 = recentSyncs.slice(0, 5);
  const completedCount = last5.filter(s => s.status === 'completed').length;
  const failedCount = last5.filter(s => s.status === 'failed').length;

  const successRate = completedCount / last5.length;

  // Check if last sync was recent (within 25 hours for hourly, or 2 days for daily)
  const latestSync = recentSyncs[0];
  const hoursSinceLastSync =
    (Date.now() - new Date(latestSync.startedAt).getTime()) / (1000 * 60 * 60);

  let status: 'healthy' | 'degraded' | 'unhealthy';
  let message: string;

  if (successRate >= 0.8 && hoursSinceLastSync < 25) {
    status = 'healthy';
    message = 'Sync system is operating normally';
  } else if (successRate >= 0.6 || hoursSinceLastSync < 48) {
    status = 'degraded';
    message = 'Sync system is experiencing some issues';
  } else {
    status = 'unhealthy';
    message = 'Sync system requires attention';
  }

  return {
    status,
    score: Math.round(successRate * 100),
    message,
    lastSyncHoursAgo: Math.round(hoursSinceLastSync),
    successRate: `${completedCount}/${last5.length}`,
  };
}

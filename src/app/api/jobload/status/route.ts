/**
 * Job Load Status API
 * GET /api/jobload/status - Get current status of all job loads
 */

import { NextResponse } from 'next/server';
import { apifyJobLoader } from '@/lib/apify';
import { apifyClient } from '@/lib/apify/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all load statuses
    const statuses = apifyJobLoader.getAllLoadStatuses();

    // Get Apify usage stats
    const usageStats = await apifyClient.getUsageStats().catch(() => ({
      creditsUsed: 0,
      creditsRemaining: 5,
      computeUnits: 0,
    }));

    // Calculate totals
    const totalJobsFetched = statuses.reduce((sum, s) => sum + s.jobsFetched, 0);
    const totalJobsSynced = statuses.reduce((sum, s) => sum + s.jobsSynced, 0);
    const totalCost = statuses.reduce((sum, s) => sum + s.estimatedCost, 0);

    // Calculate overall progress
    const completedLoads = statuses.filter((s) => s.status === 'completed').length;
    const failedLoads = statuses.filter((s) => s.status === 'failed').length;
    const runningLoads = statuses.filter((s) => s.status === 'running').length;
    const overallProgress =
      statuses.length > 0
        ? Math.round(
            statuses.reduce((sum, s) => sum + s.progress, 0) / statuses.length
          )
        : 0;

    return NextResponse.json({
      overall: {
        totalLoads: statuses.length,
        completedLoads,
        failedLoads,
        runningLoads,
        overallProgress,
        totalJobsFetched,
        totalJobsSynced,
        totalCost,
      },
      usage: {
        creditsUsed: usageStats.creditsUsed,
        creditsRemaining: usageStats.creditsRemaining,
        computeUnits: usageStats.computeUnits,
      },
      loads: statuses.map((s) => ({
        runId: s.runId,
        actorName: s.actorName,
        status: s.status,
        progress: s.progress,
        jobsFetched: s.jobsFetched,
        jobsSynced: s.jobsSynced,
        errors: s.errors,
        startedAt: s.startedAt,
        completedAt: s.completedAt,
        estimatedCost: s.estimatedCost,
        duration: s.completedAt
          ? Math.round((s.completedAt.getTime() - s.startedAt.getTime()) / 1000)
          : Math.round((Date.now() - s.startedAt.getTime()) / 1000),
      })),
    });
  } catch (error) {
    console.error('Error getting job load status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get status',
      },
      { status: 500 }
    );
  }
}

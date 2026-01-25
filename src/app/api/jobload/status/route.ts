/**
 * Job Load Status API
 * GET /api/jobload/status - Get current status of all job loads
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApifyJobLoader } from '@/lib/apify';
import { ApifyClient } from '@/lib/apify/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get all load statuses
    const statuses = ApifyJobLoader.getAllLoadStatuses();

    // Get API token from header
    const apiToken = request.headers.get('X-Apify-Token') || process.env.APIFY_API_TOKEN;

    // Get Apify usage stats (only if token is available)
    let usageStats = {
      creditsUsed: 0,
      creditsRemaining: 0,
      computeUnits: 0,
    };

    if (apiToken) {
      const client = new ApifyClient(apiToken);
      usageStats = await client.getUsageStats().catch(() => ({
        creditsUsed: 0,
        creditsRemaining: 0,
        computeUnits: 0,
      }));
    }

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

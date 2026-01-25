/**
 * Job Load Logs API
 * GET /api/jobload/logs - Get detailed logs for job loading
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApifyJobLoader } from '@/lib/apify';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get('runId');

    if (runId) {
      // Get logs for specific run
      const status = ApifyJobLoader.getLoadStatus(runId);

      if (!status) {
        return NextResponse.json(
          { success: false, error: 'Run not found' },
          { status: 404 }
        );
      }

      const logs = [
        {
          timestamp: status.startedAt.toISOString(),
          level: 'info',
          message: `Started loading jobs from ${status.actorName}`,
        },
      ];

      if (status.progress >= 30) {
        logs.push({
          timestamp: status.startedAt.toISOString(),
          level: 'info',
          message: 'Actor is running...',
        });
      }

      if (status.progress >= 50) {
        logs.push({
          timestamp: status.startedAt.toISOString(),
          level: 'info',
          message: `Fetched ${status.jobsFetched} jobs from actor`,
        });
      }

      if (status.progress >= 70) {
        logs.push({
          timestamp: status.startedAt.toISOString(),
          level: 'info',
          message: 'Normalizing job data...',
        });
      }

      if (status.progress >= 80) {
        logs.push({
          timestamp: status.startedAt.toISOString(),
          level: 'info',
          message: 'Syncing jobs to database...',
        });
      }

      if (status.status === 'completed') {
        logs.push({
          timestamp: status.completedAt?.toISOString() || new Date().toISOString(),
          level: 'success',
          message: `✅ Successfully synced ${status.jobsSynced} jobs`,
        });
      }

      if (status.errors.length > 0) {
        status.errors.forEach((error) => {
          logs.push({
            timestamp: status.completedAt?.toISOString() || new Date().toISOString(),
            level: 'error',
            message: `❌ Error: ${error}`,
          });
        });
      }

      return NextResponse.json({
        runId,
        actorName: status.actorName,
        logs,
      });
    }

    // Get all logs
    const allStatuses = ApifyJobLoader.getAllLoadStatuses();
    const allLogs = allStatuses.map((status) => ({
      runId: status.runId,
      actorName: status.actorName,
      status: status.status,
      message:
        status.status === 'completed'
          ? `✅ ${status.actorName}: Synced ${status.jobsSynced} jobs`
          : status.status === 'failed'
          ? `❌ ${status.actorName}: Failed - ${status.errors[0] || 'Unknown error'}`
          : `⏳ ${status.actorName}: ${status.progress}% complete`,
      timestamp: status.completedAt?.toISOString() || status.startedAt.toISOString(),
    }));

    return NextResponse.json({
      logs: allLogs,
      total: allLogs.length,
    });
  } catch (error) {
    console.error('Error getting logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get logs',
      },
      { status: 500 }
    );
  }
}

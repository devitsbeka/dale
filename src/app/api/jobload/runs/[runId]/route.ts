/**
 * Job Load Run Details API
 * GET /api/jobload/runs/[runId] - Get detailed info and results for a specific run
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from '@/lib/apify/client';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params;
    const apiToken = request.headers.get('X-Apify-Token') || process.env.APIFY_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        { success: false, error: 'API token required' },
        { status: 401 }
      );
    }

    const client = new ApifyClient(apiToken);

    // Get run details
    const run = await client.getRun(runId);

    // Get dataset items (the actual jobs fetched)
    const items = await client.getAllDatasetItems(run.defaultDatasetId);

    // Get logs (latest 1000 lines)
    const logsResponse = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}/log`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    let logs = '';
    if (logsResponse.ok) {
      logs = await logsResponse.text();
    }

    return NextResponse.json({
      run: {
        id: run.id,
        actorId: run.actorId,
        status: run.status,
        startedAt: run.startedAt,
        finishedAt: run.finishedAt,
        stats: run.stats,
      },
      items,
      logs,
      totalItems: items.length,
    });
  } catch (error) {
    console.error('Error getting run details:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get run details',
      },
      { status: 500 }
    );
  }
}

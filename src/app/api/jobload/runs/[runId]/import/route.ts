/**
 * Import Jobs from Run API
 * POST /api/jobload/runs/[runId]/import - Import jobs from a specific run to database
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ApifyClient } from '@/lib/apify/client';
import { normalizeLinkedInJob, normalizeGreenhouseJob, normalizeIndeedJob } from '@/lib/apify/normalizers';
import { BatchProcessor } from '@/lib/jobs/sync';
import type { Job } from '@/types/job';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for large imports

const prisma = new PrismaClient();

export async function POST(
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

    const body = await request.json().catch(() => ({}));
    const { actorId } = body;

    if (!actorId) {
      return NextResponse.json(
        { success: false, error: 'Actor ID required' },
        { status: 400 }
      );
    }

    const client = new ApifyClient(apiToken);

    // Get run details
    const run = await client.getRun(runId);

    if (run.status !== 'SUCCEEDED') {
      return NextResponse.json(
        { success: false, error: 'Can only import from succeeded runs' },
        { status: 400 }
      );
    }

    // Get dataset items
    const items = await client.getAllDatasetItems(run.defaultDatasetId);

    // Normalize jobs based on actor type
    const jobs: Job[] = [];
    const actorMap: Record<string, (item: any) => Job | null> = {
      'hKByXkMQaC5Qt9UMN': normalizeLinkedInJob,
      'N5bHfOymnV2CDodyf': normalizeGreenhouseJob,
      'hMvNSpz3JnHgl5jkh': normalizeIndeedJob,
    };

    const normalizer = actorMap[actorId];
    if (!normalizer) {
      return NextResponse.json(
        { success: false, error: 'Unknown actor type' },
        { status: 400 }
      );
    }

    for (const item of items) {
      const job = normalizer(item);
      if (job) {
        jobs.push(job);
      }
    }

    // Import to database
    const batchProcessor = new BatchProcessor(prisma);
    const { created, updated } = await batchProcessor.batchUpsert(jobs);

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: `Imported ${created + updated} jobs (${created} new, ${updated} updated)`,
      stats: {
        totalFetched: items.length,
        normalized: jobs.length,
        created,
        updated,
      },
    });
  } catch (error) {
    console.error('Error importing jobs:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import jobs',
      },
      { status: 500 }
    );
  }
}

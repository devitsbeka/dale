/**
 * Hourly Cron Job - Incremental Job Sync
 * Runs every hour
 * Syncs top 3 sources (Remotive, RemoteOK, Himalayas) for jobs from last 48 hours
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SourceProcessor } from '@/lib/jobs/sync';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max

export async function GET(request: NextRequest) {
  // Verify this is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const syncLog = await prisma.syncLog.create({
    data: {
      syncType: 'hourly',
      status: 'running',
      sourcesTotal: 3,
      sourcesCompleted: 0,
      sourcesSkipped: 0,
      jobsCreated: 0,
      jobsUpdated: 0,
      jobsStaled: 0,
      jobsDeleted: 0,
    },
  });

  try {
    console.log('[Hourly Sync] Starting incremental sync of top sources');
    const processor = new SourceProcessor(prisma);

    // Sync top 3 sources only
    const results = await processor.syncTopSources();

    // Aggregate results
    let totalCreated = 0;
    let totalUpdated = 0;
    let sourcesCompleted = 0;
    let sourcesSkipped = 0;
    const errors: string[] = [];

    for (const result of results) {
      if (result.success) {
        totalCreated += result.jobsCreated;
        totalUpdated += result.jobsUpdated;
        sourcesCompleted++;
      } else {
        sourcesSkipped++;
        errors.push(...result.errors);
      }
    }

    // Update sync log
    const completedAt = new Date();
    const startedAt = new Date(syncLog.startedAt);
    const duration = completedAt.getTime() - startedAt.getTime();

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: sourcesSkipped === 3 ? 'failed' : 'completed',
        sourcesCompleted,
        sourcesSkipped,
        jobsCreated: totalCreated,
        jobsUpdated: totalUpdated,
        errors: errors.length > 0 ? JSON.stringify(errors) : null,
        completedAt,
        duration,
      },
    });

    console.log('[Hourly Sync] Completed:', {
      created: totalCreated,
      updated: totalUpdated,
      duration: `${duration}ms`,
    });

    return NextResponse.json({
      success: true,
      syncLogId: syncLog.id,
      stats: {
        jobsCreated: totalCreated,
        jobsUpdated: totalUpdated,
        sourcesCompleted,
        sourcesSkipped,
        duration,
      },
      results,
    });
  } catch (error) {
    console.error('[Hourly Sync] Failed:', error);

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: 'failed',
        errors: JSON.stringify([error instanceof Error ? error.message : 'Unknown error']),
        completedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
        syncLogId: syncLog.id,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

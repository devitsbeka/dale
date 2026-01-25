/**
 * Daily Cron Job - Full Job Sync
 * Runs at 2 AM UTC daily
 * Syncs all 8 job sources with full pagination
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SourceProcessor, BatchProcessor } from '@/lib/jobs/sync';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max (Vercel Pro)

export async function GET(request: NextRequest) {
  // Verify this is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const syncLog = await prisma.syncLog.create({
    data: {
      syncType: 'daily',
      status: 'running',
      sourcesTotal: 8,
      sourcesCompleted: 0,
      sourcesSkipped: 0,
      jobsCreated: 0,
      jobsUpdated: 0,
      jobsStaled: 0,
      jobsDeleted: 0,
    },
  });

  try {
    console.log('[Daily Sync] Starting full sync of all sources');
    const processor = new SourceProcessor(prisma);
    const batchProcessor = new BatchProcessor(prisma);

    // Sync all sources
    const results = await processor.syncAllSources(false);

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

    console.log('[Daily Sync] Marking stale jobs...');
    const staleCount = await batchProcessor.markStaleJobs(60);

    console.log('[Daily Sync] Cleaning up expired jobs...');
    const deletedCount = await batchProcessor.cleanupExpiredJobs(90);

    // Update sync log
    const completedAt = new Date();
    const startedAt = new Date(syncLog.startedAt);
    const duration = completedAt.getTime() - startedAt.getTime();

    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: sourcesSkipped === 8 ? 'failed' : 'completed',
        sourcesCompleted,
        sourcesSkipped,
        jobsCreated: totalCreated,
        jobsUpdated: totalUpdated,
        jobsStaled: staleCount,
        jobsDeleted: deletedCount,
        errors: errors.length > 0 ? JSON.stringify(errors) : null,
        completedAt,
        duration,
      },
    });

    console.log('[Daily Sync] Completed:', {
      created: totalCreated,
      updated: totalUpdated,
      staled: staleCount,
      deleted: deletedCount,
      duration: `${duration}ms`,
    });

    return NextResponse.json({
      success: true,
      syncLogId: syncLog.id,
      stats: {
        jobsCreated: totalCreated,
        jobsUpdated: totalUpdated,
        jobsStaled: staleCount,
        jobsDeleted: deletedCount,
        sourcesCompleted,
        sourcesSkipped,
        duration,
      },
      results,
    });
  } catch (error) {
    console.error('[Daily Sync] Failed:', error);

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

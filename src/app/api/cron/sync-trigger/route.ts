/**
 * Manual Sync Trigger
 * For testing and emergency syncs
 * Can specify sync type: daily, hourly, or specific source
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SourceProcessor, BatchProcessor } from '@/lib/jobs/sync';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { syncType = 'daily', source } = body;

    console.log(`[Manual Sync] Starting ${syncType} sync${source ? ` for ${source}` : ''}`);

    const processor = new SourceProcessor(prisma);
    const batchProcessor = new BatchProcessor(prisma);

    let results;
    let sourcesTotal = 0;

    if (source) {
      // Sync specific source
      sourcesTotal = 1;
      const result = await processor.syncSource({
        source,
        incremental: syncType === 'hourly',
        sinceDays: syncType === 'hourly' ? 2 : undefined,
      });
      results = [result];
    } else if (syncType === 'hourly') {
      // Hourly sync - top 3 sources
      sourcesTotal = 3;
      results = await processor.syncTopSources();
    } else {
      // Daily sync - all sources
      sourcesTotal = 8;
      results = await processor.syncAllSources(false);
    }

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

    // Only run cleanup for full daily syncs
    let staleCount = 0;
    let deletedCount = 0;

    if (syncType === 'daily' && !source) {
      console.log('[Manual Sync] Marking stale jobs...');
      staleCount = await batchProcessor.markStaleJobs(60);

      console.log('[Manual Sync] Cleaning up expired jobs...');
      deletedCount = await batchProcessor.cleanupExpiredJobs(90);
    }

    // Create sync log
    const syncLog = await prisma.syncLog.create({
      data: {
        syncType: 'manual',
        status: sourcesSkipped === sourcesTotal ? 'failed' : 'completed',
        sourcesTotal,
        sourcesCompleted,
        sourcesSkipped,
        jobsCreated: totalCreated,
        jobsUpdated: totalUpdated,
        jobsStaled: staleCount,
        jobsDeleted: deletedCount,
        errors: errors.length > 0 ? JSON.stringify(errors) : null,
        completedAt: new Date(),
        duration: results.reduce((sum, r) => sum + r.duration, 0),
      },
    });

    console.log('[Manual Sync] Completed:', {
      created: totalCreated,
      updated: totalUpdated,
      staled: staleCount,
      deleted: deletedCount,
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
      },
      results,
    });
  } catch (error) {
    console.error('[Manual Sync] Failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

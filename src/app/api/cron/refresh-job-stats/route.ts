/**
 * Refresh Job Stats Cron - Refresh materialized view every 5 minutes
 * GET /api/cron/refresh-job-stats
 * Triggered by Vercel Cron
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const startTime = Date.now();

    // Refresh the materialized view using the function we created
    await prisma.$executeRawUnsafe('SELECT refresh_job_filter_stats()');

    const duration = Date.now() - startTime;

    console.log(`Materialized view refreshed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      duration,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error refreshing job stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to refresh job stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

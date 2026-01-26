/**
 * Analytics Distribution API - Data for charts
 * GET /api/admin/analytics/distribution
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get category distribution
    const categories = await prisma.job.groupBy({
      by: ['category'],
      where: { isActive: true, category: { not: null } },
      _count: true,
      orderBy: { _count: { category: 'desc' } },
    });

    // Get source distribution
    const sources = await prisma.job.groupBy({
      by: ['source'],
      where: { isActive: true },
      _count: true,
      orderBy: { _count: { source: 'desc' } },
    });

    // Get location type distribution
    const locationTypes = await prisma.job.groupBy({
      by: ['locationType'],
      where: { isActive: true },
      _count: true,
      orderBy: { _count: { locationType: 'desc' } },
    });

    // Get salary distribution (binned into ranges)
    const salaryDistribution = await prisma.$queryRaw<Array<{ range: string; count: number }>>`
      SELECT
        CASE
          WHEN "salaryMax" < 50000 THEN '0-50k'
          WHEN "salaryMax" < 75000 THEN '50-75k'
          WHEN "salaryMax" < 100000 THEN '75-100k'
          WHEN "salaryMax" < 125000 THEN '100-125k'
          WHEN "salaryMax" < 150000 THEN '125-150k'
          WHEN "salaryMax" < 200000 THEN '150-200k'
          ELSE '200k+'
        END as range,
        COUNT(*)::int as count
      FROM jobs
      WHERE "salaryMax" IS NOT NULL AND "isActive" = true
      GROUP BY range
      ORDER BY MIN("salaryMax")
    `;

    return NextResponse.json({
      categories: categories.map((c) => ({
        name: c.category || 'Unknown',
        value: c._count,
      })),
      sources: sources.map((s) => ({
        name: s.source,
        value: s._count,
      })),
      locationTypes: locationTypes.map((l) => ({
        name: l.locationType,
        value: l._count,
      })),
      salaryRanges: salaryDistribution,
    });
  } catch (error) {
    console.error('Error fetching analytics distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch distribution data' },
      { status: 500 }
    );
  }
}

/**
 * Analytics Overview API - Dashboard metrics
 * GET /api/admin/analytics/overview
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get key metrics
    const [
      totalJobs,
      activeJobs,
      staleJobs,
      jobsWithSalary,
      avgSalary,
      medianSalary,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { isActive: true } }),
      prisma.job.count({ where: { syncStatus: 'stale' } }),
      prisma.job.count({
        where: {
          OR: [
            { salaryMin: { not: null } },
            { salaryMax: { not: null } },
          ],
        },
      }),
      prisma.job.aggregate({
        where: { salaryMax: { not: null } },
        _avg: { salaryMax: true },
      }),
      prisma.$queryRaw`
        SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY "salaryMax") as median
        FROM jobs
        WHERE "salaryMax" IS NOT NULL
      ` as Promise<Array<{ median: number }>>,
    ]);

    // Get top categories
    const topCategories = await prisma.job.groupBy({
      by: ['category'],
      where: { isActive: true, category: { not: null } },
      _count: true,
      orderBy: { _count: { category: 'desc' } },
      take: 5,
    });

    // Get top sources
    const topSources = await prisma.job.groupBy({
      by: ['source'],
      where: { isActive: true },
      _count: true,
      orderBy: { _count: { source: 'desc' } },
      take: 5,
    });

    // Calculate quality score (simple completeness metric)
    const qualityData = await prisma.$queryRaw<Array<{ avg_quality_score: number }>>`
      SELECT AVG(
        CASE WHEN "companyLogo" IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN "companyUrl" IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN "requirements" IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN "benefits" IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN "salaryMin" IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN "salaryMax" IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN "experienceLevel" IS NOT NULL THEN 1 ELSE 0 END +
        CASE WHEN "descriptionHtml" IS NOT NULL THEN 1 ELSE 0 END
      ) * 12.5 as avg_quality_score
      FROM jobs
      WHERE "isActive" = true
    `;

    return NextResponse.json({
      totalJobs,
      activeJobs,
      staleJobs,
      jobsWithSalary,
      salaryWithPercent: Math.round((jobsWithSalary / totalJobs) * 100),
      avgSalary: Math.round(avgSalary._avg.salaryMax || 0),
      medianSalary: Math.round(medianSalary[0]?.median || 0),
      avgQualityScore: qualityData[0]?.avg_quality_score || 0,
      topCategories: topCategories.map((c) => ({
        category: c.category,
        count: c._count,
      })),
      topSources: topSources.map((s) => ({
        source: s.source,
        count: s._count,
      })),
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

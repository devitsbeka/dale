/**
 * Time Series Analytics API - Jobs over time with various breakdowns
 * GET /api/admin/analytics/timeseries
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    const groupBy = searchParams.get('groupBy') || 'day'; // day, week, month

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Jobs posted over time (by source)
    const jobsBySource = await prisma.$queryRaw<Array<{
      date: string;
      source: string;
      count: number;
    }>>`
      SELECT
        DATE("publishedAt") as date,
        source,
        COUNT(*)::int as count
      FROM jobs
      WHERE "publishedAt" >= ${cutoffDate}
        AND "publishedAt" IS NOT NULL
      GROUP BY DATE("publishedAt"), source
      ORDER BY date ASC
    `;

    // Jobs by category over time
    const jobsByCategory = await prisma.$queryRaw<Array<{
      date: string;
      category: string;
      count: number;
    }>>`
      SELECT
        DATE("publishedAt") as date,
        COALESCE(category, 'Unknown') as category,
        COUNT(*)::int as count
      FROM jobs
      WHERE "publishedAt" >= ${cutoffDate}
        AND "publishedAt" IS NOT NULL
      GROUP BY DATE("publishedAt"), category
      ORDER BY date ASC
    `;

    // Salary trends over time
    const salaryTrends = await prisma.$queryRaw<Array<{
      date: string;
      avg_salary: number;
      median_salary: number;
      min_salary: number;
      max_salary: number;
    }>>`
      SELECT
        DATE("publishedAt") as date,
        AVG("salaryMax")::int as avg_salary,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY "salaryMax")::int as median_salary,
        MIN("salaryMax")::int as min_salary,
        MAX("salaryMax")::int as max_salary
      FROM jobs
      WHERE "publishedAt" >= ${cutoffDate}
        AND "publishedAt" IS NOT NULL
        AND "salaryMax" IS NOT NULL
      GROUP BY DATE("publishedAt")
      ORDER BY date ASC
    `;

    // Hourly posting patterns (heatmap data)
    const hourlyPatterns = await prisma.$queryRaw<Array<{
      hour: number;
      day_of_week: number;
      count: number;
    }>>`
      SELECT
        EXTRACT(HOUR FROM "publishedAt")::int as hour,
        EXTRACT(DOW FROM "publishedAt")::int as day_of_week,
        COUNT(*)::int as count
      FROM jobs
      WHERE "publishedAt" >= ${cutoffDate}
        AND "publishedAt" IS NOT NULL
      GROUP BY hour, day_of_week
      ORDER BY day_of_week, hour
    `;

    // Quality score trends
    const qualityTrends = await prisma.$queryRaw<Array<{
      date: string;
      avg_quality: number;
    }>>`
      SELECT
        DATE("publishedAt") as date,
        AVG(
          CASE WHEN "companyLogo" IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN "companyUrl" IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN "requirements" IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN "benefits" IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN "salaryMin" IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN "salaryMax" IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN "experienceLevel" IS NOT NULL THEN 1 ELSE 0 END +
          CASE WHEN "descriptionHtml" IS NOT NULL THEN 1 ELSE 0 END
        ) * 12.5 as avg_quality
      FROM jobs
      WHERE "publishedAt" >= ${cutoffDate}
        AND "publishedAt" IS NOT NULL
      GROUP BY DATE("publishedAt")
      ORDER BY date ASC
    `;

    // Location type trends
    const locationTypeTrends = await prisma.$queryRaw<Array<{
      date: string;
      location_type: string;
      count: number;
    }>>`
      SELECT
        DATE("publishedAt") as date,
        "locationType" as location_type,
        COUNT(*)::int as count
      FROM jobs
      WHERE "publishedAt" >= ${cutoffDate}
        AND "publishedAt" IS NOT NULL
      GROUP BY DATE("publishedAt"), "locationType"
      ORDER BY date ASC
    `;

    return NextResponse.json({
      jobsBySource,
      jobsByCategory,
      salaryTrends,
      hourlyPatterns,
      qualityTrends,
      locationTypeTrends,
      dateRange: {
        from: cutoffDate.toISOString(),
        to: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching timeseries analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeseries data' },
      { status: 500 }
    );
  }
}

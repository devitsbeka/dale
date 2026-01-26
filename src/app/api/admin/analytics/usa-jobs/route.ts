/**
 * USA-wide Jobs API - Get all US onsite jobs statistics
 * GET /api/admin/analytics/usa-jobs
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractState, extractCity } from '@/lib/location-utils';
import { getAllStateSalaries } from '@/lib/bls-salary-data';

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');

    const cacheKey = `usa-jobs${minSalary ? `:min${minSalary}` : ''}${maxSalary ? `:max${maxSalary}` : ''}`;
    const now = Date.now();

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Cache': 'HIT'
        }
      });
    }

    // Build where clause for salary filtering
    const salaryWhere: any = {};
    if (minSalary) {
      salaryWhere.salaryMax = { gte: parseInt(minSalary) };
    }
    if (maxSalary) {
      salaryWhere.salaryMin = { lte: parseInt(maxSalary) };
    }

    // Get all onsite jobs with locations
    const onsiteJobs = await prisma.job.findMany({
      where: {
        locationType: 'onsite',
        isActive: true,
        location: { not: null },
        ...salaryWhere
      },
      select: {
        id: true,
        title: true,
        company: true,
        companyLogo: true,
        companyUrl: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        category: true,
        experienceLevel: true,
        employmentType: true,
        description: true,
        requirements: true,
        benefits: true,
        tags: true,
        applyUrl: true,
        publishedAt: true,
        source: true,
      },
      orderBy: [
        { publishedAt: 'desc' },
        { id: 'asc' }
      ]
    });

    // Calculate nationwide average salary from BLS data
    const allStateSalaries = getAllStateSalaries();
    const avgSalary = Math.round(
      allStateSalaries.reduce((sum, s) => sum + s.salary, 0) / allStateSalaries.length
    );

    // Count cities nationwide
    const cityCounts: Record<string, number> = {};
    // Count companies and collect logos
    const companyCounts: Record<string, { count: number; logo: string | null }> = {};

    for (const job of onsiteJobs) {
      if (job.location) {
        const city = extractCity(job.location);
        if (city && city.length > 2) {
          cityCounts[city] = (cityCounts[city] || 0) + 1;
        }
      }

      // Count companies
      if (job.company) {
        if (!companyCounts[job.company]) {
          companyCounts[job.company] = { count: 0, logo: job.companyLogo };
        }
        companyCounts[job.company].count++;
      }
    }

    // Get top city nationwide
    const topCity = Object.entries(cityCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    // Get top 10 employers nationwide
    const topEmployers = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 10)
      .map(([company, data]) => ({
        company,
        logo: data.logo,
        jobCount: data.count
      }));

    const responseData = {
      state: 'USA',
      totalJobs: onsiteJobs.length,
      avgSalary,
      topCity,
      topEmployers,
      jobs: onsiteJobs,
      filters: {
        minSalary: minSalary ? parseInt(minSalary) : null,
        maxSalary: maxSalary ? parseInt(maxSalary) : null
      }
    };

    // Update cache
    cache.set(cacheKey, { data: responseData, timestamp: now });

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error fetching USA jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch USA jobs' },
      { status: 500 }
    );
  }
}

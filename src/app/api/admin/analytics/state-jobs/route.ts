/**
 * State Jobs API - Get jobs for a specific state
 * GET /api/admin/analytics/state-jobs?state=CA
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { matchesState } from '@/lib/location-utils';
import { getStateSalary } from '@/lib/bls-salary-data';

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');

    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required' },
        { status: 400 }
      );
    }

    const cacheKey = `state-jobs:${state.toUpperCase()}${minSalary ? `:min${minSalary}` : ''}${maxSalary ? `:max${maxSalary}` : ''}`;
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
        { id: 'asc' } // Stable secondary sort
      ]
    });

    // Filter jobs by state
    const stateJobs = onsiteJobs.filter(job => matchesState(job.location, state));

    // Get average salary from BLS data
    const avgSalary = getStateSalary(state);

    // Count cities
    const cityCounts: Record<string, number> = {};
    // Count companies and collect logos
    const companyCounts: Record<string, { count: number; logo: string | null }> = {};

    for (const job of stateJobs) {
      if (job.location) {
        const city = job.location.split(',')[0]?.trim();
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

    // Get top city
    const topCity = Object.entries(cityCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    // Get top 10 employers
    const topEmployers = Object.entries(companyCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 10)
      .map(([company, data]) => ({
        company,
        logo: data.logo,
        jobCount: data.count
      }));

    const responseData = {
      state,
      totalJobs: stateJobs.length,
      avgSalary,
      topCity,
      topEmployers,
      jobs: stateJobs,  // Return all jobs (no limit)
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
    console.error('Error fetching state jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch state jobs' },
      { status: 500 }
    );
  }
}

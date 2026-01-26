/**
 * State Jobs API - Get jobs for a specific state
 * GET /api/admin/analytics/state-jobs?state=CA
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { matchesState } from '@/lib/location-utils';

// In-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');

    if (!state) {
      return NextResponse.json(
        { error: 'State parameter is required' },
        { status: 400 }
      );
    }

    const cacheKey = `state-jobs:${state.toUpperCase()}`;
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

    // Get all onsite jobs with locations
    const onsiteJobs = await prisma.job.findMany({
      where: {
        locationType: 'onsite',
        isActive: true,
        location: { not: null }
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

    // Limit to 50 most recent jobs
    const limitedJobs = stateJobs.slice(0, 50);

    const responseData = {
      state,
      totalJobs: stateJobs.length,
      jobs: limitedJobs,
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

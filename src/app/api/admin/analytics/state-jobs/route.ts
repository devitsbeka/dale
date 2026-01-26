/**
 * State Jobs API - Get jobs for a specific state
 * GET /api/admin/analytics/state-jobs?state=CA
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { matchesState } from '@/lib/location-utils';

export const dynamic = 'force-dynamic';

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

    return NextResponse.json({
      state,
      totalJobs: stateJobs.length,
      jobs: limitedJobs,
    });
  } catch (error) {
    console.error('Error fetching state jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch state jobs' },
      { status: 500 }
    );
  }
}

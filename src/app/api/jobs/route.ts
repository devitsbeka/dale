/**
 * Jobs API Route
 * GET /api/jobs - Fetch aggregated jobs with filters
 */

import { NextRequest, NextResponse } from 'next/server';
import { aggregateJobs, calculateJobStats } from '@/lib/jobs';
import type { JobSearchParams, JobCategory, LocationType, ExperienceLevel, EmploymentType, JobSource } from '@/types/job';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const params: JobSearchParams = {
      query: searchParams.get('q') || searchParams.get('query') || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: Math.min(parseInt(searchParams.get('limit') || '20', 10), 100),
      sortBy: (searchParams.get('sortBy') as 'relevance' | 'date' | 'salary') || 'date',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      postedWithin: (searchParams.get('postedWithin') as 'day' | 'week' | 'month' | 'any') || undefined,
    };

    // Parse array parameters
    const locations = searchParams.get('locations');
    if (locations) {
      params.locations = locations.split(',').filter(Boolean);
    }

    const categories = searchParams.get('categories');
    if (categories) {
      params.categories = categories.split(',').filter(Boolean) as JobCategory[];
    }

    const locationType = searchParams.get('locationType');
    if (locationType) {
      params.locationType = locationType.split(',').filter(Boolean) as LocationType[];
    }

    const experienceLevel = searchParams.get('experienceLevel');
    if (experienceLevel) {
      params.experienceLevel = experienceLevel.split(',').filter(Boolean) as ExperienceLevel[];
    }

    const employmentType = searchParams.get('employmentType');
    if (employmentType) {
      params.employmentType = employmentType.split(',').filter(Boolean) as EmploymentType[];
    }

    const sources = searchParams.get('sources');
    if (sources) {
      params.sources = sources.split(',').filter(Boolean) as JobSource[];
    }

    const salaryMin = searchParams.get('salaryMin');
    if (salaryMin) {
      params.salaryMin = parseInt(salaryMin, 10);
    }

    const salaryMax = searchParams.get('salaryMax');
    if (salaryMax) {
      params.salaryMax = parseInt(salaryMax, 10);
    }

    // Fetch jobs
    const result = await aggregateJobs(params);

    // Calculate stats for filter options
    const stats = calculateJobStats(result.jobs);

    return NextResponse.json({
      jobs: result.jobs,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 20,
        total: result.total,
        totalPages: Math.ceil(result.total / (params.limit || 20)),
      },
      sources: result.sources,
      fromCache: result.fromCache,
      filters: {
        availableCategories: Object.entries(stats.byCategory)
          .map(([value, count]) => ({
            value,
            label: value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' '),
            count,
          }))
          .sort((a, b) => b.count - a.count),
        availableLocations: stats.topLocations.map((l) => ({
          value: l.location,
          label: l.location,
          count: l.count,
        })),
        availableTags: stats.topTags.map((t) => ({
          value: t.tag,
          label: t.tag,
          count: t.count,
        })),
      },
      stats: {
        totalJobs: result.total,
        byLocationType: stats.byLocationType,
        avgSalary: stats.avgSalary,
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch jobs',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

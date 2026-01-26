/**
 * USAJobs API Integration
 * GET /api/admin/analytics/usajobs-data
 */

import { NextRequest, NextResponse } from 'next/server';

// Cache for USAJobs data
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const cacheKey = 'usajobs-all';
    const now = Date.now();

    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600',
          'X-Cache': 'HIT'
        }
      });
    }

    // Fetch from USAJobs API
    const usajobsResponse = await fetch(
      'https://data.usajobs.gov/api/search?' + new URLSearchParams({
        Keyword: 'software developer engineer',
        ResultsPerPage: '500',
        Fields: 'min'
      }),
      {
        headers: {
          'Host': 'data.usajobs.gov',
          'User-Agent': process.env.USAJOBS_USER_AGENT || 'contact@example.com',
          'Authorization-Key': process.env.USAJOBS_API_KEY || ''
        }
      }
    );

    if (!usajobsResponse.ok) {
      console.error('USAJobs API error:', usajobsResponse.status);
      return NextResponse.json({ error: 'Failed to fetch USAJobs data' }, { status: 500 });
    }

    const data = await usajobsResponse.json();

    // Transform USAJobs data to our format
    const jobs = (data.SearchResult?.SearchResultItems || []).map((item: any) => {
      const job = item.MatchedObjectDescriptor;
      const org = job.OrganizationName || 'Unknown';
      const location = job.PositionLocationDisplay || job.PositionLocation?.[0]?.LocationName || 'United States';

      return {
        id: `usajobs-${job.PositionID}`,
        title: job.PositionTitle,
        company: org,
        companyLogo: null,
        companyUrl: null,
        location: location,
        salaryMin: job.PositionRemuneration?.[0]?.MinimumRange ? parseInt(job.PositionRemuneration[0].MinimumRange) : null,
        salaryMax: job.PositionRemuneration?.[0]?.MaximumRange ? parseInt(job.PositionRemuneration[0].MaximumRange) : null,
        salaryCurrency: 'USD',
        category: 'software-dev',
        experienceLevel: job.JobGrade?.[0]?.Code || null,
        employmentType: job.PositionSchedule?.[0]?.Name === 'Full-Time' ? 'full-time' : 'part-time',
        description: job.UserArea?.Details?.JobSummary || job.PositionTitle,
        requirements: job.QualificationSummary || null,
        benefits: null,
        tags: job.JobCategory?.map((c: any) => c.Name) || [],
        applyUrl: job.PositionURI,
        publishedAt: new Date(job.PublicationStartDate),
        source: 'usajobs'
      };
    });

    const responseData = {
      jobs,
      totalJobs: jobs.length,
      source: 'usajobs'
    };

    // Update cache
    cache.set(cacheKey, { data: responseData, timestamp: now });

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error fetching USAJobs data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch USAJobs data' },
      { status: 500 }
    );
  }
}

/**
 * USA Map Analytics API - Onsite jobs by state
 * GET /api/admin/analytics/usa-map
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractState } from '@/lib/location-utils';

export const dynamic = 'force-dynamic';

// Reverse mapping: abbreviation to full name
const abbrToStateName: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'District of Columbia'
};

export async function GET() {
  try {
    // Get all onsite jobs with locations
    const onsiteJobs = await prisma.job.findMany({
      where: {
        locationType: 'onsite',
        isActive: true,
        location: { not: null }
      },
      select: {
        id: true,
        location: true
      },
      orderBy: [
        { publishedAt: 'desc' },
        { id: 'asc' }
      ]
    });

    // Count jobs by state
    const stateCounts: Record<string, number> = {};

    for (const job of onsiteJobs) {
      const state = extractState(job.location);
      if (state) {
        stateCounts[state] = (stateCounts[state] || 0) + 1;
      }
    }

    // Convert to array format for ECharts (use full state names for map matching)
    const data = Object.entries(stateCounts).map(([state, count]) => ({
      name: abbrToStateName[state] || state, // Convert abbreviation to full name
      value: count
    })).sort((a, b) => b.value - a.value);

    return NextResponse.json({
      data,
      totalJobs: onsiteJobs.length,
      jobsWithState: data.reduce((sum, item) => sum + item.value, 0),
      topStates: data.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching USA map data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch USA map data' },
      { status: 500 }
    );
  }
}

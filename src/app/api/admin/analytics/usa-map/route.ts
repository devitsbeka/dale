/**
 * USA Map Analytics API - Onsite jobs by state
 * GET /api/admin/analytics/usa-map
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractState } from '@/lib/location-utils';
import { getStateSalary } from '@/lib/bls-salary-data';

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

// Helper function - matches EXACT same logic as state-jobs API SQL patterns
function matchesStatePattern(location: string | null, stateAbbr: string, stateName: string): boolean {
  if (!location) return false;

  // Use EXACT same patterns as state-jobs API for consistency
  const patterns = [
    `, ${stateAbbr}`,        // "City, CA"
    `, ${stateAbbr} `,       // "City, CA 12345"
    `, ${stateName}`,        // "City, California"
    `, ${stateName} `,       // "City, California, USA"
  ];

  return patterns.some(pattern => location.includes(pattern));
}

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

    // Count jobs by state using SAME pattern matching as state-jobs API
    const stateCounts: Record<string, number> = {};

    for (const job of onsiteJobs) {
      // Check each state pattern
      for (const [abbr, stateName] of Object.entries(abbrToStateName)) {
        if (matchesStatePattern(job.location, abbr, stateName)) {
          stateCounts[abbr] = (stateCounts[abbr] || 0) + 1;
          break; // Job matched this state, don't count it twice
        }
      }
    }

    const totalJobs = Object.values(stateCounts).reduce((sum, count) => sum + count, 0);

    // Create complete data array with ALL states (including 0-count states)
    // Use BLS salary data for the map gradient
    const data = Object.entries(abbrToStateName).map(([abbr, name]) => {
      const salary = getStateSalary(abbr) || 0;
      return {
        name: name,
        value: salary,  // Average salary from BLS data
        jobCount: stateCounts[abbr] || 0
      };
    }).sort((a, b) => b.value - a.value);

    // Separate stats for states with actual jobs
    const statesWithJobs = data.filter(d => d.jobCount > 0);

    return NextResponse.json({
      data,  // All 51 states with salary data
      totalJobs: totalJobs,
      jobsWithState: totalJobs,
      topStates: statesWithJobs.slice(0, 10)  // Top 10 by job count
    });
  } catch (error) {
    console.error('Error fetching USA map data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch USA map data' },
      { status: 500 }
    );
  }
}

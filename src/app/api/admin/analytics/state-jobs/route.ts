/**
 * State Jobs API - Get jobs for a specific state
 * GET /api/admin/analytics/state-jobs?state=CA
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// US State mappings
const stateAbbreviations: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'District of Columbia': 'DC', 'Washington DC': 'DC', 'Washington D.C.': 'DC'
};

function matchesState(location: string | null, targetState: string): boolean {
  if (!location) return false;

  const normalized = location.trim();

  // Check for state abbreviation
  const commaMatch = normalized.match(/,\s*([A-Z]{2})(?:\s|$|,)/i);
  if (commaMatch) {
    return commaMatch[1].toUpperCase() === targetState.toUpperCase();
  }

  // Check for full state name
  for (const [fullName, abbr] of Object.entries(stateAbbreviations)) {
    if (abbr === targetState.toUpperCase() && normalized.toLowerCase().includes(fullName.toLowerCase())) {
      return true;
    }
  }

  // Check standalone abbreviation
  const tokens = normalized.split(/[\s,]+/);
  for (const token of tokens) {
    if (token.toUpperCase() === targetState.toUpperCase() && token.length === 2) {
      return true;
    }
  }

  return false;
}

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
        location: true,
        salaryMin: true,
        salaryMax: true,
        salaryCurrency: true,
        category: true,
        experienceLevel: true,
        publishedAt: true,
        source: true,
      },
      orderBy: {
        publishedAt: 'desc'
      }
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

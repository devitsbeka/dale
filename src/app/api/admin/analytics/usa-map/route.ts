/**
 * USA Map Analytics API - Onsite jobs by state
 * GET /api/admin/analytics/usa-map
 */

import { NextResponse } from 'next/server';
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

const validStates = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]);

function extractState(location: string | null): string | null {
  if (!location) return null;

  // Remove extra spaces and normalize
  const normalized = location.trim();

  // Try to extract state abbreviation (last 2 characters after comma)
  // Format: "City, ST" or "City, State"
  const commaMatch = normalized.match(/,\s*([A-Z]{2})(?:\s|$|,)/i);
  if (commaMatch) {
    const abbr = commaMatch[1].toUpperCase();
    if (validStates.has(abbr)) {
      return abbr;
    }
  }

  // Try to match full state name
  for (const [fullName, abbr] of Object.entries(stateAbbreviations)) {
    if (normalized.toLowerCase().includes(fullName.toLowerCase())) {
      return abbr;
    }
  }

  // Try standalone state abbreviation
  const tokens = normalized.split(/[\s,]+/);
  for (const token of tokens) {
    const upper = token.toUpperCase();
    if (validStates.has(upper) && upper.length === 2) {
      return upper;
    }
  }

  return null;
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
        location: true
      }
    });

    // Count jobs by state
    const stateCounts: Record<string, number> = {};

    for (const job of onsiteJobs) {
      const state = extractState(job.location);
      if (state) {
        stateCounts[state] = (stateCounts[state] || 0) + 1;
      }
    }

    // Convert to array format for ECharts
    const data = Object.entries(stateCounts).map(([state, count]) => ({
      name: state,
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

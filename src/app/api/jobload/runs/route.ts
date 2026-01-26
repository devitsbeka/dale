/**
 * List All Runs API
 * GET /api/jobload/runs - Get all runs from Apify for configured actors
 */

import { NextRequest, NextResponse } from 'next/server';
import { APIFY_ACTORS } from '@/lib/apify/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const apiToken = request.headers.get('X-Apify-Token') || process.env.APIFY_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        { success: false, error: 'API token required' },
        { status: 401 }
      );
    }

    // Fetch runs for each configured actor
    const allRuns: any[] = [];

    for (const actor of APIFY_ACTORS) {
      try {
        const response = await fetch(
          `https://api.apify.com/v2/acts/${actor.actorId}/runs?token=${apiToken}&limit=50&desc=true`,
          { next: { revalidate: 0 } }
        );

        if (!response.ok) {
          console.error(`Failed to fetch runs for ${actor.name}:`, response.statusText);
          continue;
        }

        const data = await response.json();

        // Add actor name to each run
        const runsWithActorName = data.data.items.map((run: any) => ({
          ...run,
          actorName: actor.name,
        }));

        allRuns.push(...runsWithActorName);
      } catch (error) {
        console.error(`Error fetching runs for ${actor.name}:`, error);
      }
    }

    // Sort by start time (most recent first)
    allRuns.sort((a, b) => {
      const dateA = new Date(a.startedAt).getTime();
      const dateB = new Date(b.startedAt).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      runs: allRuns,
      totalRuns: allRuns.length,
    });
  } catch (error) {
    console.error('Error fetching runs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch runs',
      },
      { status: 500 }
    );
  }
}

/**
 * Job Load Trigger API
 * POST /api/jobload/trigger - Start loading jobs from Apify actors
 */

import { NextRequest, NextResponse } from 'next/server';
import { apifyJobLoader, APIFY_ACTORS } from '@/lib/apify';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { actorId } = body;

    // If specific actor requested, start just that one
    if (actorId) {
      const actor = APIFY_ACTORS.find((a) => a.actorId === actorId);
      if (!actor) {
        return NextResponse.json(
          { success: false, error: 'Unknown actor ID' },
          { status: 400 }
        );
      }

      const runId = await apifyJobLoader.startLoad(actorId, actor.input);

      return NextResponse.json({
        success: true,
        message: `Started loading jobs from ${actor.name}`,
        runId,
        actor: {
          id: actor.actorId,
          name: actor.name,
          maxResults: actor.maxResults,
          estimatedCost: actor.estimatedCost,
        },
      });
    }

    // Start all actors
    const runIds = await apifyJobLoader.startAllLoads();

    return NextResponse.json({
      success: true,
      message: `Started loading jobs from ${APIFY_ACTORS.length} actors`,
      runIds,
      actors: APIFY_ACTORS.map((a) => ({
        id: a.actorId,
        name: a.name,
        maxResults: a.maxResults,
        estimatedCost: a.estimatedCost,
      })),
      totalEstimatedCost: APIFY_ACTORS.reduce((sum, a) => sum + a.estimatedCost, 0),
    });
  } catch (error) {
    console.error('Error triggering job load:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to trigger job load',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available actors
  return NextResponse.json({
    actors: APIFY_ACTORS.map((a) => ({
      id: a.actorId,
      name: a.name,
      maxResults: a.maxResults,
      estimatedCost: a.estimatedCost,
    })),
    totalEstimatedCost: APIFY_ACTORS.reduce((sum, a) => sum + a.estimatedCost, 0),
  });
}

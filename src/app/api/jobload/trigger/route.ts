/**
 * Job Load Trigger API
 * POST /api/jobload/trigger - Start loading jobs from Apify actors
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApifyClient } from '@/lib/apify/client';
import { ApifyJobLoader, APIFY_ACTORS } from '@/lib/apify';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Get API token from header
    const apiToken = request.headers.get('X-Apify-Token') || process.env.APIFY_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'API token required. Please configure your Apify API token in settings.',
        },
        { status: 401 }
      );
    }

    // Create client with token
    const client = new ApifyClient(apiToken);

    // Test API token by getting usage stats
    try {
      await client.getUsageStats();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid API token. Please check your Apify API token.',
        },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { actorId, actorConfigs } = body;

    // Create job loader with the API token
    const jobLoader = new ApifyJobLoader(apiToken);

    // If specific actor requested, start just that one
    if (actorId) {
      const actor = APIFY_ACTORS.find((a) => a.actorId === actorId);
      if (!actor) {
        return NextResponse.json(
          { success: false, error: 'Unknown actor ID' },
          { status: 400 }
        );
      }

      const runId = await jobLoader.startLoad(actorId, actor.input);

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

    // If custom actor configurations provided, use those
    if (actorConfigs && Array.isArray(actorConfigs) && actorConfigs.length > 0) {
      const runIds: string[] = [];
      const actorsStarted = [];

      for (const config of actorConfigs) {
        const actor = APIFY_ACTORS.find((a) => a.actorId === config.actorId);
        if (!actor) {
          console.warn(`Unknown actor ID: ${config.actorId}`);
          continue;
        }

        // Create input with custom maxResults
        const customInput = {
          ...actor.input,
          maxItems: config.maxResults,
          maxResults: config.maxResults,
        };

        const runId = await jobLoader.startLoad(actor.actorId, customInput);
        runIds.push(runId);
        actorsStarted.push({
          id: actor.actorId,
          name: actor.name,
          maxResults: config.maxResults,
          estimatedCost: (actor.estimatedCost / actor.maxResults) * config.maxResults,
        });
      }

      const totalEstimatedCost = actorsStarted.reduce(
        (sum, a) => sum + a.estimatedCost,
        0
      );

      return NextResponse.json({
        success: true,
        message: `Started loading jobs from ${actorsStarted.length} actors`,
        runIds,
        actors: actorsStarted,
        totalEstimatedCost,
      });
    }

    // Start all actors with default settings (fallback)
    const runIds = await jobLoader.startAllLoads();

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

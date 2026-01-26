/**
 * Apify Client Service
 * Handles actor runs, monitoring, and data fetching
 */

import { ApifyRun, ApifyDatasetItem, ApifyActorConfig } from './types';

const APIFY_API_URL = 'https://api.apify.com/v2';
const APIFY_TOKEN = process.env.APIFY_API_TOKEN;

export class ApifyClient {
  private token: string;

  constructor(token?: string) {
    this.token = token || APIFY_TOKEN || '';
    if (!this.token) {
      console.warn('Warning: APIFY_API_TOKEN not set. Please add it to .env.local');
    }
  }

  /**
   * Start an actor run
   */
  async startActor(actorId: string, input: Record<string, any>): Promise<ApifyRun> {
    const response = await fetch(
      `${APIFY_API_URL}/acts/${actorId}/runs?token=${this.token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to start actor: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Get run status (overloaded)
   */
  async getRun(runIdOrActorId: string, runId?: string): Promise<ApifyRun> {
    // If only one parameter, fetch by runId directly
    if (!runId) {
      const response = await fetch(
        `${APIFY_API_URL}/actor-runs/${runIdOrActorId}?token=${this.token}`
      );

      if (!response.ok) {
        throw new Error(`Failed to get run status: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    }

    // If two parameters, fetch by actorId and runId
    const response = await fetch(
      `${APIFY_API_URL}/acts/${runIdOrActorId}/runs/${runId}?token=${this.token}`
    );

    if (!response.ok) {
      throw new Error(`Failed to get run status: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Wait for run to complete (with timeout)
   */
  async waitForRun(
    actorId: string,
    runId: string,
    options: { maxWaitTime?: number; checkInterval?: number } = {}
  ): Promise<ApifyRun> {
    const maxWaitTime = options.maxWaitTime || 300000; // 5 minutes default
    const checkInterval = options.checkInterval || 5000; // 5 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const run = await this.getRun(actorId, runId);

      if (
        run.status === 'SUCCEEDED' ||
        run.status === 'FAILED' ||
        run.status === 'TIMED-OUT' ||
        run.status === 'ABORTED'
      ) {
        return run;
      }

      await new Promise((resolve) => setTimeout(resolve, checkInterval));
    }

    throw new Error('Run timed out waiting for completion');
  }

  /**
   * Get dataset items (paginated)
   */
  async getDatasetItems(
    datasetId: string,
    options: { offset?: number; limit?: number } = {}
  ): Promise<ApifyDatasetItem[]> {
    const offset = options.offset || 0;
    const limit = options.limit || 1000;

    const response = await fetch(
      `${APIFY_API_URL}/datasets/${datasetId}/items?token=${this.token}&offset=${offset}&limit=${limit}&format=json`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch dataset items: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get all dataset items (handles pagination)
   */
  async getAllDatasetItems(datasetId: string): Promise<ApifyDatasetItem[]> {
    const allItems: ApifyDatasetItem[] = [];
    let offset = 0;
    const limit = 1000;

    while (true) {
      const items = await this.getDatasetItems(datasetId, { offset, limit });

      if (items.length === 0) {
        break;
      }

      allItems.push(...items);
      offset += items.length;

      // Safety limit
      if (offset >= 10000) {
        console.warn('Reached safety limit of 10,000 items');
        break;
      }
    }

    return allItems;
  }

  /**
   * Run actor and get results
   */
  async runAndFetch(
    actorId: string,
    input: Record<string, any>,
    onProgress?: (status: string) => void
  ): Promise<ApifyDatasetItem[]> {
    // Start the actor
    onProgress?.('Starting actor...');
    const run = await this.startActor(actorId, input);

    // Wait for completion
    onProgress?.('Running actor...');
    const completedRun = await this.waitForRun(actorId, run.id, {
      maxWaitTime: 600000, // 10 minutes
      checkInterval: 10000, // 10 seconds
    });

    if (completedRun.status !== 'SUCCEEDED') {
      throw new Error(`Actor run failed with status: ${completedRun.status}`);
    }

    // Fetch results
    onProgress?.('Fetching results...');
    const items = await this.getAllDatasetItems(completedRun.defaultDatasetId);

    onProgress?.(`Completed! Fetched ${items.length} items`);
    return items;
  }

  /**
   * Get account usage statistics
   */
  async getUsageStats(): Promise<{
    creditsUsed: number;
    creditsRemaining: number;
    computeUnits: number;
  }> {
    try {
      const response = await fetch(
        `${APIFY_API_URL}/user?token=${this.token}`
      );

      if (!response.ok) {
        return { creditsUsed: 0, creditsRemaining: 0, computeUnits: 0 };
      }

      const data = await response.json();
      const user = data.data;

      return {
        creditsUsed: user.usage?.monthlyUsage || 0,
        creditsRemaining: user.plan?.monthlyCredits || 0,
        computeUnits: user.usage?.computeUnits || 0,
      };
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return { creditsUsed: 0, creditsRemaining: 0, computeUnits: 0 };
    }
  }
}

export const apifyClient = new ApifyClient();

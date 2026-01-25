/**
 * Apify Integration Types
 */

export interface ApifyActorConfig {
  actorId: string;
  name: string;
  maxResults: number;
  estimatedCost: number;
  input: Record<string, any>;
}

export interface ApifyRun {
  id: string;
  actorId: string;
  status: 'READY' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'TIMED-OUT' | 'ABORTED';
  startedAt: string;
  finishedAt?: string;
  defaultDatasetId: string;
  stats: {
    computeUnits: number;
    memorySizeMb: number;
  };
}

export interface ApifyJobLoadStatus {
  runId: string;
  actorName: string;
  status: 'queued' | 'running' | 'processing' | 'completed' | 'failed';
  progress: number;
  jobsFetched: number;
  jobsSynced: number;
  errors: string[];
  startedAt: Date;
  completedAt?: Date;
  estimatedCost: number;
}

export interface ApifyDatasetItem {
  id: string;
  [key: string]: any;
}

export const APIFY_ACTORS: ApifyActorConfig[] = [
  {
    actorId: 'curious_coder/linkedin-jobs-scraper',
    name: 'LinkedIn Jobs',
    maxResults: 5000,
    estimatedCost: 5.0, // $1 per 1000 results
    input: {
      maxItems: 5000,
      searchQuery: 'software engineer remote',
      location: 'Worldwide',
      datePosted: 'week',
    },
  },
  {
    actorId: 'bytepulselabs/greenhouse-job-scraper',
    name: 'Greenhouse Jobs',
    maxResults: 2500,
    estimatedCost: 5.0, // $2 per 1000 results
    input: {
      maxResults: 2500,
      startUrls: [
        { url: 'https://boards.greenhouse.io/embed/job_board?for=airbnb' },
        { url: 'https://boards.greenhouse.io/embed/job_board?for=stripe' },
        { url: 'https://boards.greenhouse.io/embed/job_board?for=gitlab' },
      ],
    },
  },
  {
    actorId: 'misceres/indeed-scraper',
    name: 'Indeed Jobs',
    maxResults: 1000,
    estimatedCost: 2.0, // Estimated based on compute units
    input: {
      position: 'software engineer',
      location: 'remote',
      maxItems: 1000,
      country: 'US',
    },
  },
];

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
    actorId: 'hKByXkMQaC5Qt9UMN', // curious_coder/linkedin-jobs-scraper
    name: 'LinkedIn Jobs',
    maxResults: 5000,
    estimatedCost: 5.0, // $1 per 1000 results
    input: {
      count: 5000,
      scrapeCompany: true,
      urls: [
        'https://www.linkedin.com/jobs/search/?keywords=software%20engineer&location=Remote',
        'https://www.linkedin.com/jobs/search/?keywords=developer&location=Remote',
      ],
    },
  },
  {
    actorId: 'N5bHfOymnV2CDodyf', // bytepulselabs/greenhouse-job-scraper
    name: 'Greenhouse Jobs',
    maxResults: 2500,
    estimatedCost: 5.0, // $2 per 1000 results
    input: {
      proxy: {
        useApifyProxy: true,
      },
      urls: [
        { url: 'https://job-boards.greenhouse.io/stripe' },
        { url: 'https://job-boards.greenhouse.io/notion' },
        { url: 'https://job-boards.greenhouse.io/gitlab' },
        { url: 'https://job-boards.greenhouse.io/airbnb' },
      ],
    },
  },
  {
    actorId: 'hMvNSpz3JnHgl5jkh', // misceres/indeed-scraper
    name: 'Indeed Jobs',
    maxResults: 1000,
    estimatedCost: 2.0, // Estimated based on compute units
    input: {
      country: 'US',
      location: 'Remote',
      position: 'software engineer',
      maxItemsPerSearch: 1000,
      followApplyRedirects: true,
      parseCompanyDetails: true,
      saveOnlyUniqueItems: true,
    },
  },
];

import { MeiliSearch } from "meilisearch";

function createSearchClient() {
  const url = process.env.MEILISEARCH_URL;
  const apiKey = process.env.MEILISEARCH_API_KEY;

  if (!url) return null;

  return new MeiliSearch({
    host: url,
    apiKey: apiKey || undefined,
  });
}

export const searchClient = createSearchClient();

// Index names
export const JOBS_INDEX = "jobs";
export const SKILLS_INDEX = "skills";

// Job search document type
export interface JobSearchDocument {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  remotePolicy: string;
  type: string;
  level: string;
  description: string;
  salaryMin: number | null;
  salaryMax: number | null;
  skills: string[];
  postedAt: number;
  featured: boolean;
}

// Initialize indexes
export async function initSearchIndexes() {
  if (!searchClient) return;

  try {
    await searchClient.createIndex(JOBS_INDEX, { primaryKey: "id" });
    const jobsIndex = searchClient.index(JOBS_INDEX);
    await jobsIndex.updateSearchableAttributes([
      "title",
      "company",
      "description",
      "skills",
      "location",
    ]);
    await jobsIndex.updateFilterableAttributes([
      "country",
      "remotePolicy",
      "type",
      "level",
      "featured",
    ]);
    await jobsIndex.updateSortableAttributes(["postedAt", "salaryMax"]);
  } catch {
    // Index may already exist
  }

  try {
    await searchClient.createIndex(SKILLS_INDEX, { primaryKey: "id" });
    const skillsIndex = searchClient.index(SKILLS_INDEX);
    await skillsIndex.updateSearchableAttributes(["name", "description"]);
    await skillsIndex.updateFilterableAttributes(["category"]);
    await skillsIndex.updateSortableAttributes(["demandScore"]);
  } catch {
    // Index may already exist
  }
}

// Sync jobs to search index
export async function syncJobsToSearch(
  jobs: JobSearchDocument[]
): Promise<void> {
  if (!searchClient) return;
  const index = searchClient.index(JOBS_INDEX);
  await index.addDocuments(jobs);
}

// Search jobs
export async function searchJobs(
  query: string,
  options?: {
    filter?: string;
    limit?: number;
    offset?: number;
  }
) {
  if (!searchClient) return null;

  const index = searchClient.index(JOBS_INDEX);
  return index.search(query, {
    limit: options?.limit ?? 20,
    offset: options?.offset ?? 0,
    filter: options?.filter,
  });
}

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { SearchLg } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { JobCard } from "@/components/jobs/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { trpc } from "@/lib/trpc";

export default function JobsPage() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{
    remotePolicy?: string;
    type?: string;
    level?: string;
  }>({});

  const { data, isLoading } = trpc.job.list.useQuery({
    page,
    pageSize: 20,
    search: search || undefined,
    ...filters,
  } as Parameters<typeof trpc.job.list.useQuery>[0]);

  const jobIds = data?.items.map((j) => j.id) ?? [];
  const { data: matchScores } = trpc.job.batchMatchScores.useQuery(
    { jobIds },
    { enabled: !!session && jobIds.length > 0 }
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Jobs</h1>
        <p className="text-md text-tertiary">
          Browse {data?.total ?? "..."} opportunities from top companies
        </p>
      </div>

      {/* Search */}
      <div className="mt-6 flex gap-3">
        <div className="relative flex-1">
          <SearchLg className="absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-fg-quaternary" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search jobs, companies, skills..."
            className="w-full rounded-lg border border-primary bg-primary py-2.5 pr-3.5 pl-11 text-md text-primary shadow-xs outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-solid"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4">
        <JobFilters
          filters={filters}
          onChange={(f) => {
            setFilters(f);
            setPage(1);
          }}
        />
      </div>

      {/* Results */}
      <div className="mt-6 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl bg-secondary"
              />
            ))}
          </div>
        ) : data?.items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-secondary py-16">
            <p className="text-lg font-semibold text-primary">No jobs found</p>
            <p className="text-sm text-tertiary">Try adjusting your search or filters</p>
          </div>
        ) : (
          data?.items.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              title={job.title}
              company={job.company}
              companyDomain={job.companyDomain}
              location={job.location}
              remotePolicy={job.remotePolicy}
              type={job.type}
              level={job.level}
              salaryMin={job.salaryMin}
              salaryMax={job.salaryMax}
              salaryCurrency={job.salaryCurrency}
              postedAt={job.postedAt}
              featured={job.featured}
              skills={job.skills}
              matchScore={matchScores?.[job.id] ?? null}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <Button
            color="secondary"
            size="md"
            isDisabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-tertiary">
            Page {page} of {data.totalPages}
          </span>
          <Button
            color="secondary"
            size="md"
            isDisabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

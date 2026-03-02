"use client";

import { useState } from "react";
import { SearchLg } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { getLogoUrl } from "@/lib/constants";
import { trpc } from "@/lib/trpc";

function HealthGauge({ score, label }: { score: number | null; label: string }) {
  const value = score ?? 0;
  const color =
    value >= 80 ? "text-success-primary" :
    value >= 60 ? "text-brand-primary" :
    value >= 40 ? "text-warning-primary" :
    "text-error-primary";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`text-lg font-bold ${color}`}>{value > 0 ? value : "—"}</div>
      <p className="text-[10px] text-tertiary">{label}</p>
    </div>
  );
}

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = trpc.company.list.useQuery({
    search: search || undefined,
    page,
    pageSize: 20,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-sm font-semibold text-primary">Company Intelligence</h1>
        <p className="text-md text-tertiary">
          Explore companies, health scores, and compensation data
        </p>
      </div>

      {/* Search */}
      <div className="mt-6 relative">
        <SearchLg className="absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-fg-quaternary" />
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search companies..."
          className="w-full rounded-lg border border-primary bg-primary py-2.5 pr-3.5 pl-11 text-md text-primary shadow-xs outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-solid"
        />
      </div>

      {/* Company cards */}
      <div className="mt-6 flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-secondary" />
          ))
        ) : data?.items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-secondary py-16">
            <p className="text-lg font-semibold text-primary">No companies found</p>
            <p className="text-sm text-tertiary">Try adjusting your search</p>
          </div>
        ) : (
          data?.items.map((company) => (
            <a
              key={company.id}
              href={`/companies/${company.id}`}
              className="group flex items-center gap-4 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary transition hover:shadow-md"
            >
              {company.domain && (
                <img
                  src={getLogoUrl(company.domain)}
                  alt={company.name}
                  className="size-12 rounded-lg bg-secondary object-contain"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-md font-semibold text-primary group-hover:text-brand-secondary">
                  {company.name}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-tertiary">
                  {company.industry && <span>{company.industry}</span>}
                  {company.headquarters && (
                    <>
                      <span className="text-quaternary">&middot;</span>
                      <span>{company.headquarters}</span>
                    </>
                  )}
                  {company.size && (
                    <>
                      <span className="text-quaternary">&middot;</span>
                      <Badge color="gray" size="sm">{company.size}</Badge>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <HealthGauge score={company.healthScore} label="Health" />
                <HealthGauge score={company.cultureScore} label="Culture" />
                <HealthGauge score={company.growthScore} label="Growth" />
              </div>
            </a>
          ))
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <Button color="secondary" size="md" isDisabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-tertiary">Page {page} of {data.totalPages}</span>
          <Button color="secondary" size="md" isDisabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

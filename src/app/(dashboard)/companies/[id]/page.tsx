"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { JobCard } from "@/components/jobs/job-card";
import { getLogoUrl } from "@/lib/constants";
import { trpc } from "@/lib/trpc";

function ScoreBar({ label, score }: { label: string; score: number | null }) {
  const value = score ?? 0;
  const color =
    value >= 80 ? "bg-utility-success-500" :
    value >= 60 ? "bg-brand-solid" :
    value >= 40 ? "bg-utility-warning-500" :
    "bg-utility-error-500";

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-tertiary">{label}</span>
        <span className="font-medium text-primary">{value > 0 ? value : "N/A"}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = trpc.company.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
        <div className="mt-6 h-64 animate-pulse rounded-xl bg-secondary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-display-sm font-semibold text-primary">Company not found</h1>
        <Button color="secondary" size="md" onClick={() => router.push("/companies")}>
          Back to companies
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-tertiary hover:text-secondary"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-start gap-4">
        {data.domain && (
          <img
            src={getLogoUrl(data.domain)}
            alt={data.name}
            className="size-16 rounded-xl bg-secondary object-contain"
          />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-display-xs font-semibold text-primary">{data.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-tertiary">
            {data.industry && <Badge color="gray" size="md">{data.industry}</Badge>}
            {data.headquarters && <span>{data.headquarters}</span>}
            {data.size && (
              <>
                <span className="text-quaternary">&middot;</span>
                <span>{data.size} employees</span>
              </>
            )}
            {data.founded && (
              <>
                <span className="text-quaternary">&middot;</span>
                <span>Founded {data.founded}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {data.description && (
        <p className="mt-4 text-md leading-relaxed text-secondary">{data.description}</p>
      )}

      {/* Health Scores */}
      <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
        <h2 className="text-lg font-semibold text-primary">Company Health</h2>
        <div className="mt-4 flex flex-col gap-4">
          <ScoreBar label="Overall Health" score={data.healthScore} />
          <ScoreBar label="Culture" score={data.cultureScore} />
          <ScoreBar label="Growth" score={data.growthScore} />
        </div>
      </div>

      {/* Salary profiles */}
      {data.salaryProfiles.length > 0 && (
        <div className="mt-8 rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
          <h2 className="text-lg font-semibold text-primary">Compensation Data</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary text-left">
                  <th className="pb-3 pr-4 font-medium text-tertiary">Title</th>
                  <th className="pb-3 pr-4 font-medium text-tertiary">Level</th>
                  <th className="pb-3 pr-4 font-medium text-tertiary">Location</th>
                  <th className="pb-3 pr-4 text-right font-medium text-tertiary">Base P50</th>
                  <th className="pb-3 text-right font-medium text-tertiary">Total P50</th>
                </tr>
              </thead>
              <tbody>
                {data.salaryProfiles.map((sp) => (
                  <tr key={sp.id} className="border-b border-secondary">
                    <td className="py-2.5 pr-4 font-medium text-primary">{sp.title}</td>
                    <td className="py-2.5 pr-4"><Badge color="gray" size="sm">{sp.level}</Badge></td>
                    <td className="py-2.5 pr-4 text-tertiary">{sp.location}</td>
                    <td className="py-2.5 pr-4 text-right font-medium text-primary">
                      ${(sp.baseSalaryP50 / 1000).toFixed(0)}k
                    </td>
                    <td className="py-2.5 text-right font-medium text-success-primary">
                      ${(sp.totalCompP50 / 1000).toFixed(0)}k
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Open Jobs */}
      {data.jobs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary">Open Positions ({data.jobs.length})</h2>
          <div className="mt-4 flex flex-col gap-3">
            {data.jobs.map((job) => (
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

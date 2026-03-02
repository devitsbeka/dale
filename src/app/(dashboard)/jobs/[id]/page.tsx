"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, BookmarkCheck, Briefcase01, CheckCircle, MarkerPin01, Send01, XCircle } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { getLogoUrl, JOB_LEVELS, REMOTE_POLICIES } from "@/lib/constants";
import { trpc } from "@/lib/trpc";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const { data: job, isLoading } = trpc.job.getById.useQuery({ id });
  const { data: matchData } = trpc.job.matchScore.useQuery(
    { jobId: id },
    { enabled: !!session }
  );
  const saveMutation = trpc.job.save.useMutation();
  const applyMutation = trpc.job.applyToJob.useMutation();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
        <div className="mt-6 h-64 animate-pulse rounded-xl bg-secondary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-display-sm font-semibold text-primary">Job not found</h1>
        <Button color="secondary" size="md" onClick={() => router.push("/jobs")}>
          Back to jobs
        </Button>
      </div>
    );
  }

  const salary =
    job.salaryMin && job.salaryMax
      ? `$${Math.round(job.salaryMin / 1000)}k – $${Math.round(job.salaryMax / 1000)}k`
      : job.salaryMin
        ? `$${Math.round(job.salaryMin / 1000)}k+`
        : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-tertiary hover:text-secondary"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      {/* Header */}
      <div className="flex items-start gap-4">
        {job.companyDomain && (
          <img
            src={getLogoUrl(job.companyDomain)}
            alt={job.company}
            className="size-14 rounded-xl bg-secondary object-contain"
          />
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-display-xs font-semibold text-primary">{job.title}</h1>
          <p className="mt-1 text-md text-tertiary">{job.company}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge color="gray" size="md">
          <MarkerPin01 className="mr-1 size-3.5" />
          {job.location}
        </Badge>
        <Badge
          color={job.remotePolicy === "remote" ? "success" : job.remotePolicy === "hybrid" ? "blue" : "gray"}
          size="md"
        >
          {REMOTE_POLICIES[job.remotePolicy as keyof typeof REMOTE_POLICIES]}
        </Badge>
        <Badge color="gray" size="md">
          <Briefcase01 className="mr-1 size-3.5" />
          {JOB_LEVELS[job.level as keyof typeof JOB_LEVELS]}
        </Badge>
        {salary && (
          <Badge color="purple" size="md">{salary}/yr</Badge>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button
          color="primary"
          size="lg"
          iconLeading={Send01}
          isLoading={applyMutation.isPending}
          isDisabled={applied}
          onClick={async () => {
            try {
              await applyMutation.mutateAsync({ jobId: id });
              setApplied(true);
            } catch {
              // Already applied or not authenticated
            }
          }}
          className="flex-1"
        >
          {applied ? "Applied" : "Apply Now"}
        </Button>
        <Button
          color="secondary"
          size="lg"
          iconLeading={BookmarkCheck}
          isLoading={saveMutation.isPending}
          isDisabled={saved}
          onClick={async () => {
            try {
              await saveMutation.mutateAsync({ jobId: id });
              setSaved(true);
            } catch {
              // Already saved or not authenticated
            }
          }}
        >
          {saved ? "Saved" : "Save"}
        </Button>
      </div>

      {/* Match Breakdown */}
      {matchData && (
        <div className="mt-8 rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">Your Match</h2>
            <span className={`text-display-xs font-bold ${
              matchData.overall >= 80 ? "text-success-primary" :
              matchData.overall >= 60 ? "text-brand-primary" :
              matchData.overall >= 40 ? "text-warning-primary" :
              "text-error-primary"
            }`}>
              {matchData.overall}%
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {/* Skills */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary">Skills</span>
                <span className="text-xs text-tertiary">
                  {matchData.skills.matched.length}/{matchData.skills.total} matched
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand-solid"
                    style={{ width: `${matchData.skills.score}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-medium text-tertiary">{matchData.skills.score}%</span>
              </div>
            </div>

            {/* Salary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary">Salary</span>
                <span className="text-xs text-tertiary">
                  {matchData.salary.inRange ? "In range" : "Check range"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand-solid"
                    style={{ width: `${matchData.salary.score}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-medium text-tertiary">{matchData.salary.score}%</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary">Location</span>
                <span className="text-xs text-tertiary capitalize">{matchData.location.match}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand-solid"
                    style={{ width: `${matchData.location.score}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-medium text-tertiary">{matchData.location.score}%</span>
              </div>
            </div>

            {/* Level */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary">Level</span>
                <span className="text-xs text-tertiary capitalize">{matchData.level.match}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand-solid"
                    style={{ width: `${matchData.level.score}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-medium text-tertiary">{matchData.level.score}%</span>
              </div>
            </div>
          </div>

          {/* Matched / Missing skills */}
          {(matchData.skills.matched.length > 0 || matchData.skills.missing.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-secondary pt-4">
              {matchData.skills.matched.map((s) => (
                <Badge key={s} color="success" size="sm">
                  <CheckCircle className="mr-1 size-3" />
                  {s}
                </Badge>
              ))}
              {matchData.skills.missing.map((s) => (
                <Badge key={s} color="error" size="sm">
                  <XCircle className="mr-1 size-3" />
                  {s}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {job.skills.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary">Required Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {job.skills.map(({ skill }) => (
              <Badge key={skill.slug} color="brand" size="md">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-primary">About this role</h2>
        <div className="mt-3 text-md leading-relaxed text-secondary whitespace-pre-wrap">
          {job.description}
        </div>
      </div>

      {/* Requirements */}
      {job.requirements.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary">Requirements</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-md text-secondary">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-solid" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Company info */}
      <div className="mt-8 rounded-xl bg-secondary p-5">
        <div className="flex items-center gap-3">
          {job.companyDomain && (
            <img
              src={getLogoUrl(job.companyDomain)}
              alt={job.company}
              className="size-10 rounded-lg bg-primary object-contain"
            />
          )}
          <div>
            <p className="text-md font-semibold text-primary">{job.company}</p>
            {job.companyDomain && (
              <p className="text-sm text-tertiary">{job.companyDomain}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

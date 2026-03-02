"use client";

import { Badge } from "@/components/base/badges/badges";
import { getLogoUrl } from "@/lib/constants";
import type { RemotePolicy, JobType, JobLevel } from "@/generated/prisma/client";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  companyDomain: string | null;
  location: string;
  remotePolicy: RemotePolicy;
  type: JobType;
  level: JobLevel;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  postedAt: Date;
  featured: boolean;
  skills?: Array<{ skill: { name: string; slug: string } }>;
}

const remoteBadgeColor = {
  remote: "success" as const,
  hybrid: "blue" as const,
  onsite: "gray" as const,
};

const levelLabels: Record<string, string> = {
  intern: "Intern",
  junior: "Junior",
  mid: "Mid",
  senior: "Senior",
  lead: "Lead",
  principal: "Principal",
  director: "Director",
  vp: "VP",
  c_level: "C-Level",
};

function formatSalary(min: number | null, max: number | null, currency: string) {
  if (!min && !max) return null;
  const fmt = (n: number) => {
    if (currency === "USD") return `$${Math.round(n / 1000)}k`;
    return `${Math.round(n / 1000)}k ${currency}`;
  };
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}

function timeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function JobCard({
  id,
  title,
  company,
  companyDomain,
  location,
  remotePolicy,
  type,
  level,
  salaryMin,
  salaryMax,
  salaryCurrency,
  postedAt,
  featured,
  skills,
}: JobCardProps) {
  const salary = formatSalary(salaryMin, salaryMax, salaryCurrency);

  return (
    <a
      href={`/jobs/${id}`}
      className={`group flex flex-col gap-3 rounded-xl bg-primary p-5 shadow-xs ring-1 transition hover:shadow-md ${
        featured ? "ring-brand-solid/30" : "ring-secondary"
      }`}
    >
      <div className="flex items-start gap-3">
        {companyDomain && (
          <img
            src={getLogoUrl(companyDomain)}
            alt={company}
            className="size-10 rounded-lg bg-secondary object-contain"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-md font-semibold text-primary group-hover:text-brand-secondary">
            {title}
          </p>
          <p className="text-sm text-tertiary">{company}</p>
        </div>
        {featured && (
          <Badge color="warning" size="sm">Featured</Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-tertiary">
        <span>{location}</span>
        <span className="text-quaternary">&middot;</span>
        <Badge color={remoteBadgeColor[remotePolicy]} size="sm">{remotePolicy}</Badge>
        <span className="text-quaternary">&middot;</span>
        <span>{levelLabels[level] ?? level}</span>
        {salary && (
          <>
            <span className="text-quaternary">&middot;</span>
            <span className="font-medium text-primary">{salary}</span>
          </>
        )}
      </div>

      {skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 5).map(({ skill }) => (
            <Badge key={skill.slug} color="gray" size="sm">{skill.name}</Badge>
          ))}
          {skills.length > 5 && (
            <Badge color="gray" size="sm">+{skills.length - 5}</Badge>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-quaternary">
        <span>{type.replace("_", "-")}</span>
        <span>{timeAgo(postedAt)}</span>
      </div>
    </a>
  );
}

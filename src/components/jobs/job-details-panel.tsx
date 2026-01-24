'use client';

import { useState } from 'react';
import {
  X,
  Bookmark,
  MarkerPin01,
  Building07,
  Clock,
  CurrencyDollar,
  Globe02,
  ArrowUpRight,
  Briefcase01,
  Share07,
  LinkExternal01,
  CheckCircle,
  Users01,
  Calendar,
  Award01,
} from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { Badge } from '@/components/base/badges/badges';
import { cx } from '@/utils/cx';
import type { Job, LocationType } from '@/types/job';

interface JobDetailsPanelProps {
  job: Job;
  isSaved?: boolean;
  hasApplied?: boolean;
  onClose: () => void;
  onSave: (job: Job) => void;
  onApply: (job: Job) => void;
}

function formatSalary(min?: number | null, max?: number | null, currency?: string | null): string {
  if (!min && !max) return 'Not specified';

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 0,
  });

  if (min && max && min !== max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  return formatter.format(min || max || 0);
}

function formatDate(dateString?: string | Date | null): string {
  if (!dateString) return 'Recently';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const locationTypeColors: Record<LocationType, 'success' | 'blue' | 'purple'> = {
  remote: 'success',
  hybrid: 'purple',
  onsite: 'blue',
};

const locationTypeLabels: Record<LocationType, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
};

export function JobDetailsPanel({
  job,
  isSaved = false,
  hasApplied = false,
  onClose,
  onSave,
  onApply,
}: JobDetailsPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = job.applyUrl;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(url, '_blank');
    }
  };

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-secondary bg-primary">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-secondary p-6">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="size-16 rounded-xl border border-secondary object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div
              className={cx(
                'flex size-16 items-center justify-center rounded-xl bg-gray-100 text-2xl font-bold text-gray-600',
                job.companyLogo && 'hidden'
              )}
            >
              {job.company.charAt(0).toUpperCase()}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-primary">{job.title}</h2>
            <p className="mt-1 text-base text-secondary">{job.company}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge size="sm" color={locationTypeColors[job.locationType]}>
                {locationTypeLabels[job.locationType]}
              </Badge>
              {job.employmentType && (
                <Badge size="sm" color="gray">
                  {job.employmentType.charAt(0).toUpperCase() +
                    job.employmentType.slice(1).replace('-', ' ')}
                </Badge>
              )}
              {job.experienceLevel && job.experienceLevel !== 'any' && (
                <Badge size="sm" color="gray">
                  {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Quick Info Bar */}
      <div className="grid grid-cols-2 gap-4 border-b border-secondary bg-gray-50 p-4 sm:grid-cols-4">
        <div className="flex items-center gap-2">
          <MarkerPin01 className="size-5 text-gray-400" />
          <div>
            <p className="text-xs text-tertiary">Location</p>
            <p className="text-sm font-medium text-primary">{job.location || 'Worldwide'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CurrencyDollar className="size-5 text-gray-400" />
          <div>
            <p className="text-xs text-tertiary">Salary</p>
            <p className="text-sm font-medium text-primary">{salary}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-gray-400" />
          <div>
            <p className="text-xs text-tertiary">Posted</p>
            <p className="text-sm font-medium text-primary">{formatDate(job.publishedAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Globe02 className="size-5 text-gray-400" />
          <div>
            <p className="text-xs text-tertiary">Source</p>
            <p className="text-sm font-medium text-primary">
              {job.source.charAt(0).toUpperCase() + job.source.slice(1)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Skills/Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <Award01 className="size-4" />
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Description */}
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <Briefcase01 className="size-4" />
            Job Description
          </h3>
          {job.descriptionHtml ? (
            <div
              className="prose prose-sm max-w-none text-secondary prose-headings:text-primary prose-a:text-brand-600"
              dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
            />
          ) : (
            <div className="whitespace-pre-wrap text-sm text-secondary">{job.description}</div>
          )}
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <Users01 className="size-4" />
              Requirements
            </h3>
            <div className="whitespace-pre-wrap text-sm text-secondary">{job.requirements}</div>
          </div>
        )}

        {/* Benefits */}
        {job.benefits && (
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
              <Award01 className="size-4" />
              Benefits
            </h3>
            <div className="whitespace-pre-wrap text-sm text-secondary">{job.benefits}</div>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="flex items-center justify-between border-t border-secondary bg-gray-50 p-4">
        <div className="flex gap-2">
          <Button
            color="secondary"
            size="md"
            onClick={() => onSave(job)}
            iconLeading={Bookmark}
            className={cx(isSaved && 'bg-brand-50 text-brand-600 hover:bg-brand-100')}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Button
            color="secondary"
            size="md"
            onClick={handleShare}
            iconLeading={copied ? CheckCircle : Share07}
          >
            {copied ? 'Copied!' : 'Share'}
          </Button>
          <Button
            color="secondary"
            size="md"
            onClick={() => window.open(job.applyUrl, '_blank')}
            iconLeading={LinkExternal01}
          >
            View Original
          </Button>
        </div>

        {hasApplied ? (
          <Badge size="lg" color="success">
            <CheckCircle className="mr-1 size-4" />
            Applied
          </Badge>
        ) : (
          <Button color="primary" size="lg" onClick={() => onApply(job)} iconTrailing={ArrowUpRight}>
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
}

export default JobDetailsPanel;

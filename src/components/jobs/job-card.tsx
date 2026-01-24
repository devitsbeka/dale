'use client';

import { memo, useState } from 'react';
import {
  Bookmark,
  MarkerPin01,
  Building07,
  Clock,
  CurrencyDollar,
  Globe02,
  ArrowUpRight,
  Briefcase01,
  CheckCircle,
} from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { Badge, BadgeWithIcon } from '@/components/base/badges/badges';
import { cx } from '@/utils/cx';
import type { Job, LocationType } from '@/types/job';

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  hasApplied?: boolean;
  isSelected?: boolean;
  onSelect?: (job: Job) => void;
  onSave?: (job: Job) => void;
  onApply?: (job: Job) => void;
  compact?: boolean;
}

function formatSalary(min?: number | null, max?: number | null, currency?: string | null): string {
  if (!min && !max) return '';

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    notation: 'compact',
    maximumFractionDigits: 0,
  });

  if (min && max && min !== max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  return formatter.format(min || max || 0);
}

function formatDate(dateString?: string | Date | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
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

export const JobCard = memo(function JobCard({
  job,
  isSaved = false,
  hasApplied = false,
  isSelected = false,
  onSelect,
  onSave,
  onApply,
  compact = false,
}: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);
  const postedDate = formatDate(job.publishedAt);

  return (
    <article
      className={cx(
        'group relative cursor-pointer rounded-xl border bg-primary p-4 transition-all duration-200',
        isSelected
          ? 'border-brand-500 ring-2 ring-brand-500/20'
          : 'border-secondary hover:border-brand-300 hover:shadow-md',
        hasApplied && 'border-success-300 bg-success-25'
      )}
      onClick={() => onSelect?.(job)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Applied indicator */}
      {hasApplied && (
        <div className="absolute -right-2 -top-2 rounded-full bg-success-500 p-1">
          <CheckCircle className="size-4 text-white" />
        </div>
      )}

      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="size-12 rounded-lg border border-secondary object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div
            className={cx(
              'flex size-12 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-600',
              job.companyLogo && 'hidden'
            )}
          >
            {job.company.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-primary group-hover:text-brand-600">
                {job.title}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-tertiary">
                <span className="flex items-center gap-1 truncate">
                  <Building07 className="size-4 flex-shrink-0" />
                  <span className="truncate">{job.company}</span>
                </span>
                {job.location && (
                  <span className="flex items-center gap-1 truncate">
                    <MarkerPin01 className="size-4 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Save button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSave?.(job);
              }}
              className={cx(
                'flex-shrink-0 rounded-lg p-1.5 transition-colors',
                isSaved
                  ? 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              )}
              aria-label={isSaved ? 'Remove from saved' : 'Save job'}
            >
              <Bookmark
                className={cx('size-5', isSaved && 'fill-current')}
              />
            </button>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
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
                {job.experienceLevel.charAt(0).toUpperCase() +
                  job.experienceLevel.slice(1)}
              </Badge>
            )}

            {salary && (
              <Badge size="sm" color="success">
                {salary}
              </Badge>
            )}
          </div>

          {/* Description preview */}
          {!compact && (
            <p className="mt-3 line-clamp-2 text-sm text-secondary">
              {job.description}
            </p>
          )}

          {/* Skills/Tags */}
          {!compact && job.tags && job.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.tags.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 5 && (
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  +{job.tags.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-tertiary">
              {postedDate && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {postedDate}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Globe02 className="size-3.5" />
                {job.source.charAt(0).toUpperCase() + job.source.slice(1)}
              </span>
            </div>

            {/* Actions */}
            <div
              className={cx(
                'flex gap-2 transition-opacity',
                isHovered || isSelected ? 'opacity-100' : 'opacity-0'
              )}
            >
              {hasApplied ? (
                <Badge size="sm" color="success">
                  Applied
                </Badge>
              ) : (
                <Button
                  color="primary"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onApply?.(job);
                  }}
                  iconTrailing={ArrowUpRight}
                >
                  Apply
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});

export default JobCard;

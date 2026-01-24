'use client';

import { useState, useCallback } from 'react';
import {
  SearchLg,
  FilterLines,
  X,
  MarkerPin01,
  Briefcase01,
  Clock,
  Building07,
  ChevronDown,
  RefreshCw01,
} from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Badge, BadgeWithButton } from '@/components/base/badges/badges';
import { cx } from '@/utils/cx';
import type { JobFilters, LocationType, JobCategory, ExperienceLevel, EmploymentType, JobSource } from '@/types/job';
import {
  JOB_CATEGORIES,
  LOCATION_TYPES,
  EXPERIENCE_LEVELS,
  EMPLOYMENT_TYPES,
  POSTED_WITHIN_OPTIONS,
  JOB_SOURCES,
} from '@/types/job';

interface JobFiltersProps {
  filters: JobFilters;
  onFilterChange: (filters: Partial<JobFilters>) => void;
  onClearFilters: () => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
  totalJobs?: number;
  availableCategories?: { value: string; label: string; count: number }[];
  availableLocations?: { value: string; label: string; count: number }[];
}

interface FilterSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, icon: Icon, isOpen, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b border-secondary last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-gray-500" />
          <span className="text-sm font-medium text-primary">{title}</span>
        </div>
        <ChevronDown
          className={cx('size-4 text-gray-400 transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

interface CheckboxFilterProps {
  options: { value: string; label: string; count?: number }[];
  selected: string[];
  onChange: (values: string[]) => void;
  maxVisible?: number;
}

function CheckboxFilter({ options, selected, onChange, maxVisible = 6 }: CheckboxFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, maxVisible);
  const hasMore = options.length > maxVisible;

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      {visibleOptions.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50"
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => toggleOption(option.value)}
            className="size-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="flex-1 text-sm text-secondary">{option.label}</span>
          {option.count !== undefined && (
            <span className="text-xs text-tertiary">({option.count})</span>
          )}
        </label>
      ))}
      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          {showAll ? 'Show less' : `Show ${options.length - maxVisible} more`}
        </button>
      )}
    </div>
  );
}

export function JobFilters({
  filters,
  onFilterChange,
  onClearFilters,
  onSearch,
  isLoading,
  totalJobs,
  availableCategories,
  availableLocations,
}: JobFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.query || '');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    locationType: true,
    category: true,
    experience: false,
    employment: false,
    posted: false,
    sources: false,
  });

  const toggleSection = useCallback((section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const handleSearch = useCallback(() => {
    onSearch(searchValue);
  }, [searchValue, onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const activeFilterCount =
    (filters.locationType?.length || 0) +
    (filters.categories?.length || 0) +
    (filters.experienceLevel?.length || 0) +
    (filters.employmentType?.length || 0) +
    (filters.sources?.length || 0) +
    (filters.postedWithin && filters.postedWithin !== 'any' ? 1 : 0);

  const activeFilters: { key: string; label: string; value: string }[] = [];

  filters.locationType?.forEach((v) => {
    const opt = LOCATION_TYPES.find((o) => o.value === v);
    if (opt) activeFilters.push({ key: `locationType-${v}`, label: opt.label, value: v });
  });

  filters.categories?.forEach((v) => {
    const opt = JOB_CATEGORIES.find((o) => o.value === v);
    if (opt) activeFilters.push({ key: `categories-${v}`, label: opt.label, value: v });
  });

  filters.experienceLevel?.forEach((v) => {
    const opt = EXPERIENCE_LEVELS.find((o) => o.value === v);
    if (opt) activeFilters.push({ key: `experienceLevel-${v}`, label: opt.label, value: v });
  });

  const removeFilter = (key: string, value: string) => {
    if (key.startsWith('locationType-')) {
      onFilterChange({
        locationType: filters.locationType?.filter((v) => v !== value) as LocationType[],
      });
    } else if (key.startsWith('categories-')) {
      onFilterChange({
        categories: filters.categories?.filter((v) => v !== value) as JobCategory[],
      });
    } else if (key.startsWith('experienceLevel-')) {
      onFilterChange({
        experienceLevel: filters.experienceLevel?.filter((v) => v !== value) as ExperienceLevel[],
      });
    }
  };

  const categories = availableCategories?.length
    ? availableCategories
    : JOB_CATEGORIES.map((c) => ({ ...c, count: undefined }));

  return (
    <div className="flex flex-col rounded-xl border border-secondary bg-primary">
      {/* Search */}
      <div className="border-b border-secondary p-4">
        <div className="relative">
          <SearchLg className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search jobs, companies..."
            className="w-full rounded-lg border border-secondary bg-primary py-2.5 pl-10 pr-4 text-sm text-primary placeholder:text-tertiary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <Button
          color="primary"
          size="md"
          onClick={handleSearch}
          isLoading={isLoading}
          className="mt-3 w-full"
        >
          Search Jobs
        </Button>
      </div>

      {/* Results count */}
      {totalJobs !== undefined && (
        <div className="border-b border-secondary px-4 py-3">
          <p className="text-sm text-secondary">
            <span className="font-semibold text-primary">{totalJobs.toLocaleString()}</span> jobs
            found
          </p>
        </div>
      )}

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="border-b border-secondary px-4 py-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-tertiary uppercase">Active Filters</span>
            <button
              type="button"
              onClick={onClearFilters}
              className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700"
            >
              <RefreshCw01 className="size-3" />
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <BadgeWithButton
                key={filter.key}
                size="sm"
                color="brand"
                onButtonClick={() => removeFilter(filter.key, filter.value)}
              >
                {filter.label}
              </BadgeWithButton>
            ))}
          </div>
        </div>
      )}

      {/* Filter sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Work Type */}
        <FilterSection
          title="Work Type"
          icon={MarkerPin01}
          isOpen={openSections.locationType}
          onToggle={() => toggleSection('locationType')}
        >
          <CheckboxFilter
            options={LOCATION_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            selected={filters.locationType || []}
            onChange={(values) =>
              onFilterChange({ locationType: values as LocationType[] })
            }
          />
        </FilterSection>

        {/* Category */}
        <FilterSection
          title="Category"
          icon={Briefcase01}
          isOpen={openSections.category}
          onToggle={() => toggleSection('category')}
        >
          <CheckboxFilter
            options={categories}
            selected={filters.categories || []}
            onChange={(values) => onFilterChange({ categories: values as JobCategory[] })}
          />
        </FilterSection>

        {/* Experience Level */}
        <FilterSection
          title="Experience Level"
          icon={Building07}
          isOpen={openSections.experience}
          onToggle={() => toggleSection('experience')}
        >
          <CheckboxFilter
            options={EXPERIENCE_LEVELS.map((e) => ({ value: e.value, label: e.label }))}
            selected={filters.experienceLevel || []}
            onChange={(values) =>
              onFilterChange({ experienceLevel: values as ExperienceLevel[] })
            }
          />
        </FilterSection>

        {/* Employment Type */}
        <FilterSection
          title="Employment Type"
          icon={Clock}
          isOpen={openSections.employment}
          onToggle={() => toggleSection('employment')}
        >
          <CheckboxFilter
            options={EMPLOYMENT_TYPES.map((e) => ({ value: e.value, label: e.label }))}
            selected={filters.employmentType || []}
            onChange={(values) =>
              onFilterChange({ employmentType: values as EmploymentType[] })
            }
          />
        </FilterSection>

        {/* Posted Within */}
        <FilterSection
          title="Date Posted"
          icon={Clock}
          isOpen={openSections.posted}
          onToggle={() => toggleSection('posted')}
        >
          <div className="space-y-2">
            {POSTED_WITHIN_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="postedWithin"
                  value={option.value}
                  checked={(filters.postedWithin || 'any') === option.value}
                  onChange={() =>
                    onFilterChange({
                      postedWithin: option.value as 'day' | 'week' | 'month' | 'any',
                    })
                  }
                  className="size-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm text-secondary">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Job Sources */}
        <FilterSection
          title="Job Sources"
          icon={Building07}
          isOpen={openSections.sources}
          onToggle={() => toggleSection('sources')}
        >
          <CheckboxFilter
            options={JOB_SOURCES.map((s) => ({ value: s.value, label: s.label }))}
            selected={filters.sources || []}
            onChange={(values) => onFilterChange({ sources: values as JobSource[] })}
          />
        </FilterSection>
      </div>
    </div>
  );
}

export default JobFilters;

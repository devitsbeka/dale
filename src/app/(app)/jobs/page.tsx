'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  SearchLg,
  Bookmark,
  Briefcase02,
  LayoutGrid01,
  List,
  RefreshCw01,
  TrendUp01,
  CheckCircle,
  Clock,
  Target04,
  Loading01,
} from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { Badge } from '@/components/base/badges/badges';
import { JobCard } from '@/components/jobs/job-card';
import { JobFilters } from '@/components/jobs/job-filters';
import { JobDetailsPanel } from '@/components/jobs/job-details-panel';
import { ApplyModal } from '@/components/jobs/apply-modal';
import { AnimatedCounter } from '@/components/base/animated-counter';
import { cx } from '@/utils/cx';
import { useJobs, useSavedJobs, useJobApplications } from '@/hooks/jobs';
import type { Job, JobFilters as JobFiltersType, ApplyFormData } from '@/types/job';

type ViewMode = 'list' | 'grid';
type TabId = 'discover' | 'saved' | 'applied';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: Tab[] = [
  { id: 'discover', label: 'Discover Jobs', icon: SearchLg },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'applied', label: 'Applied', icon: CheckCircle },
];

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('discover');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);

  // Hooks
  const jobs = useJobs();
  const savedJobs = useSavedJobs();
  const applications = useJobApplications();

  // Infinite scroll ref
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters: Partial<JobFiltersType>) => {
      jobs.setFilters(newFilters);
      jobs.fetchJobs({ ...jobs.filters, ...newFilters, page: 1 });
    },
    [jobs]
  );

  const handleClearFilters = useCallback(() => {
    jobs.clearFilters();
    jobs.fetchJobs({ page: 1 });
  }, [jobs]);

  const handleSearch = useCallback(
    (query: string) => {
      jobs.fetchJobs({ query, page: 1 });
    },
    [jobs]
  );

  // Handle job actions
  const handleSaveJob = useCallback(
    async (job: Job) => {
      const isSaved = savedJobs.isJobSaved(job.id);
      await savedJobs.toggleSave(job);
    },
    [savedJobs]
  );

  const handleApplyClick = useCallback((job: Job) => {
    setJobToApply(job);
    setIsApplyModalOpen(true);
  }, []);

  const handleApply = useCallback(
    async (data: ApplyFormData): Promise<{ success: boolean; error?: string }> => {
      if (!jobToApply) return { success: false, error: 'No job selected' };
      return applications.applyToJob(jobToApply, data);
    },
    [jobToApply, applications]
  );

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (activeTab !== 'discover') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !jobs.isLoading && !jobs.isLoadingMore) {
          jobs.loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [activeTab, jobs]);

  // Get display jobs based on active tab
  const displayJobs = activeTab === 'discover'
    ? jobs.jobs
    : activeTab === 'saved'
    ? savedJobs.savedJobs.map((s) => s.job)
    : applications.applications.map((a) => a.job);

  const isLoading = activeTab === 'discover'
    ? jobs.isLoading
    : activeTab === 'saved'
    ? savedJobs.isLoading
    : applications.isLoading;

  return (
    <div className="flex min-h-screen flex-col bg-primary">
      {/* Header */}
      <div className="border-b border-secondary bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Jobs</h1>
              <p className="mt-1 text-sm text-tertiary">
                Find your next opportunity from thousands of remote and on-site positions
              </p>
            </div>
            <Button
              color="secondary"
              size="md"
              onClick={() => jobs.refresh()}
              iconLeading={RefreshCw01}
              isLoading={jobs.isLoading}
            >
              Refresh
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-secondary bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-brand-100 p-2">
                  <Briefcase02 className="size-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    <AnimatedCounter value={jobs.pagination.total} />
                  </p>
                  <p className="text-xs text-tertiary">Total Jobs</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-secondary bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-purple-100 p-2">
                  <Bookmark className="size-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    <AnimatedCounter value={savedJobs.savedJobs.length} />
                  </p>
                  <p className="text-xs text-tertiary">Saved Jobs</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-secondary bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-success-100 p-2">
                  <CheckCircle className="size-5 text-success-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    <AnimatedCounter value={applications.applications.length} />
                  </p>
                  <p className="text-xs text-tertiary">Applied</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-secondary bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Target04 className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    <AnimatedCounter value={applications.stats?.responseRate || 0} />%
                  </p>
                  <p className="text-xs text-tertiary">Response Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cx(
                    'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  )}
                >
                  <tab.icon className="size-4" />
                  {tab.label}
                  {tab.id === 'saved' && savedJobs.savedJobs.length > 0 && (
                    <Badge size="sm" color="brand">
                      {savedJobs.savedJobs.length}
                    </Badge>
                  )}
                  {tab.id === 'applied' && applications.applications.length > 0 && (
                    <Badge size="sm" color="success">
                      {applications.applications.length}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'discover' && (
                <Button
                  color={showFilters ? 'secondary' : 'link-gray'}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              )}
              <div className="flex rounded-lg border border-secondary">
                <button
                  onClick={() => setViewMode('list')}
                  className={cx(
                    'rounded-l-lg p-2 transition-colors',
                    viewMode === 'list' ? 'bg-gray-100 text-primary' : 'text-tertiary hover:text-primary'
                  )}
                >
                  <List className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={cx(
                    'rounded-r-lg p-2 transition-colors',
                    viewMode === 'grid' ? 'bg-gray-100 text-primary' : 'text-tertiary hover:text-primary'
                  )}
                >
                  <LayoutGrid01 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex gap-6">
            {/* Filters Sidebar - Only show on discover tab */}
            {activeTab === 'discover' && showFilters && (
              <div className="hidden w-80 flex-shrink-0 lg:block">
                <div className="sticky top-6">
                  <JobFilters
                    filters={jobs.filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    onSearch={handleSearch}
                    isLoading={jobs.isLoading}
                    totalJobs={jobs.pagination.total}
                    availableCategories={jobs.filterOptions.availableCategories}
                    availableLocations={jobs.filterOptions.availableLocations}
                  />
                </div>
              </div>
            )}

            {/* Job List */}
            <div className="min-w-0 flex-1">
              {isLoading && displayJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loading01 className="size-10 animate-spin text-brand-600" />
                  <p className="mt-4 text-sm text-secondary">Loading jobs...</p>
                </div>
              ) : displayJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-secondary py-20">
                  {activeTab === 'discover' ? (
                    <>
                      <SearchLg className="size-12 text-gray-300" />
                      <h3 className="mt-4 text-lg font-semibold text-primary">No jobs found</h3>
                      <p className="mt-2 text-sm text-tertiary">
                        Try adjusting your filters or search terms
                      </p>
                      <Button
                        color="primary"
                        size="md"
                        className="mt-4"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </Button>
                    </>
                  ) : activeTab === 'saved' ? (
                    <>
                      <Bookmark className="size-12 text-gray-300" />
                      <h3 className="mt-4 text-lg font-semibold text-primary">No saved jobs</h3>
                      <p className="mt-2 text-sm text-tertiary">
                        Save jobs you&apos;re interested in to review later
                      </p>
                      <Button
                        color="primary"
                        size="md"
                        className="mt-4"
                        onClick={() => setActiveTab('discover')}
                      >
                        Browse Jobs
                      </Button>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="size-12 text-gray-300" />
                      <h3 className="mt-4 text-lg font-semibold text-primary">No applications yet</h3>
                      <p className="mt-2 text-sm text-tertiary">
                        Start applying to jobs to track them here
                      </p>
                      <Button
                        color="primary"
                        size="md"
                        className="mt-4"
                        onClick={() => setActiveTab('discover')}
                      >
                        Find Jobs
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div
                  className={cx(
                    viewMode === 'grid'
                      ? 'grid gap-4 sm:grid-cols-2'
                      : 'flex flex-col gap-4'
                  )}
                >
                  {displayJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobs.isJobSaved(job.id)}
                      hasApplied={applications.hasApplied(job.id)}
                      isSelected={selectedJob?.id === job.id}
                      onSelect={setSelectedJob}
                      onSave={handleSaveJob}
                      onApply={handleApplyClick}
                      compact={viewMode === 'grid'}
                    />
                  ))}
                </div>
              )}

              {/* Load More / Infinite Scroll Trigger */}
              {activeTab === 'discover' && jobs.pagination.page < jobs.pagination.totalPages && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  {jobs.isLoadingMore ? (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Loading01 className="size-5 animate-spin" />
                      Loading more jobs...
                    </div>
                  ) : (
                    <Button color="secondary" size="md" onClick={() => jobs.loadMore()}>
                      Load More Jobs
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Job Details Panel */}
            {selectedJob && (
              <div className="hidden w-[480px] flex-shrink-0 xl:block">
                <div className="sticky top-6">
                  <JobDetailsPanel
                    job={selectedJob}
                    isSaved={savedJobs.isJobSaved(selectedJob.id)}
                    hasApplied={applications.hasApplied(selectedJob.id)}
                    onClose={() => setSelectedJob(null)}
                    onSave={handleSaveJob}
                    onApply={handleApplyClick}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {jobToApply && (
        <ApplyModal
          job={jobToApply}
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setJobToApply(null);
          }}
          onApply={handleApply}
        />
      )}
    </div>
  );
}

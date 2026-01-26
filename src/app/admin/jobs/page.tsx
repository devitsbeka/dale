/**
 * Admin Jobs Page - Advanced job management table with bulk operations
 */

'use client';

import { useState, useEffect } from 'react';
import { JobsTable } from '@/components/admin/jobs-table';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    fetchJobs();
  }, [page, pageSize, filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...filters,
      });

      const response = await fetch(`/api/admin/jobs?${params}`);
      const data = await response.json();

      setJobs(data.jobs || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async (selectedIds: string[]) => {
    if (!confirm(`Delete ${selectedIds.length} jobs?`)) return;

    try {
      const response = await fetch('/api/admin/jobs/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobIds: selectedIds }),
      });

      if (response.ok) {
        alert('Jobs deleted successfully');
        fetchJobs();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting jobs:', error);
      alert('Failed to delete jobs');
    }
  };

  const handleBulkUpdate = async (selectedIds: string[], updates: any) => {
    try {
      const response = await fetch('/api/admin/jobs/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobIds: selectedIds, updates }),
      });

      if (response.ok) {
        alert('Jobs updated successfully');
        fetchJobs();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating jobs:', error);
      alert('Failed to update jobs');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
        <div className="text-sm text-gray-500">
          {total.toLocaleString()} total jobs
        </div>
      </div>

      {loading && <div className="text-center py-8">Loading jobs...</div>}

      {!loading && (
        <JobsTable
          jobs={jobs}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onFiltersChange={setFilters}
          onBulkDelete={handleBulkDelete}
          onBulkUpdate={handleBulkUpdate}
        />
      )}
    </div>
  );
}

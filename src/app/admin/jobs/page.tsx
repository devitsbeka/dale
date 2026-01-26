/**
 * Admin Jobs Page - Professional job management interface
 */

'use client';

import { useState, useEffect } from 'react';
import { JobsTable } from '@/components/admin/jobs-table';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState<any>({});
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

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
    <div className="flex flex-col h-full">
      {/* Header Bar */}
      <div className={`h-16 border-b flex items-center justify-between px-6 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div>
          <h1 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Job Management</h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            {loading ? 'Loading...' : `${total.toLocaleString()} total jobs`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchJobs}
            className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 border-gray-300 text-gray-700'
            }`}
          >
            Refresh
          </button>
          <button
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            Export Selected
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 text-sm">Loading jobs...</div>
          </div>
        ) : (
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
    </div>
  );
}

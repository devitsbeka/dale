/**
 * Admin Overview - Professional dashboard with key metrics
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OverviewData {
  totalJobs: number;
  activeJobs: number;
  staleJobs: number;
  withSalary: number;
  avgSalary: number;
  avgQualityScore: number;
  recentSyncs: Array<{
    source: string;
    timestamp: string;
    jobsAdded: number;
    status: string;
  }>;
  topCategories: Array<{
    name: string;
    count: number;
  }>;
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const response = await fetch('/api/admin/analytics/overview');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching overview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Bar */}
      <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
        <div>
          <h1 className="text-base font-semibold text-gray-100">Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">System-wide metrics and status</p>
        </div>
        <button
          onClick={fetchOverview}
          className="px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-4 gap-4">
            <MetricPanel
              label="Total Jobs"
              value={data?.totalJobs?.toLocaleString() || '0'}
              sublabel="All records"
            />
            <MetricPanel
              label="Active Jobs"
              value={data?.activeJobs?.toLocaleString() || '0'}
              sublabel={`${data?.activeJobs && data?.totalJobs ? ((data.activeJobs / data.totalJobs) * 100).toFixed(1) : '0'}% of total`}
            />
            <MetricPanel
              label="With Salary Data"
              value={data?.withSalary?.toLocaleString() || '0'}
              sublabel={`Avg $${data?.avgSalary?.toLocaleString() || '0'}`}
            />
            <MetricPanel
              label="Quality Score"
              value={`${data?.avgQualityScore?.toFixed(1) || '0'}%`}
              sublabel="Data completeness"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top Categories */}
            <div className="border border-gray-800 bg-gray-900/50">
              <div className="border-b border-gray-800 px-4 py-3">
                <h3 className="text-sm font-medium text-gray-300">Top Categories</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {data?.topCategories?.slice(0, 8).map((category, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{category.name}</span>
                      <span className="text-gray-300 font-mono">{category.count.toLocaleString()}</span>
                    </div>
                  )) || (
                    <div className="text-xs text-gray-600">No data available</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Syncs */}
            <div className="border border-gray-800 bg-gray-900/50">
              <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-300">Recent Syncs</h3>
                <Link
                  href="/admin/sync"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  View all
                </Link>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {data?.recentSyncs?.slice(0, 8).map((sync, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          sync.status === 'success' ? 'bg-green-500' :
                          sync.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-gray-400">{sync.source}</span>
                      </div>
                      <span className="text-gray-500 font-mono">+{sync.jobsAdded}</span>
                    </div>
                  )) || (
                    <div className="text-xs text-gray-600">No recent syncs</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border border-gray-800 bg-gray-900/50">
            <div className="border-b border-gray-800 px-4 py-3">
              <h3 className="text-sm font-medium text-gray-300">Quick Actions</h3>
            </div>
            <div className="p-4 grid grid-cols-4 gap-3">
              <Link
                href="/admin/jobs"
                className="px-4 py-3 border border-gray-800 bg-gray-900 hover:bg-gray-800 hover:border-gray-700 transition-colors text-center"
              >
                <div className="text-xs font-medium text-gray-300">Manage Jobs</div>
                <div className="text-xs text-gray-500 mt-1">View & edit all jobs</div>
              </Link>
              <Link
                href="/admin/analytics"
                className="px-4 py-3 border border-gray-800 bg-gray-900 hover:bg-gray-800 hover:border-gray-700 transition-colors text-center"
              >
                <div className="text-xs font-medium text-gray-300">Analytics</div>
                <div className="text-xs text-gray-500 mt-1">View detailed charts</div>
              </Link>
              <Link
                href="/admin/sync"
                className="px-4 py-3 border border-gray-800 bg-gray-900 hover:bg-gray-800 hover:border-gray-700 transition-colors text-center"
              >
                <div className="text-xs font-medium text-gray-300">Sync Status</div>
                <div className="text-xs text-gray-500 mt-1">Monitor data sources</div>
              </Link>
              <Link
                href="/admin/export"
                className="px-4 py-3 border border-gray-800 bg-gray-900 hover:bg-gray-800 hover:border-gray-700 transition-colors text-center"
              >
                <div className="text-xs font-medium text-gray-300">Export Data</div>
                <div className="text-xs text-gray-500 mt-1">Download job listings</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricPanel({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return (
    <div className="border border-gray-800 bg-gray-900/50 p-4">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-semibold text-gray-100 mt-2 font-mono">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{sublabel}</div>
    </div>
  );
}

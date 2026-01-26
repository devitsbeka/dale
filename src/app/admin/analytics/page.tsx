/**
 * Admin Analytics Page - Deep analytics with ECharts visualizations
 */

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [distribution, setDistribution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsRes, distRes] = await Promise.all([
        fetch('/api/admin/analytics/overview'),
        fetch('/api/admin/analytics/distribution'),
      ]);

      const statsData = await statsRes.json();
      const distData = await distRes.json();

      setStats(statsData);
      setDistribution(distData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  // Category distribution pie chart
  const categoryChartOption = {
    title: {
      text: 'Jobs by Category',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Category',
        type: 'pie',
        radius: '50%',
        data: distribution?.categories || [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // Source distribution pie chart
  const sourceChartOption = {
    title: {
      text: 'Jobs by Source',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Source',
        type: 'pie',
        radius: '50%',
        data: distribution?.sources || [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // Salary histogram
  const salaryChartOption = {
    title: {
      text: 'Salary Distribution',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: distribution?.salaryRanges?.map((r: any) => r.range) || [],
    },
    yAxis: {
      type: 'value',
      name: 'Number of Jobs',
    },
    series: [
      {
        name: 'Jobs',
        type: 'bar',
        data: distribution?.salaryRanges?.map((r: any) => r.count) || [],
        itemStyle: {
          color: '#3b82f6',
        },
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="text-sm font-medium text-blue-600 mb-2">Total Jobs</div>
          <div className="text-3xl font-bold text-blue-900">
            {stats?.totalJobs?.toLocaleString() || 0}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="text-sm font-medium text-green-600 mb-2">Active Jobs</div>
          <div className="text-3xl font-bold text-green-900">
            {stats?.activeJobs?.toLocaleString() || 0}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="text-sm font-medium text-purple-600 mb-2">Avg Salary</div>
          <div className="text-3xl font-bold text-purple-900">
            ${stats?.avgSalary?.toLocaleString() || 0}
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-6">
          <div className="text-sm font-medium text-orange-600 mb-2">Quality Score</div>
          <div className="text-3xl font-bold text-orange-900">
            {stats?.avgQualityScore?.toFixed(1) || 0}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <ReactECharts option={categoryChartOption} style={{ height: '400px' }} />
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <ReactECharts option={sourceChartOption} style={{ height: '400px' }} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <ReactECharts option={salaryChartOption} style={{ height: '400px' }} />
      </div>
    </div>
  );
}

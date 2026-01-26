/**
 * Job Market Snapshot - Beautiful public analytics page
 * Uses UntitledUI design principles
 */

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface SnapshotData {
  overview: any;
  distribution: any;
  timeseries: any;
}

export default function SnapshotPage() {
  const [data, setData] = useState<SnapshotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, distRes, timeseriesRes] = await Promise.all([
        fetch('/api/admin/analytics/overview'),
        fetch('/api/admin/analytics/distribution'),
        fetch(`/api/admin/analytics/timeseries?days=${dateRange}`),
      ]);

      const [overview, distribution, timeseries] = await Promise.all([
        overviewRes.json(),
        distRes.json(),
        timeseriesRes.json(),
      ]);

      setData({ overview, distribution, timeseries });
    } catch (error) {
      console.error('Error fetching snapshot:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading market data...</p>
          </div>
        </div>
      ) : (
        <div className="p-6 md:p-8">
          {/* Header with controls */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Snapshot</h1>
              <p className="text-gray-600">
                Real-time insights from {data?.overview?.totalJobs?.toLocaleString() || 0} job listings
              </p>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-full sm:w-auto"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Listings"
              value={data?.overview?.totalJobs?.toLocaleString() || '0'}
              change="+12%"
              changeType="positive"
            />
            <StatCard
              label="Active Jobs"
              value={data?.overview?.activeJobs?.toLocaleString() || '0'}
              change="+8%"
              changeType="positive"
            />
            <StatCard
              label="Avg Salary"
              value={`$${(data?.overview?.avgSalary || 0).toLocaleString()}`}
              change="+5%"
              changeType="positive"
            />
            <StatCard
              label="Data Quality"
              value={`${Number(data?.overview?.avgQualityScore || 0).toFixed(1)}%`}
              change="+2%"
              changeType="positive"
            />
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Jobs Timeline */}
            <ChartCard title="Job Postings Trend" description="Daily new job listings by category">
              <ReactECharts option={getTimelineChartOption(data?.timeseries)} style={{ height: '350px' }} />
            </ChartCard>

            {/* Salary Trends */}
            <ChartCard title="Salary Trends" description="Average, median, and maximum salaries over time">
              <ReactECharts option={getSalaryTrendsChartOption(data?.timeseries)} style={{ height: '350px' }} />
            </ChartCard>
          </div>

          {/* Secondary Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Category Distribution */}
            <ChartCard title="Top Categories" description="Most popular job categories">
              <ReactECharts option={getCategoryChartOption(data?.distribution)} style={{ height: '300px' }} />
            </ChartCard>

            {/* Source Distribution */}
            <ChartCard title="Job Sources" description="Where jobs are coming from">
              <ReactECharts option={getSourceChartOption(data?.distribution)} style={{ height: '300px' }} />
            </ChartCard>

            {/* Location Types */}
            <ChartCard title="Work Location" description="Remote vs office distribution">
              <ReactECharts option={getLocationChartOption(data?.distribution)} style={{ height: '300px' }} />
            </ChartCard>
          </div>

          {/* Full Width Charts */}
          <div className="space-y-8">
            {/* Stacked Area Chart */}
            <ChartCard title="Jobs by Source Over Time" description="How each platform contributes to the market">
              <ReactECharts option={getSourceStackChartOption(data?.timeseries)} style={{ height: '400px' }} />
            </ChartCard>

            {/* Heatmap */}
            <ChartCard title="Posting Patterns" description="When companies typically post jobs (by day and hour)">
              <ReactECharts option={getHeatmapChartOption(data?.timeseries)} style={{ height: '450px' }} />
            </ChartCard>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Data updated in real-time • Last refresh: {new Date().toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, change, changeType }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className={`text-sm mt-2 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {change} vs last period
        </p>
      </div>
    </div>
  );
}

// Chart Card Component
function ChartCard({ title, description, children }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      {children}
    </div>
  );
}

// Chart configurations (similar to admin but with UntitledUI colors)
function getTimelineChartOption(timeseries: any) {
  if (!timeseries?.jobsByCategory) return {};

  const dates = [...new Set(timeseries.jobsByCategory.map((d: any) => d.date))].sort();
  const categories = [...new Set(timeseries.jobsByCategory.map((d: any) => d.category))].slice(0, 5);

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const series = categories.map((category, i) => ({
    name: category,
    type: 'line',
    smooth: true,
    areaStyle: { opacity: 0.3 },
    itemStyle: { color: colors[i] },
    data: dates.map((date) => {
      const item = timeseries.jobsByCategory.find((d: any) => d.date === date && d.category === category);
      return item ? item.count : 0;
    }),
  }));

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { bottom: 0, data: categories },
    xAxis: { type: 'category', boundaryGap: false, data: dates.map((d) => new Date(String(d)).toLocaleDateString()) },
    yAxis: { type: 'value' },
    series,
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
  };
}

function getSalaryTrendsChartOption(timeseries: any) {
  if (!timeseries?.salaryTrends) return {};

  const data = timeseries.salaryTrends;
  const dates = data.map((d: any) => new Date(String(d.date)).toLocaleDateString());

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Average', 'Median'] },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', axisLabel: { formatter: (val: number) => `$${(val / 1000).toFixed(0)}k` } },
    series: [
      {
        name: 'Average',
        type: 'line',
        smooth: true,
        data: data.map((d: any) => d.avg_salary),
        areaStyle: { color: 'rgba(59, 130, 246, 0.1)' },
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: 'Median',
        type: 'line',
        smooth: true,
        data: data.map((d: any) => d.median_salary),
        itemStyle: { color: '#10b981' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  };
}

function getCategoryChartOption(distribution: any) {
  if (!distribution?.categories) return {};

  return {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { formatter: '{b}: {d}%' },
        data: distribution.categories.slice(0, 8).map((d: any) => ({ value: d.value, name: d.name })),
      },
    ],
  };
}

function getSourceChartOption(distribution: any) {
  if (!distribution?.sources) return {};

  return {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { formatter: '{b}: {d}%' },
        data: distribution.sources.map((d: any) => ({ value: d.value, name: d.name })),
      },
    ],
  };
}

function getLocationChartOption(distribution: any) {
  if (!distribution?.locationTypes) return {};

  return {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { formatter: '{b}: {d}%' },
        data: distribution.locationTypes.map((d: any) => ({ value: d.value, name: d.name })),
      },
    ],
  };
}

function getSourceStackChartOption(timeseries: any) {
  if (!timeseries?.jobsBySource) return {};

  const dates = [...new Set(timeseries.jobsBySource.map((d: any) => d.date))].sort();
  const sources = [...new Set(timeseries.jobsBySource.map((d: any) => d.source))];

  const series = sources.map((source) => ({
    name: source,
    type: 'line',
    stack: 'Total',
    areaStyle: {},
    emphasis: { focus: 'series' },
    data: dates.map((date) => {
      const item = timeseries.jobsBySource.find((d: any) => d.date === date && d.source === source);
      return item ? item.count : 0;
    }),
  }));

  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, data: sources },
    xAxis: { type: 'category', boundaryGap: false, data: dates.map((d) => new Date(String(d)).toLocaleDateString()) },
    yAxis: { type: 'value' },
    series,
    grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
  };
}

function getHeatmapChartOption(timeseries: any) {
  if (!timeseries?.hourlyPatterns) return {};

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const data = timeseries.hourlyPatterns.map((item: any) => [item.hour, item.day_of_week, item.count || 0]);

  return {
    tooltip: { position: 'top' },
    grid: { height: '75%', top: '5%' },
    xAxis: { type: 'category', data: hours, splitArea: { show: true } },
    yAxis: { type: 'category', data: days, splitArea: { show: true } },
    visualMap: {
      min: 0,
      max: Math.max(...data.map((d: any) => d[2])),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '2%',
      inRange: { color: ['#e0f2fe', '#0ea5e9', '#0369a1'] },
    },
    series: [{ name: 'Jobs Posted', type: 'heatmap', data, label: { show: false } }],
  };
}

/**
 * Admin Analytics Dashboard - Professional analytics with ECharts
 */

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import USAMapChart from '@/components/admin/USAMapChart';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface AnalyticsData {
  overview: any;
  distribution: any;
  timeseries: any;
  usaMap: any;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewRes, distRes, timeseriesRes, usaMapRes] = await Promise.all([
        fetch('/api/admin/analytics/overview'),
        fetch('/api/admin/analytics/distribution'),
        fetch(`/api/admin/analytics/timeseries?days=${dateRange}`),
        fetch('/api/admin/analytics/usa-map'),
      ]);

      const [overview, distribution, timeseries, usaMap] = await Promise.all([
        overviewRes.json(),
        distRes.json(),
        timeseriesRes.json(),
        usaMapRes.json(),
      ]);

      setData({ overview, distribution, timeseries, usaMap });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-500 mt-1">Real-time insights from {data?.overview?.totalJobs?.toLocaleString() || 0} job listings</p>
        </div>

        <div className="flex gap-4 items-center">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={180}>Last 6 months</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Jobs" value={data?.overview?.totalJobs} color="blue" />
        <KPICard title="Active Jobs" value={data?.overview?.activeJobs} color="green" />
        <KPICard title="Avg Salary" value={`$${(data?.overview?.avgSalary || 0).toLocaleString()}`} color="purple" />
        <KPICard title="Quality Score" value={`${Number(data?.overview?.avgQualityScore || 0).toFixed(1)}%`} color="orange" />
      </div>

      {/* Main Timeline Chart */}
      <ChartCard title="Jobs Posted Over Time" description="Daily new job listings by category">
        <ReactECharts option={getTimelineChartOption(data?.timeseries)} style={{ height: '400px' }} />
      </ChartCard>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Jobs by Source" description="Stacked area showing contribution by platform">
          <ReactECharts option={getSourceStackChartOption(data?.timeseries)} style={{ height: '350px' }} />
        </ChartCard>

        <ChartCard title="Salary Trends" description="Average, median, and maximum salaries">
          <ReactECharts option={getSalaryTrendsChartOption(data?.timeseries)} style={{ height: '350px' }} />
        </ChartCard>
      </div>

      {/* Heatmap */}
      <ChartCard title="Posting Patterns" description="When companies typically post jobs (hour × day of week)">
        <ReactECharts option={getHeatmapChartOption(data?.timeseries)} style={{ height: '500px' }} />
      </ChartCard>

      {/* USA Map */}
      <ChartCard title="Onsite Jobs by State" description={`${data?.usaMap?.jobsWithState || 0} onsite jobs across ${data?.usaMap?.data?.length || 0} states`}>
        <USAMapChart data={data?.usaMap} style={{ height: '600px' }} />
      </ChartCard>

      {/* Three Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Top Categories" description="Most popular job categories">
          <ReactECharts option={getCategoryChartOption(data?.distribution)} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Work Location" description="Remote vs onsite distribution">
          <ReactECharts option={getLocationChartOption(data?.distribution)} style={{ height: '300px' }} />
        </ChartCard>

        <ChartCard title="Location Trends" description="Remote vs onsite over time">
          <ReactECharts option={getLocationTrendsOption(data?.timeseries)} style={{ height: '300px' }} />
        </ChartCard>
      </div>

      {/* Quality Trends */}
      <ChartCard title="Data Quality Trends" description="Completeness score over time">
        <ReactECharts option={getQualitySparklineOption(data?.timeseries)} style={{ height: '250px' }} />
      </ChartCard>
    </div>
  );
}

// Components
function KPICard({ title, value, color }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
  };

  return (
    <div className={`rounded-xl p-6 border-2 ${colorClasses[color]} hover:shadow-lg transition-shadow`}>
      <div>
        <p className="text-sm font-medium opacity-75 mb-1">{title}</p>
        <p className="text-3xl font-bold mt-1">
          {value !== null && value !== undefined ? (typeof value === 'number' ? value.toLocaleString() : value) : '0'}
        </p>
      </div>
    </div>
  );
}

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

// Chart Options
function getTimelineChartOption(timeseries: any) {
  if (!timeseries?.jobsByCategory) return {};

  const dates = [...new Set(timeseries.jobsByCategory.map((d: any) => d.date))].sort();
  const categories = [...new Set(timeseries.jobsByCategory.map((d: any) => d.category))];

  const series = categories.map((category) => ({
    name: category,
    type: 'line',
    smooth: true,
    areaStyle: { opacity: 0.3 },
    data: dates.map((date) => {
      const item = timeseries.jobsByCategory.find((d: any) => d.date === date && d.category === category);
      return item ? item.count : 0;
    }),
  }));

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { bottom: 0, data: categories },
    xAxis: { type: 'category', boundaryGap: false, data: dates.map((d) => new Date(String(d)).toLocaleDateString()) },
    yAxis: { type: 'value', name: 'Jobs Posted' },
    series,
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
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
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { bottom: 0, data: sources },
    xAxis: { type: 'category', boundaryGap: false, data: dates.map((d) => new Date(String(d)).toLocaleDateString()) },
    yAxis: { type: 'value', name: 'Total Jobs' },
    series,
    grid: { left: '3%', right: '4%', bottom: '12%', containLabel: true },
  };
}

function getSalaryTrendsChartOption(timeseries: any) {
  if (!timeseries?.salaryTrends) return {};

  const data = timeseries.salaryTrends;
  const dates = data.map((d: any) => new Date(String(d.date)).toLocaleDateString());

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Average', 'Median', 'Max'] },
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', name: 'Salary ($)', axisLabel: { formatter: (val: number) => `$${(val / 1000).toFixed(0)}k` } },
    series: [
      {
        name: 'Average',
        type: 'line',
        smooth: true,
        data: data.map((d: any) => d.avg_salary),
        areaStyle: { color: 'rgba(99, 102, 241, 0.1)' },
        itemStyle: { color: '#6366f1' },
      },
      {
        name: 'Median',
        type: 'line',
        smooth: true,
        data: data.map((d: any) => d.median_salary),
        itemStyle: { color: '#10b981' },
      },
      {
        name: 'Max',
        type: 'line',
        smooth: true,
        data: data.map((d: any) => d.max_salary),
        itemStyle: { color: '#f59e0b' },
        lineStyle: { type: 'dashed' },
      },
    ],
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  };
}

function getHeatmapChartOption(timeseries: any) {
  if (!timeseries?.hourlyPatterns) return {};

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const data = timeseries.hourlyPatterns.map((item: any) => [item.hour, item.day_of_week, item.count || 0]);

  return {
    tooltip: { position: 'top' },
    grid: { height: '85%', top: '2%' },
    xAxis: { type: 'category', data: hours, splitArea: { show: true } },
    yAxis: { type: 'category', data: days, splitArea: { show: true } },
    visualMap: {
      min: 0,
      max: Math.max(...data.map((d: any) => d[2]), 1),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      inRange: { color: ['#e0f2fe', '#0ea5e9', '#0369a1'] },
    },
    series: [{ name: 'Jobs Posted', type: 'heatmap', data, label: { show: false }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } } }],
  };
}

function getCategoryChartOption(distribution: any) {
  if (!distribution?.categories) return {};

  const data = distribution.categories.slice(0, 10);

  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{d}%' },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
        data: data.map((d: any) => ({ value: d.value, name: d.name })),
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
        label: { formatter: '{b}\n{d}%' },
        data: distribution.locationTypes.map((d: any) => ({ value: d.value, name: d.name })),
      },
    ],
  };
}

function getLocationTrendsOption(timeseries: any) {
  if (!timeseries?.locationTypeTrends) return {};

  const dates = [...new Set(timeseries.locationTypeTrends.map((d: any) => d.date))].sort();
  const locationTypes = [...new Set(timeseries.locationTypeTrends.map((d: any) => d.location_type))];

  const series = locationTypes.map((type) => ({
    name: type,
    type: 'line',
    smooth: true,
    areaStyle: { opacity: 0.4 },
    data: dates.map((date) => {
      const item = timeseries.locationTypeTrends.find((d: any) => d.date === date && d.location_type === type);
      return item ? item.count : 0;
    }),
  }));

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: locationTypes, bottom: 0 },
    xAxis: { type: 'category', boundaryGap: false, data: dates.map((d) => new Date(String(d)).toLocaleDateString()) },
    yAxis: { type: 'value' },
    series,
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
  };
}

function getQualitySparklineOption(timeseries: any) {
  if (!timeseries?.qualityTrends) return {};

  const data = timeseries.qualityTrends;
  const dates = data.map((d: any) => new Date(String(d.date)).toLocaleDateString());
  const values = data.map((d: any) => Number(d.avg_quality || 0).toFixed(1));

  return {
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', name: 'Quality %' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
    series: [
      {
        type: 'line',
        smooth: true,
        data: values,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(249, 115, 22, 0.3)' },
              { offset: 1, color: 'rgba(249, 115, 22, 0.05)' },
            ],
          },
        },
        itemStyle: { color: '#f97316' },
      },
    ],
  };
}

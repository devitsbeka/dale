/**
 * Admin Analytics - Professional data visualization interface
 */

'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import WorldMapChart from '@/components/admin/WorldMapChart';
import { useAdminTheme } from '@/contexts/AdminThemeContext';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface AnalyticsData {
  overview: any;
  distribution: any;
  timeseries: any;
  usaMap: any;
}

type TabType = 'explorer' | 'overview';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);
  const [activeTab, setActiveTab] = useState<TabType>('explorer');
  const { theme } = useAdminTheme();
  const isDark = theme === 'dark';

  // Chart controls
  const [timelineChartType, setTimelineChartType] = useState<'line' | 'bar'>('line');
  const [salaryChartSeries, setSalaryChartSeries] = useState<string[]>(['Average', 'Median', 'Max']);
  const [categoryChartType, setCategoryChartType] = useState<'pie' | 'bar'>('pie');
  const [sourceStackMode, setSourceStackMode] = useState<'stack' | 'line'>('stack');

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
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 text-sm">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left Tabs Panel */}
      <div className={`w-48 border-r flex flex-col ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        {/* Header */}
        <div className={`h-16 border-b px-4 flex items-center ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <h2 className={`text-sm font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Analytics</h2>
        </div>

        {/* Tabs */}
        <nav className="flex-1 py-2">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
              activeTab === 'explorer'
                ? isDark
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : isDark
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Explorer
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
              activeTab === 'overview'
                ? isDark
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : isDark
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
        </nav>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className={`h-16 border-b flex items-center justify-between px-6 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div>
            <h1 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {activeTab === 'explorer' ? 'Job Explorer' : 'Analytics Overview'}
            </h1>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {data?.overview?.totalJobs?.toLocaleString() || 0} job listings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className={`px-3 py-1.5 text-xs border focus:outline-none transition-colors ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-gray-300 focus:border-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 focus:border-gray-400'
              }`}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={180}>Last 6 months</option>
              <option value={365}>Last year</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 border-gray-300 text-gray-700'
              }`}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'explorer' ? (
          <div className="flex-1 overflow-hidden">
            <WorldMapChart
              data={data?.usaMap}
              style={{ height: '100%', width: '100%' }}
              isDark={isDark}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-[1920px] mx-auto space-y-4">
          {/* KPI Grid */}
          <div className="grid grid-cols-4 gap-3">
            <MetricPanel
              label="Total Jobs"
              value={data?.overview?.totalJobs?.toLocaleString() || '0'}
              isDark={isDark}
            />
            <MetricPanel
              label="Active"
              value={data?.overview?.activeJobs?.toLocaleString() || '0'}
              isDark={isDark}
            />
            <MetricPanel
              label="Avg Salary"
              value={`$${(data?.overview?.avgSalary || 0).toLocaleString()}`}
              isDark={isDark}
            />
            <MetricPanel
              label="Quality"
              value={`${Number(data?.overview?.avgQualityScore || 0).toFixed(1)}%`}
              isDark={isDark}
            />
          </div>

          {/* Main Timeline */}
          <ChartPanel isDark={isDark}
            title="Jobs Posted Over Time"
            actions={
              <ToggleGroup isDark={isDark}
                value={timelineChartType}
                onChange={setTimelineChartType}
                options={[
                  { value: 'line', label: 'Line' },
                  { value: 'bar', label: 'Bar' },
                ]}
              />
            }
          >
            <ReactECharts
              option={getTimelineChartOption(data?.timeseries, timelineChartType)}
              style={{ height: '350px' }}
              theme="dark"
            />
          </ChartPanel>

          {/* Two Column */}
          <div className="grid grid-cols-2 gap-3">
            <ChartPanel isDark={isDark}
              title="Jobs by Source"
              actions={
                <ToggleGroup isDark={isDark}
                  value={sourceStackMode}
                  onChange={setSourceStackMode}
                  options={[
                    { value: 'stack', label: 'Stack' },
                    { value: 'line', label: 'Lines' },
                  ]}
                />
              }
            >
              <ReactECharts
                option={getSourceStackChartOption(data?.timeseries, sourceStackMode)}
                style={{ height: '300px' }}
                theme="dark"
              />
            </ChartPanel>

            <ChartPanel isDark={isDark}
              title="Salary Trends"
              actions={
                <div className="flex gap-1">
                  {['Average', 'Median', 'Max'].map((series) => (
                    <button
                      key={series}
                      onClick={() => {
                        setSalaryChartSeries((prev) =>
                          prev.includes(series) ? prev.filter((s) => s !== series) : [...prev, series]
                        );
                      }}
                      className={`px-2 py-1 text-xs transition-colors ${
                        salaryChartSeries.includes(series)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {series}
                    </button>
                  ))}
                </div>
              }
            >
              <ReactECharts
                option={getSalaryTrendsChartOption(data?.timeseries, salaryChartSeries)}
                style={{ height: '300px' }}
                theme="dark"
              />
            </ChartPanel>
          </div>

          {/* Heatmap */}
          <ChartPanel title="Posting Patterns (Hour × Day)" isDark={isDark}>
            <ReactECharts
              option={getHeatmapChartOption(data?.timeseries)}
              style={{ height: '400px' }}
              theme="dark"
            />
          </ChartPanel>

          {/* USA Map */}
          <ChartPanel isDark={isDark}
            title="Onsite Jobs by State"
            subtitle={`${data?.usaMap?.jobsWithState || 0} jobs across ${data?.usaMap?.data?.length || 0} states`}
          >
            <WorldMapChart data={data?.usaMap} style={{ height: '500px' }} isDark={isDark} />
          </ChartPanel>

          {/* Three Column */}
          <div className="grid grid-cols-3 gap-3">
            <ChartPanel isDark={isDark}
              title="Categories"
              actions={
                <ToggleGroup isDark={isDark}
                  value={categoryChartType}
                  onChange={setCategoryChartType}
                  options={[
                    { value: 'pie', label: 'Pie' },
                    { value: 'bar', label: 'Bar' },
                  ]}
                />
              }
            >
              <ReactECharts
                option={getCategoryChartOption(data?.distribution, categoryChartType)}
                style={{ height: '280px' }}
                theme="dark"
              />
            </ChartPanel>

            <ChartPanel title="Work Location" isDark={isDark}>
              <ReactECharts
                option={getLocationChartOption(data?.distribution)}
                style={{ height: '280px' }}
                theme="dark"
              />
            </ChartPanel>

            <ChartPanel title="Location Trends" isDark={isDark}>
              <ReactECharts
                option={getLocationTrendsOption(data?.timeseries)}
                style={{ height: '280px' }}
                theme="dark"
              />
            </ChartPanel>
          </div>

              {/* Quality Trends */}
              <ChartPanel title="Data Quality Trends" isDark={isDark}>
                <ReactECharts
                  option={getQualitySparklineOption(data?.timeseries)}
                  style={{ height: '200px' }}
                  theme="dark"
                />
              </ChartPanel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Components
function MetricPanel({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div className={`border px-4 py-3 ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
      <div className={`text-[10px] font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{label}</div>
      <div className={`text-xl font-semibold font-mono ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{value}</div>
    </div>
  );
}

function ChartPanel({
  title,
  subtitle,
  actions,
  children,
  isDark,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div className={`border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'}`}>
      <div className={`border-b px-4 py-2.5 flex items-center justify-between ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div>
          <h3 className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{title}</h3>
          {subtitle && <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function ToggleGroup({
  value,
  onChange,
  options,
  isDark,
}: {
  value: string;
  onChange: (value: any) => void;
  options: Array<{ value: string; label: string }>;
  isDark: boolean;
}) {
  return (
    <div className={isDark ? 'flex gap-0.5 bg-gray-800' : 'flex gap-0.5 bg-gray-200'}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${
            value === option.value
              ? isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'
              : isDark ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Chart Options (with dark theme)
function getTimelineChartOption(timeseries: any, chartType: 'line' | 'bar' = 'line') {
  if (!timeseries?.jobsByCategory) return {};

  const dates = [...new Set(timeseries.jobsByCategory.map((d: any) => d.date))].sort();
  const categories = [...new Set(timeseries.jobsByCategory.map((d: any) => d.category))];

  const series = categories.map((category) => ({
    name: category,
    type: chartType,
    smooth: chartType === 'line',
    areaStyle: chartType === 'line' ? { opacity: 0.2 } : undefined,
    data: dates.map((date) => {
      const item = timeseries.jobsByCategory.find((d: any) => d.date === date && d.category === category);
      return item ? item.count : 0;
    }),
  }));

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { bottom: 0, textStyle: { color: '#9ca3af' } },
    xAxis: {
      type: 'category',
      boundaryGap: chartType === 'bar',
      data: dates.map((d) => new Date(String(d)).toLocaleDateString()),
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#374151' } },
      splitLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280' },
    },
    series,
    grid: { left: '3%', right: '4%', bottom: '12%', top: '5%', containLabel: true },
  };
}

function getSourceStackChartOption(timeseries: any, mode: 'stack' | 'line' = 'stack') {
  if (!timeseries?.jobsBySource) return {};

  const dates = [...new Set(timeseries.jobsBySource.map((d: any) => d.date))].sort();
  const sources = [...new Set(timeseries.jobsBySource.map((d: any) => d.source))];

  const series = sources.map((source) => ({
    name: source,
    type: 'line',
    stack: mode === 'stack' ? 'Total' : undefined,
    areaStyle: mode === 'stack' ? {} : undefined,
    smooth: true,
    data: dates.map((date) => {
      const item = timeseries.jobsBySource.find((d: any) => d.date === date && d.source === source);
      return item ? item.count : 0;
    }),
  }));

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#9ca3af' } },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates.map((d) => new Date(String(d)).toLocaleDateString()),
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#374151' } },
      splitLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280' },
    },
    series,
    grid: { left: '3%', right: '4%', bottom: '10%', top: '5%', containLabel: true },
  };
}

function getSalaryTrendsChartOption(timeseries: any, activeSeries: string[] = ['Average', 'Median', 'Max']) {
  if (!timeseries?.salaryTrends) return {};

  const data = timeseries.salaryTrends;
  const dates = data.map((d: any) => new Date(String(d.date)).toLocaleDateString());

  const allSeries = [
    {
      name: 'Average',
      type: 'line',
      smooth: true,
      data: data.map((d: any) => d.avg_salary),
      itemStyle: { color: '#3b82f6' },
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
    },
  ];

  const filteredSeries = allSeries.filter((s) => activeSeries.includes(s.name));

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { data: activeSeries, textStyle: { color: '#9ca3af' } },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#374151' } },
      splitLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280', formatter: (val: number) => `$${(val / 1000).toFixed(0)}k` },
    },
    series: filteredSeries,
    grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
  };
}

function getHeatmapChartOption(timeseries: any) {
  if (!timeseries?.hourlyPatterns) return {};

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const data = timeseries.hourlyPatterns.map((item: any) => [item.hour, item.day_of_week, item.count || 0]);

  return {
    backgroundColor: 'transparent',
    tooltip: { position: 'top' },
    grid: { height: '80%', top: '5%' },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: { show: true },
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280' },
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: { show: true },
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280' },
    },
    visualMap: {
      min: 0,
      max: Math.max(...data.map((d: any) => d[2]), 1),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '2%',
      textStyle: { color: '#9ca3af' },
      inRange: { color: ['#1e293b', '#0ea5e9', '#0369a1'] },
    },
    series: [{ type: 'heatmap', data, label: { show: false } }],
  };
}

function getCategoryChartOption(distribution: any, chartType: 'pie' | 'bar' = 'pie') {
  if (!distribution?.categories) return {};

  const data = distribution.categories.slice(0, 10);

  if (chartType === 'bar') {
    return {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#374151' } },
        splitLine: { lineStyle: { color: '#374151' } },
        axisLabel: { color: '#6b7280' },
      },
      yAxis: {
        type: 'category',
        data: data.map((d: any) => d.name).reverse(),
        axisLine: { lineStyle: { color: '#374151' } },
        axisLabel: { color: '#6b7280' },
      },
      series: [
        {
          type: 'bar',
          data: data.map((d: any) => d.value).reverse(),
          itemStyle: { color: '#3b82f6' },
        },
      ],
      grid: { left: '25%', right: '5%', bottom: '3%', top: '3%' },
    };
  }

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        label: { color: '#9ca3af' },
        data: data.map((d: any) => ({ value: d.value, name: d.name })),
      },
    ],
  };
}

function getLocationChartOption(distribution: any) {
  if (!distribution?.locationTypes) return {};

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        label: { color: '#9ca3af' },
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
    data: dates.map((date) => {
      const item = timeseries.locationTypeTrends.find((d: any) => d.date === date && d.location_type === type);
      return item ? item.count : 0;
    }),
  }));

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#9ca3af' } },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates.map((d) => new Date(String(d)).toLocaleDateString()),
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#374151' } },
      splitLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280' },
    },
    series,
    grid: { left: '3%', right: '4%', bottom: '12%', top: '5%', containLabel: true },
  };
}

function getQualitySparklineOption(timeseries: any) {
  if (!timeseries?.qualityTrends) return {};

  const data = timeseries.qualityTrends;
  const dates = data.map((d: any) => new Date(String(d.date)).toLocaleDateString());
  const values = data.map((d: any) => Number(d.avg_quality || 0).toFixed(1));

  return {
    backgroundColor: 'transparent',
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#374151' } },
      splitLine: { lineStyle: { color: '#374151' } },
      axisLabel: { color: '#6b7280' },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
    tooltip: { trigger: 'axis' },
    series: [
      {
        type: 'line',
        smooth: true,
        data: values,
        itemStyle: { color: '#f97316' },
      },
    ],
  };
}

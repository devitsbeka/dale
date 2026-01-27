'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as echarts from 'echarts';
import { stateData, getCostOfLivingLabel, stateNameToAbbr } from '@/lib/state-data';
import { extractCity, extractState } from '@/lib/location-utils';
import { formatJobText } from '@/lib/text-formatting';
import { getCategoryLabel } from '@/lib/category-utils';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface USAMapChartProps {
  data: any;
  style?: React.CSSProperties;
  isDark?: boolean;
}

interface StateJob {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  companyUrl: string | null;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  category: string | null;
  experienceLevel: string | null;
  employmentType: string | null;
  description: string;
  requirements: string | null;
  benefits: string | null;
  tags: string[];
  applyUrl: string;
  publishedAt: Date;
  source: string;
}

type MapMetric = 'best' | 'salary' | 'health' | 'tax';

export default function USAMapChart({ data, style, isDark = true }: USAMapChartProps) {
  const [mapRegistered, setMapRegistered] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [selectedMetric, setSelectedMetric] = useState<MapMetric>('best');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<StateJob | null>(null);
  const [stateJobs, setStateJobs] = useState<StateJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [displayedJobsCount, setDisplayedJobsCount] = useState(0);
  const [stateAvgSalary, setStateAvgSalary] = useState<number | null>(null);
  const [stateTopCity, setStateTopCity] = useState<string | null>(null);
  const [stateTopEmployers, setStateTopEmployers] = useState<Array<{ company: string; logo: string | null; jobCount: number }>>([]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<'full-time' | 'part-time' | 'contract' | 'internship'>('full-time');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showSourcesPopup, setShowSourcesPopup] = useState(false);
  const [enabledSources, setEnabledSources] = useState<Record<string, boolean>>({ usajobs: false });
  const [usajobsData, setUsajobsData] = useState<StateJob[]>([]);
  const jobsCache = useRef<Record<string, { jobs: StateJob[]; avgSalary: number | null; topCity: string | null; topEmployers: Array<{ company: string; logo: string | null; jobCount: number }> }>>({});

  useEffect(() => {
    // Register maps based on selected country
    if (typeof window !== 'undefined') {
      setMapRegistered(false);

      if (selectedCountry === 'US') {
        // Load US states map
        fetch('https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json')
          .then(response => response.json())
          .then(usaJson => {
            echarts.registerMap('MAP', usaJson);
            setMapRegistered(true);
          })
          .catch(error => console.error('Error loading US map:', error));
      } else {
        // Load world countries map for other countries
        fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
          .then(response => response.json())
          .then(worldJson => {
            echarts.registerMap('MAP', worldJson);
            setMapRegistered(true);
          })
          .catch(error => console.error('Error loading world map:', error));
      }
    }
  }, [selectedCountry]);

  useEffect(() => {
    // Fetch USA-wide stats on mount
    fetchUSAJobs();
  }, []);

  useEffect(() => {
    // Fetch USAJobs data when enabled
    if (enabledSources.usajobs) {
      console.log('[USAJobs] Toggle enabled, fetching data...');
      fetchUSAJobsData();
    } else {
      console.log('[USAJobs] Toggle disabled, clearing data');
      setUsajobsData([]);
      // Refetch current view without USAJobs data
      if (selectedState) {
        fetchStateJobs(selectedState);
      } else {
        fetchUSAJobs();
      }
    }
  }, [enabledSources.usajobs]);

  useEffect(() => {
    if (selectedState) {
      // Clear old data immediately to prevent showing wrong state's data
      setStateJobs([]);
      setStateAvgSalary(null);
      setStateTopCity(null);
      setStateTopEmployers([]);
      setDisplayedJobsCount(0);
      setSelectedEmploymentType('full-time');
      setSelectedCompany(null);
      setLoadingJobs(true);
      fetchStateJobs(selectedState);
    }
  }, [selectedState]);

  const fetchUSAJobs = async () => {
    // Check cache first
    if (jobsCache.current['USA']) {
      const cached = jobsCache.current['USA'];
      setStateJobs(cached.jobs);
      setStateAvgSalary(cached.avgSalary);
      setStateTopCity(cached.topCity);
      setStateTopEmployers(cached.topEmployers);

      // Show all jobs instantly
      const filteredJobs = cached.jobs.filter((job: StateJob) =>
        job.employmentType?.toLowerCase() === 'full-time'
      );
      setDisplayedJobsCount(filteredJobs.length);
      return;
    }

    setLoadingJobs(true);
    setDisplayedJobsCount(0);
    try {
      const response = await fetch(`/api/admin/analytics/usa-jobs`);
      const result = await response.json();
      let jobs = result.jobs || [];

      // Merge with USAJobs data if enabled
      jobs = getMergedJobs(jobs);

      // Recalculate stats with merged data
      const companyCounts: Record<string, { count: number; logo: string | null }> = {};
      const cityCounts: Record<string, number> = {};

      jobs.forEach((job: StateJob) => {
        if (job.company) {
          if (!companyCounts[job.company]) {
            companyCounts[job.company] = { count: 0, logo: job.companyLogo };
          }
          companyCounts[job.company].count++;
        }
        if (job.location) {
          const city = extractCity(job.location);
          if (city && city.length > 2) {
            cityCounts[city] = (cityCounts[city] || 0) + 1;
          }
        }
      });

      const topCity = Object.entries(cityCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || result.topCity;
      const topEmployers = Object.entries(companyCounts)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 10)
        .map(([company, data]) => ({ company, logo: data.logo, jobCount: data.count }));

      // Cache the results
      jobsCache.current['USA'] = {
        jobs,
        avgSalary: result.avgSalary,
        topCity,
        topEmployers
      };
      setStateJobs(jobs);
      setStateAvgSalary(result.avgSalary);
      setStateTopCity(topCity);
      setStateTopEmployers(topEmployers);

      // Show all jobs instantly
      const filteredJobs = jobs.filter((job: StateJob) =>
        job.employmentType?.toLowerCase() === 'full-time'
      );
      setDisplayedJobsCount(filteredJobs.length);
    } catch (error) {
      console.error('Error fetching USA jobs:', error);
      setStateJobs([]);
      setStateAvgSalary(null);
      setStateTopCity(null);
      setStateTopEmployers([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchStateJobs = async (state: string) => {
    // Check cache first
    if (jobsCache.current[state]) {
      const cached = jobsCache.current[state];
      setStateJobs(cached.jobs);
      setStateAvgSalary(cached.avgSalary);
      setStateTopCity(cached.topCity);
      setStateTopEmployers(cached.topEmployers);

      // Show all jobs instantly for cached data
      const filteredJobs = cached.jobs.filter((job: StateJob) =>
        job.employmentType?.toLowerCase() === 'full-time'
      );
      setDisplayedJobsCount(filteredJobs.length);
      setLoadingJobs(false);
      return;
    }

    setLoadingJobs(true);
    setDisplayedJobsCount(0);
    try {
      const response = await fetch(`/api/admin/analytics/state-jobs?state=${state}`);
      const result = await response.json();
      let jobs = result.jobs || [];

      // Merge with USAJobs data if enabled (filter by state)
      if (enabledSources.usajobs && usajobsData.length > 0) {
        const { extractState } = await import('@/lib/location-utils');
        const stateUSAJobs = usajobsData.filter(job => {
          const jobState = extractState(job.location);
          return jobState === state;
        });
        jobs = [...jobs, ...stateUSAJobs];
      }

      // Recalculate stats with merged data
      const companyCounts: Record<string, { count: number; logo: string | null }> = {};
      const cityCounts: Record<string, number> = {};

      jobs.forEach((job: StateJob) => {
        if (job.company) {
          if (!companyCounts[job.company]) {
            companyCounts[job.company] = { count: 0, logo: job.companyLogo };
          }
          companyCounts[job.company].count++;
        }
        if (job.location) {
          const city = job.location.split(',')[0]?.trim();
          if (city && city.length > 2) {
            cityCounts[city] = (cityCounts[city] || 0) + 1;
          }
        }
      });

      const topCity = Object.entries(cityCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || result.topCity;
      const topEmployers = Object.entries(companyCounts)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 10)
        .map(([company, data]) => ({ company, logo: data.logo, jobCount: data.count }));

      // Cache the results
      jobsCache.current[state] = {
        jobs,
        avgSalary: result.avgSalary,
        topCity,
        topEmployers
      };
      setStateJobs(jobs);
      setStateAvgSalary(result.avgSalary);
      setStateTopCity(topCity);
      setStateTopEmployers(topEmployers);

      // Show all jobs instantly - filter by employment type
      const filteredJobs = jobs.filter((job: StateJob) =>
        job.employmentType?.toLowerCase() === 'full-time'
      );
      setDisplayedJobsCount(filteredJobs.length);
    } catch (error) {
      console.error('Error fetching state jobs:', error);
      setStateJobs([]);
      setStateAvgSalary(null);
      setStateTopCity(null);
      setStateTopEmployers([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchUSAJobsData = async () => {
    try {
      console.log('[USAJobs] Fetching from API...');
      const response = await fetch('/api/admin/analytics/usajobs-data');
      const result = await response.json();
      const jobs = result.jobs || [];
      console.log('[USAJobs] Fetched', jobs.length, 'jobs');
      setUsajobsData(jobs);

      // Clear cache to force refetch with new data
      jobsCache.current = {};

      // Refetch current view with merged data
      if (selectedState) {
        console.log('[USAJobs] Refetching state:', selectedState);
        fetchStateJobs(selectedState);
      } else {
        console.log('[USAJobs] Refetching USA-wide data');
        fetchUSAJobs();
      }
    } catch (error) {
      console.error('Error fetching USAJobs data:', error);
      setUsajobsData([]);
    }
  };

  // Helper to merge our jobs with USAJobs data
  const getMergedJobs = (ourJobs: StateJob[]) => {
    if (!enabledSources.usajobs || usajobsData.length === 0) {
      return ourJobs;
    }
    return [...ourJobs, ...usajobsData];
  };

  const handleStateClick = (params: any) => {
    // Only handle intentional user clicks, not programmatic events
    if (params.name && params.event && params.event.type === 'click') {
      // Convert full state name to abbreviation
      const stateAbbr = stateNameToAbbr[params.name] || params.name;
      setSelectedState(stateAbbr);
    }
  };

  if (!mapRegistered || !data?.data) {
    return (
      <div className="flex items-center justify-center" style={style || { height: '600px' }}>
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  // Calculate dynamic map data with USAJobs counts
  const getMapData = () => {
    if (!enabledSources.usajobs || usajobsData.length === 0) {
      return data.data;
    }

    // Count USAJobs by state
    const usajobsStateCounts: Record<string, number> = {};
    usajobsData.forEach((job: StateJob) => {
      const state = extractState(job.location);
      if (state) {
        usajobsStateCounts[state] = (usajobsStateCounts[state] || 0) + 1;
      }
    });

    console.log('[USAJobs] State counts:', usajobsStateCounts);

    // Merge counts with original data
    return data.data.map((stateData: any) => {
      const stateAbbr = Object.entries(stateNameToAbbr).find(
        ([name]) => name === stateData.name
      )?.[1];
      const additionalJobs = stateAbbr ? (usajobsStateCounts[stateAbbr] || 0) : 0;
      return {
        ...stateData,
        jobCount: stateData.jobCount + additionalJobs
      };
    });
  };

  // Prepare map data based on selected metric
  const mapData = getMapData().map((stateInfo: any) => {
    const stateAbbr = Object.entries(stateNameToAbbr).find(
      ([name]) => name === stateInfo.name
    )?.[1];

    const state = stateAbbr ? stateData[stateAbbr] : null;

    let value = stateInfo.value; // Default: salary
    if (selectedMetric === 'best' && state) {
      // Composite "Best" score combining salary, quality of life, and low tax
      const salaryScore = ((stateInfo.value - 76000) / (135000 - 76000)) * 100; // Normalize salary to 0-100
      const qolScore = state.qualityOfLife; // Already 0-100
      const taxScore = ((13.3 - state.stateTaxRate) / 13.3) * 100; // Invert tax: 0% tax = 100, 13.3% = 0
      value = (salaryScore + qolScore + taxScore) / 3; // Average of three factors
    } else if (selectedMetric === 'health' && state) {
      value = state.qualityOfLife;
    } else if (selectedMetric === 'tax' && state) {
      // Use actual tax rate (higher = warmer color)
      value = state.stateTaxRate;
    }

    return {
      ...stateInfo,
      value,
      originalValue: stateInfo.value // Keep salary for reference
    };
  });

  const maxValue = Math.max(...mapData.map((d: any) => d.value), 1);
  const minValue = selectedMetric === 'health'
    ? Math.min(...mapData.map((d: any) => d.value), 0)  // Use actual min for Health to spread gradient better
    : selectedMetric === 'tax'
    ? Math.min(...mapData.map((d: any) => d.value), 0)  // Use actual min for tax
    : selectedMetric === 'best'
    ? Math.min(...mapData.map((d: any) => d.value), 0)  // Use actual min for Best
    : 0;  // Salary starts at 0

  // Dynamic labels based on metric
  const metricConfig = {
    'best': {
      highLabel: 'Best',
      lowLabel: 'Worst',
      formatter: (value: number) => value > 0 ? `${value.toFixed(0)}` : '0',
      tooltip: (params: any, jobCount: number) => {
        if (params.value) {
          return `${params.name}<br/>Overall Score: ${params.value.toFixed(0)}/100<br/>Jobs: ${jobCount}`;
        }
        return `${params.name}<br/>Overall Score: N/A<br/>Jobs: 0`;
      }
    },
    'salary': {
      highLabel: 'High Salary',
      lowLabel: 'Low Salary',
      formatter: (value: number) => value > 0 ? `$${Math.round(value / 1000)}k` : '$0',
      tooltip: (params: any, jobCount: number) => {
        if (params.value) {
          return `${params.name}<br/>Avg Salary: $${params.value.toLocaleString()}<br/>Jobs: ${jobCount}`;
        }
        return `${params.name}<br/>Avg Salary: $0<br/>Jobs: 0`;
      }
    },
    'health': {
      highLabel: 'High Health',
      lowLabel: 'Low Health',
      formatter: (value: number) => value > 0 ? `${value.toFixed(0)}` : '0',
      tooltip: (params: any, jobCount: number) => {
        if (params.value) {
          return `${params.name}<br/>Health Score: ${params.value.toFixed(0)}/100<br/>Jobs: ${jobCount}`;
        }
        return `${params.name}<br/>Health Score: N/A<br/>Jobs: 0`;
      }
    },
    'tax': {
      highLabel: 'High Tax',
      lowLabel: 'Low Tax',
      formatter: (value: number) => value >= 0 ? `${value.toFixed(1)}%` : '0%',
      tooltip: (params: any, jobCount: number) => {
        if (params.value >= 0) {
          return `${params.name}<br/>State Tax: ${params.value.toFixed(1)}%<br/>Jobs: ${jobCount}`;
        }
        return `${params.name}<br/>State Tax: N/A<br/>Jobs: 0`;
      }
    }
  };

  const currentConfig = metricConfig[selectedMetric];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const jobCount = params.data?.jobCount || 0;
        return currentConfig.tooltip(params, jobCount);
      },
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: isDark ? '#e5e7eb' : '#1f2937' }
    },
    visualMap: {
      min: minValue,
      max: maxValue,
      orient: 'horizontal',  // Horizontal orientation
      left: 'center',
      bottom: '3%',
      text: [currentConfig.highLabel, currentConfig.lowLabel],
      calculable: true,
      itemWidth: 20,  // Width of the color bar
      itemHeight: 140, // Height becomes length in horizontal mode
      textStyle: {
        color: isDark ? '#9ca3af' : '#6b7280'
      },
      formatter: currentConfig.formatter,
      inRange: {
        // Blue (cold/low) to Yellow/Red (warm/high) gradient for all metrics
        color: isDark
          ? ['#1e3a8a', '#3b82f6', '#60a5fa', '#fbbf24', '#f97316', '#ef4444']  // Dark: deep blue → bright blue → light blue → yellow → orange → red
          : ['#dbeafe', '#93c5fd', '#60a5fa', '#fde68a', '#fbbf24', '#f97316']  // Light: light blue → mid blue → bright blue → light yellow → yellow → orange
      },
      // Controller uses same blue-to-orange gradient
      controller: {
        inRange: {
          color: isDark
            ? ['#1e3a8a', '#3b82f6', '#60a5fa', '#fbbf24', '#f97316', '#ef4444']
            : ['#dbeafe', '#93c5fd', '#60a5fa', '#fde68a', '#fbbf24', '#f97316']
        }
      }
    },
    series: [
      {
        name: 'Onsite Jobs',
        type: 'map',
        map: 'MAP',
        roam: 'move',  // Only allow panning, not scroll zoom
        center: selectedCountry === 'US' ? [-92, 38] : [0, 30],  // US center or world center
        scaleLimit: {
          min: 1,
          max: selectedCountry === 'US' ? 5 : 8
        },
        zoom: selectedCountry === 'US' ? 4.2 : 1.5,  // Zoomed in for US, out for world
        label: {
          show: false
        },
        itemStyle: {
          borderColor: isDark ? '#374151' : '#d1d5db',
          borderWidth: 1
        },
        emphasis: {
          label: {
            show: true,
            color: isDark ? '#fff' : '#1f2937'  // White for dark mode, dark gray for light mode
          },
          itemStyle: {
            areaColor: isDark ? '#fb923c' : '#fdba74',  // Warm orange hover for all metrics
            borderWidth: 0
          }
        },
        data: mapData
      }
    ]
  };

  const stateInfo = selectedState ? stateData[selectedState] : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .usa-map-panel-scroll {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
        }
        .usa-map-panel-scroll::-webkit-scrollbar {
          display: none; /* Chrome/Safari/Opera */
        }
      `}} />
      <div className="relative flex gap-4" style={style}>
      {/* Map */}
      <div
        className="relative z-0"
        style={{
          width: '64%',
          transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Country Selector - Top left */}
        <div className="absolute top-4 left-4 z-10">
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedState(null); // Reset state selection when changing country
            }}
            className={`text-[10px] px-3 py-1.5 border font-medium transition-colors ${
              isDark
                ? 'border-gray-700 bg-gray-900 text-gray-300'
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="AU">Australia</option>
            <option value="IN">India</option>
            <option value="MX">Mexico</option>
            <option value="BR">Brazil</option>
            <option value="JP">Japan</option>
          </select>
        </div>

        {/* Metric Tabs - Positioned on top of map */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          <button
            onClick={() => setSelectedMetric('best')}
            className={`text-[10px] px-3 py-1.5 border font-medium transition-colors whitespace-nowrap ${
              selectedMetric === 'best'
                ? isDark
                  ? 'border-gray-600 bg-gray-800 text-gray-100'
                  : 'border-gray-400 bg-gray-100 text-gray-900'
                : isDark
                ? 'border-gray-700 text-gray-400 hover:bg-gray-800'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Best
          </button>
          <button
            onClick={() => setSelectedMetric('salary')}
            className={`text-[10px] px-3 py-1.5 border font-medium transition-colors whitespace-nowrap ${
              selectedMetric === 'salary'
                ? isDark
                  ? 'border-gray-600 bg-gray-800 text-gray-100'
                  : 'border-gray-400 bg-gray-100 text-gray-900'
                : isDark
                ? 'border-gray-700 text-gray-400 hover:bg-gray-800'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Salary
          </button>
          <button
            onClick={() => setSelectedMetric('health')}
            className={`text-[10px] px-3 py-1.5 border font-medium transition-colors whitespace-nowrap ${
              selectedMetric === 'health'
                ? isDark
                  ? 'border-gray-600 bg-gray-800 text-gray-100'
                  : 'border-gray-400 bg-gray-100 text-gray-900'
                : isDark
                ? 'border-gray-700 text-gray-400 hover:bg-gray-800'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Health
          </button>
          <button
            onClick={() => setSelectedMetric('tax')}
            className={`text-[10px] px-3 py-1.5 border font-medium transition-colors whitespace-nowrap ${
              selectedMetric === 'tax'
                ? isDark
                  ? 'border-gray-600 bg-gray-800 text-gray-100'
                  : 'border-gray-400 bg-gray-100 text-gray-900'
                : isDark
                ? 'border-gray-700 text-gray-400 hover:bg-gray-800'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tax
          </button>
        </div>
        <ReactECharts
          key={`map-${selectedCountry}`}
          option={option}
          onEvents={{ click: handleStateClick }}
          style={{
            height: style?.height || '500px',
            transition: 'opacity 400ms ease-in-out',
            opacity: mapRegistered ? 1 : 0.5
          }}
        />
      </div>

      {/* Side Panel */}
      <div
        className={`overflow-hidden relative z-10 ${
          isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'
        }`}
        style={{
          width: '36%',
          opacity: 1,
          borderLeftWidth: '1px',
          paddingLeft: '1rem',
          height: style?.height || '500px',
          transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) 100ms, padding 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {((selectedState && stateInfo) || !selectedState) && (
        <div className="overflow-y-auto h-full usa-map-panel-scroll"
          style={{
            animation: 'slideInRight 500ms cubic-bezier(0.4, 0, 0.2, 1) 150ms both'
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              {selectedJob && (
                <button
                  onClick={() => setSelectedJob(null)}
                  className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                  title="Back to state"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              )}
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {selectedJob ? selectedJob.title : selectedState ? stateInfo?.name : 'United States'}
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  {selectedJob ? selectedJob.company : selectedState ? 'State Information' : 'Nationwide Statistics'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!selectedJob && (
                <div className="relative">
                  <button
                    onClick={() => setShowSourcesPopup(!showSourcesPopup)}
                    className={`text-[10px] px-3 py-1.5 border font-medium transition-colors ${
                      isDark
                        ? 'border-gray-700 text-gray-400 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Sources {enabledSources.usajobs && <span className="ml-1 text-blue-500">●</span>}
                  </button>
                  {showSourcesPopup && (
                    <div className={`absolute right-0 top-full mt-2 w-48 border shadow-lg z-50 ${
                      isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Data Sources
                          </span>
                          <button
                            onClick={() => setShowSourcesPopup(false)}
                            className={`text-[10px] ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            ✕
                          </button>
                        </div>
                        <label className="flex items-center justify-between py-2 cursor-pointer">
                          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            USAJobs.gov
                          </span>
                          <input
                            type="checkbox"
                            checked={enabledSources.usajobs}
                            onChange={(e) => {
                              setEnabledSources({ ...enabledSources, usajobs: e.target.checked });
                            }}
                            className="w-4 h-4"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {selectedState && (
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setSelectedState(null);
                  setSelectedEmploymentType('full-time');
                  setSelectedCompany(null);
                  fetchUSAJobs();
                }}
                className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              )}
            </div>
          </div>

          {/* Job Detail View */}
          {selectedJob ? (
            <div className="space-y-4">
              {/* Company Info */}
              <div className="flex items-start gap-3">
                {selectedJob.companyLogo && (
                  <img
                    src={selectedJob.companyLogo}
                    alt={selectedJob.company}
                    className={`w-12 h-12 object-contain border ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} p-1`}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <div className="flex-1">
                  <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedJob.company}
                  </div>
                  {extractCity(selectedJob.location) && (
                    <div className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{extractCity(selectedJob.location)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Meta */}
              <div className="grid grid-cols-2 gap-2">
                {selectedJob.category && (
                  <div className={`border p-2 ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Category</div>
                    <div className={`text-xs font-medium mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{getCategoryLabel(selectedJob.category)}</div>
                  </div>
                )}
                {selectedJob.experienceLevel && (
                  <div className={`border p-2 ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Level</div>
                    <div className={`text-xs font-medium mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{selectedJob.experienceLevel}</div>
                  </div>
                )}
                {selectedJob.employmentType && (
                  <div className={`border p-2 ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Type</div>
                    <div className={`text-xs font-medium mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{selectedJob.employmentType}</div>
                  </div>
                )}
                {(selectedJob.salaryMin || selectedJob.salaryMax) && (
                  <div className={`border p-2 ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Salary</div>
                    <div className={`text-xs font-medium mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {selectedJob.salaryMin && selectedJob.salaryMax
                        ? `$${selectedJob.salaryMin.toLocaleString()} - $${selectedJob.salaryMax.toLocaleString()}`
                        : selectedJob.salaryMin
                        ? `From $${selectedJob.salaryMin.toLocaleString()}`
                        : `Up to $${selectedJob.salaryMax?.toLocaleString()}`}
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {selectedJob.tags && selectedJob.tags.length > 0 && (
                <div>
                  <h4 className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedJob.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] px-2 py-0.5 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Description</h4>
                <div
                  className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}
                  dangerouslySetInnerHTML={{
                    __html: formatJobText(selectedJob.description, 800)
                  }}
                />
              </div>

              {/* Requirements */}
              {selectedJob.requirements && (
                <div>
                  <h4 className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Requirements</h4>
                  <div
                    className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}
                    dangerouslySetInnerHTML={{
                      __html: formatJobText(selectedJob.requirements, 600)
                    }}
                  />
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && (
                <div>
                  <h4 className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Benefits</h4>
                  <div
                    className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}
                    dangerouslySetInnerHTML={{
                      __html: formatJobText(selectedJob.benefits, 400)
                    }}
                  />
                </div>
              )}

              {/* Apply Button */}
              <a
                href={selectedJob.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-center text-xs font-medium py-2 px-4 border ${
                  isDark
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                } transition-colors`}
              >
                Apply Now
              </a>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`border p-3 ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Average Salary</div>
                  <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {stateAvgSalary ? `$${stateAvgSalary.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
                <div className={`border p-3 ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Top City</div>
                  <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {stateTopCity || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Companies */}
              {(() => {
                // Build company list dynamically from jobs matching selected employment type
                const jobsByType = stateJobs.filter((job: StateJob) =>
                  job.employmentType?.toLowerCase() === selectedEmploymentType
                );

                // Count jobs per company for this employment type
                const companyCounts: Record<string, { count: number; logo: string | null }> = {};
                jobsByType.forEach((job: StateJob) => {
                  if (job.company) {
                    if (!companyCounts[job.company]) {
                      companyCounts[job.company] = { count: 0, logo: job.companyLogo };
                    }
                    companyCounts[job.company].count++;
                  }
                });

                // Get top companies for this employment type (limit to 10)
                const filteredCompanies = Object.entries(companyCounts)
                  .sort(([, a], [, b]) => b.count - a.count)
                  .slice(0, 10)
                  .map(([company, data]) => ({
                    company,
                    logo: data.logo,
                    jobCount: data.count
                  }));

                return (
                  <div className="mb-4" style={{ minHeight: '80px' }}>
                    <h4 className={`text-xs font-medium mb-3 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                      Companies ({filteredCompanies.length})
                    </h4>
                    {filteredCompanies.length > 0 ? (
                    <div
                      className="flex gap-2 overflow-x-auto pb-2"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      <style dangerouslySetInnerHTML={{
                        __html: `
                          .flex.gap-2.overflow-x-auto::-webkit-scrollbar {
                            display: none;
                          }
                        `
                      }} />
                      {filteredCompanies.map((employer, idx) => {
                        const isSelected = selectedCompany === employer.company;
                        return (
                          <div
                            key={idx}
                            className={`relative group flex-shrink-0`}
                            title={`${employer.company} (${employer.jobCount} job${employer.jobCount > 1 ? 's' : ''})`}
                            onClick={() => {
                              if (selectedCompany === employer.company) {
                                setSelectedCompany(null); // Deselect if clicking same company
                              } else {
                                setSelectedCompany(employer.company);
                              }
                              // No animation, just instantly filter
                              const filteredJobs = stateJobs.filter((job: StateJob) =>
                                job.employmentType?.toLowerCase() === selectedEmploymentType &&
                                (selectedCompany === employer.company ? true : job.company === employer.company)
                              );
                              setDisplayedJobsCount(filteredJobs.length); // Show all immediately
                            }}
                          >
                            {employer.logo ? (
                              <img
                                src={employer.logo}
                                alt={employer.company}
                                className={`w-10 h-10 object-contain border-2 rounded-lg ${
                                  isSelected
                                    ? isDark
                                      ? 'border-blue-500 bg-gray-900'
                                      : 'border-blue-600 bg-white'
                                    : isDark
                                    ? 'border-gray-800 bg-gray-900 hover:border-blue-500'
                                    : 'border-gray-200 bg-white hover:border-blue-400'
                                } transition-all cursor-pointer`}
                                onError={(e) => {
                                  // Fallback to company initial if logo fails
                                  e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div
                              className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-semibold ${
                                isSelected
                                  ? isDark
                                    ? 'border-blue-500 bg-gray-900 text-blue-400'
                                    : 'border-blue-600 bg-white text-blue-600'
                                  : isDark
                                  ? 'border-gray-800 bg-gray-900 text-gray-400 hover:border-blue-500'
                                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-400'
                              } transition-all cursor-pointer ${employer.logo ? 'hidden' : 'flex'}`}
                            >
                              {employer.company.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    ) : (
                      <div className={`text-[10px] py-2 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                        No companies with {selectedEmploymentType} positions
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Jobs List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    Jobs in {selectedState ? stateInfo?.name : 'United States'}
                  </h4>
                  <span className={`text-[10px] font-semibold ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    Total: {stateJobs.length}
                  </span>
                </div>

                {/* Employment Type Tabs */}
                <div className={`flex gap-1 mb-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  {[
                    { key: 'full-time', label: 'FT' },
                    { key: 'part-time', label: 'PT' },
                    { key: 'contract', label: 'Contract' },
                    { key: 'internship', label: 'Internship' }
                  ].map((tab) => {
                    const tabKey = tab.key as 'full-time' | 'part-time' | 'contract' | 'internship';
                    const count = stateJobs.filter((job: StateJob) =>
                      job.employmentType?.toLowerCase() === tabKey
                    ).length;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => {
                          setSelectedEmploymentType(tabKey);
                          setSelectedCompany(null); // Reset company filter when switching tabs
                          // No animation, just instantly filter
                          const filteredJobs = stateJobs.filter((job: StateJob) =>
                            job.employmentType?.toLowerCase() === tabKey
                          );
                          setDisplayedJobsCount(filteredJobs.length); // Show all immediately
                        }}
                        className={`text-[10px] px-3 py-1.5 font-medium transition-colors border-b-2 whitespace-nowrap ${
                          selectedEmploymentType === tabKey
                            ? isDark
                              ? 'text-blue-400 border-blue-400'
                              : 'text-blue-600 border-blue-600'
                            : isDark
                            ? 'text-gray-500 border-transparent hover:text-gray-300'
                            : 'text-gray-600 border-transparent hover:text-gray-900'
                        }`}
                      >
                        {tab.label} ({count})
                      </button>
                    );
                  })}
                </div>

                {(() => {
                  const filteredJobs = stateJobs.filter((job: StateJob) =>
                    job.employmentType?.toLowerCase() === selectedEmploymentType &&
                    (!selectedCompany || job.company === selectedCompany)
                  );

                  if (loadingJobs && filteredJobs.length === 0) {
                    return (
                      <div className="flex items-center justify-center py-8">
                        <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-blue-400' : 'border-blue-600'}`}></div>
                      </div>
                    );
                  }

                  return filteredJobs.length === 0 ? (
                    <div className={`text-xs py-4 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                      No {selectedEmploymentType} jobs found in this state
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredJobs.slice(0, displayedJobsCount).map((job, idx) => (
                      <div
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`border p-2 transition-colors cursor-pointer ${
                          isDark
                            ? 'border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 hover:border-blue-500'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {job.companyLogo && (
                            <img
                              src={job.companyLogo}
                              alt={job.company}
                              className={`w-8 h-8 object-contain border ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} p-0.5 flex-shrink-0`}
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{job.title}</div>
                            <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{job.company}</div>
                            {extractCity(job.location) && (
                              <div className={`text-[10px] mt-1 flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span>{extractCity(job.location)}</span>
                              </div>
                            )}
                            {(job.salaryMin || job.salaryMax) && (
                              <div className={`text-[10px] mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {job.salaryMin && job.salaryMax
                                  ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
                                  : job.salaryMin
                                  ? `From $${job.salaryMin.toLocaleString()}`
                                  : `Up to $${job.salaryMax?.toLocaleString()}`}
                              </div>
                            )}
                          </div>
                        </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </div>
        )}
      </div>
    </div>
    </>
  );
}

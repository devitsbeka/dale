'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as echarts from 'echarts';
import { stateData, getCostOfLivingLabel, stateNameToAbbr } from '@/lib/state-data';
import { extractCity } from '@/lib/location-utils';
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

export default function USAMapChart({ data, style, isDark = true }: USAMapChartProps) {
  const [mapRegistered, setMapRegistered] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<StateJob | null>(null);
  const [stateJobs, setStateJobs] = useState<StateJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [displayedJobsCount, setDisplayedJobsCount] = useState(0);
  const [stateAvgSalary, setStateAvgSalary] = useState<number | null>(null);
  const [stateTopCity, setStateTopCity] = useState<string | null>(null);
  const [stateTopEmployers, setStateTopEmployers] = useState<Array<{ company: string; logo: string | null; jobCount: number }>>([]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<'full-time' | 'part-time' | 'internship'>('full-time');
  const jobsCache = useRef<Record<string, { jobs: StateJob[]; avgSalary: number | null; topCity: string | null; topEmployers: Array<{ company: string; logo: string | null; jobCount: number }> }>>({});

  useEffect(() => {
    // Register USA map with ECharts using reliable GeoJSON source
    if (typeof window !== 'undefined') {
      fetch('https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json')
        .then(response => response.json())
        .then(usaJson => {
          echarts.registerMap('USA', usaJson);
          setMapRegistered(true);
        })
        .catch(error => {
          console.error('Error loading USA map:', error);
        });
    }
  }, []);

  useEffect(() => {
    if (selectedState) {
      setSelectedEmploymentType('full-time');
      fetchStateJobs(selectedState);
    }
  }, [selectedState]);

  const fetchStateJobs = async (state: string) => {
    // Check cache first
    if (jobsCache.current[state]) {
      const cached = jobsCache.current[state];
      setStateJobs(cached.jobs);
      setStateAvgSalary(cached.avgSalary);
      setStateTopCity(cached.topCity);
      setStateTopEmployers(cached.topEmployers);
      setDisplayedJobsCount(0);

      // Progressively reveal cached jobs (faster) - filter by employment type
      const filteredJobs = cached.jobs.filter((job: StateJob) =>
        job.employmentType?.toLowerCase() === 'full-time'
      );
      if (filteredJobs.length > 0) {
        const revealJobs = async () => {
          for (let i = 1; i <= filteredJobs.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 15));
            setDisplayedJobsCount(i);
          }
        };
        revealJobs();
      }
      return;
    }

    setLoadingJobs(true);
    setDisplayedJobsCount(0);
    try {
      const response = await fetch(`/api/admin/analytics/state-jobs?state=${state}`);
      const result = await response.json();
      const jobs = result.jobs || [];

      // Cache the results
      jobsCache.current[state] = {
        jobs,
        avgSalary: result.avgSalary,
        topCity: result.topCity,
        topEmployers: result.topEmployers || []
      };
      setStateJobs(jobs);
      setStateAvgSalary(result.avgSalary);
      setStateTopCity(result.topCity);
      setStateTopEmployers(result.topEmployers || []);

      // Progressively reveal jobs with staggered animation - filter by employment type
      const filteredJobs = jobs.filter((job: StateJob) =>
        job.employmentType?.toLowerCase() === 'full-time'
      );
      if (filteredJobs.length > 0) {
        const revealJobs = async () => {
          for (let i = 1; i <= filteredJobs.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 30));
            setDisplayedJobsCount(i);
          }
        };
        revealJobs();
      }
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

  const maxValue = Math.max(...data.data.map((d: any) => d.value), 1);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const jobCount = params.data?.jobCount || 0;
        if (params.value) {
          return `${params.name}<br/>Avg Salary: $${params.value.toLocaleString()}<br/>Jobs: ${jobCount}`;
        }
        return `${params.name}<br/>Avg Salary: $0<br/>Jobs: 0`;
      },
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: isDark ? '#e5e7eb' : '#1f2937' }
    },
    visualMap: {
      min: 0,
      max: maxValue,
      left: 'left',
      bottom: '5%',
      text: ['High Salary', 'Low Salary'],
      calculable: true,
      textStyle: {
        color: isDark ? '#9ca3af' : '#6b7280'
      },
      formatter: (value: number) => {
        return value > 0 ? `$${Math.round(value / 1000)}k` : '$0';
      },
      inRange: {
        // Clean monochromatic gradient: light grey → dark grey
        color: isDark
          ? ['#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db']  // Dark mode: dark to light grey
          : ['#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280']  // Light mode: light to dark grey
      },
      // Make the control handle more visible
      controller: {
        inRange: {
          color: isDark ? '#9ca3af' : '#4b5563'
        }
      }
    },
    series: [
      {
        name: 'Onsite Jobs',
        type: 'map',
        map: 'USA',
        roam: 'move',  // Only allow panning, not scroll zoom
        center: [-92, 38],
        scaleLimit: {
          min: 1,
          max: 5
        },
        zoom: 3.54,
        label: {
          show: false,
          emphasis: {
            show: true,
            color: '#fff'
          }
        },
        itemStyle: {
          borderColor: isDark ? '#374151' : '#d1d5db',
          borderWidth: 1,
          // Base area color for all states (very light grey)
          areaColor: isDark ? '#1f2937' : '#f9fafb',
          emphasis: {
            areaColor: isDark ? '#3b82f6' : '#60a5fa',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 20,
            borderWidth: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        emphasis: {
          label: {
            show: true
          }
        },
        data: data.data
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
        @keyframes slideInDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}} />
      <div className="relative flex gap-4" style={style}>
      {/* Map */}
      <div
        className={`${selectedState ? 'w-2/3' : 'w-full'} relative z-0`}
        style={{
          transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <ReactECharts
          option={option}
          onEvents={{ click: handleStateClick }}
          style={{ height: style?.height || '500px' }}
        />
      </div>

      {/* Side Panel */}
      <div
        className={`overflow-hidden relative z-10 ${
          isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'
        }`}
        style={{
          width: selectedState ? '33.333333%' : '0%',
          opacity: selectedState ? 1 : 0,
          borderLeftWidth: selectedState ? '1px' : '0px',
          paddingLeft: selectedState ? '1rem' : '0',
          height: style?.height || '500px',
          transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) 100ms, padding 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {selectedState && stateInfo && (
        <div className="overflow-y-auto h-full"
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
                  {selectedJob ? selectedJob.title : stateInfo.name}
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  {selectedJob ? selectedJob.company : 'State Information'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedJob(null);
                setSelectedState(null);
              }}
              className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
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

              {/* Top Employers */}
              {stateTopEmployers.length > 0 && (
                <div className="mb-4">
                  <h4 className={`text-xs font-medium mb-3 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    Top Employers
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                    {stateTopEmployers.map((employer, idx) => (
                      <div
                        key={idx}
                        className={`relative group flex-shrink-0`}
                        title={`${employer.company} (${employer.jobCount} job${employer.jobCount > 1 ? 's' : ''})`}
                      >
                        {employer.logo ? (
                          <img
                            src={employer.logo}
                            alt={employer.company}
                            className={`w-10 h-10 object-contain border-2 rounded-lg ${
                              isDark
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
                            isDark
                              ? 'border-gray-800 bg-gray-900 text-gray-400 hover:border-blue-500'
                              : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-400'
                          } transition-all cursor-pointer ${employer.logo ? 'hidden' : 'flex'}`}
                        >
                          {employer.company.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    Jobs in {stateInfo.name}
                  </h4>
                </div>

                {/* Employment Type Tabs */}
                <div className={`flex gap-1 mb-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  {[
                    { key: 'full-time', label: 'Full Time' },
                    { key: 'part-time', label: 'Part Time' },
                    { key: 'internship', label: 'Internship' }
                  ].map((tab) => {
                    const tabKey = tab.key as 'full-time' | 'part-time' | 'internship';
                    const count = stateJobs.filter((job: StateJob) =>
                      job.employmentType?.toLowerCase() === tabKey
                    ).length;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => {
                          setSelectedEmploymentType(tabKey);
                          setDisplayedJobsCount(0);
                          // Re-reveal jobs with animation
                          const filteredJobs = stateJobs.filter((job: StateJob) =>
                            job.employmentType?.toLowerCase() === tabKey
                          );
                          if (filteredJobs.length > 0) {
                            const revealJobs = async () => {
                              for (let i = 1; i <= filteredJobs.length; i++) {
                                await new Promise(resolve => setTimeout(resolve, 20));
                                setDisplayedJobsCount(i);
                              }
                            };
                            revealJobs();
                          }
                        }}
                        className={`text-[10px] px-3 py-1.5 font-medium transition-colors border-b-2 ${
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
                    job.employmentType?.toLowerCase() === selectedEmploymentType
                  );

                  return filteredJobs.length === 0 && !loadingJobs ? (
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
                        style={{
                          animation: `slideInDown 300ms cubic-bezier(0.4, 0, 0.2, 1) both`
                        }}
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

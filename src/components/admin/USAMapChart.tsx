'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import * as echarts from 'echarts';
import { stateData, getCostOfLivingLabel, stateNameToAbbr } from '@/lib/state-data';
import { extractCity } from '@/lib/location-utils';

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
      fetchStateJobs(selectedState);
    }
  }, [selectedState]);

  const fetchStateJobs = async (state: string) => {
    setLoadingJobs(true);
    try {
      const response = await fetch(`/api/admin/analytics/state-jobs?state=${state}`);
      const result = await response.json();
      setStateJobs(result.jobs || []);
    } catch (error) {
      console.error('Error fetching state jobs:', error);
      setStateJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleStateClick = (params: any) => {
    if (params.name) {
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
        if (params.value) {
          return `${params.name}: ${params.value.toLocaleString()} jobs`;
        }
        return `${params.name}: 0 jobs`;
      },
      backgroundColor: '#1f2937',
      borderColor: '#374151',
      textStyle: { color: '#e5e7eb' }
    },
    visualMap: {
      min: 0,
      max: maxValue,
      left: 'left',
      bottom: '5%',
      text: ['High', 'Low'],
      calculable: true,
      textStyle: { color: '#9ca3af' },
      inRange: {
        color: ['#1e293b', '#0ea5e9', '#0369a1', '#075985']
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
          borderColor: '#fff',
          borderWidth: 1,
          areaColor: '#e5e7eb',
          emphasis: {
            areaColor: '#0ea5e9',
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
                    <div className={`text-xs font-medium mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{selectedJob.category}</div>
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
                  className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  dangerouslySetInnerHTML={{ __html: selectedJob.description.substring(0, 800) + (selectedJob.description.length > 800 ? '...' : '') }}
                />
              </div>

              {/* Requirements */}
              {selectedJob.requirements && (
                <div>
                  <h4 className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Requirements</h4>
                  <div
                    className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    dangerouslySetInnerHTML={{ __html: selectedJob.requirements.substring(0, 600) + (selectedJob.requirements.length > 600 ? '...' : '') }}
                  />
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && (
                <div>
                  <h4 className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Benefits</h4>
                  <div
                    className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    dangerouslySetInnerHTML={{ __html: selectedJob.benefits.substring(0, 400) + (selectedJob.benefits.length > 400 ? '...' : '') }}
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
                  <div className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Population</div>
                  <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{stateInfo.population.toLocaleString()}</div>
                </div>
                <div className={`border p-3 ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`text-[10px] uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Cost of Living</div>
                  <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{getCostOfLivingLabel(stateInfo.costOfLiving)}</div>
                </div>
              </div>

              {/* Top Cities */}
              <div className="mb-4">
                <h4 className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Top Cities</h4>
                <div className="space-y-1">
                  {stateInfo.topCities.map((city, idx) => (
                    <div key={idx} className={`text-xs flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>{idx + 1}.</span>
                      <span>{city}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jobs List */}
              <div>
                <h4 className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  Jobs in {stateInfo.name} ({stateJobs.length})
                </h4>
                {loadingJobs ? (
                  <div className={`text-xs py-4 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Loading jobs...</div>
                ) : stateJobs.length === 0 ? (
                  <div className={`text-xs py-4 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>No jobs found in this state</div>
                ) : (
                  <div className="space-y-2">
                    {stateJobs.map((job) => (
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
                )}
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

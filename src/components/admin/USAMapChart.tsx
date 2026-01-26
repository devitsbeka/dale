'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import * as echarts from 'echarts';
import { stateData, getCostOfLivingLabel } from '@/lib/state-data';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface USAMapChartProps {
  data: any;
  style?: React.CSSProperties;
}

interface StateJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  category: string | null;
  experienceLevel: string | null;
  publishedAt: Date;
  source: string;
}

export default function USAMapChart({ data, style }: USAMapChartProps) {
  const [mapRegistered, setMapRegistered] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
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
      setSelectedState(params.name);
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
    <div className="flex gap-4" style={style}>
      {/* Map */}
      <div className={`${selectedState ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
        <ReactECharts
          option={option}
          onEvents={{ click: handleStateClick }}
          style={{ height: style?.height || '500px' }}
        />
      </div>

      {/* Side Panel */}
      {selectedState && stateInfo && (
        <div className="w-1/3 border-l border-gray-800 pl-4 overflow-y-auto" style={{ height: style?.height || '500px' }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-100">{stateInfo.name}</h3>
              <p className="text-xs text-gray-500">State Information</p>
            </div>
            <button
              onClick={() => setSelectedState(null)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="border border-gray-800 bg-gray-900/50 p-3">
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">Population</div>
              <div className="text-sm font-semibold text-gray-100 mt-1">{stateInfo.population.toLocaleString()}</div>
            </div>
            <div className="border border-gray-800 bg-gray-900/50 p-3">
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">Cost of Living</div>
              <div className="text-sm font-semibold text-gray-100 mt-1">{getCostOfLivingLabel(stateInfo.costOfLiving)}</div>
            </div>
          </div>

          {/* Top Cities */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-400 mb-2">Top Cities</h4>
            <div className="space-y-1">
              {stateInfo.topCities.map((city, idx) => (
                <div key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                  <span className="text-gray-600">{idx + 1}.</span>
                  <span>{city}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs List */}
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-2">
              Jobs in {stateInfo.name} ({stateJobs.length})
            </h4>
            {loadingJobs ? (
              <div className="text-xs text-gray-500 py-4">Loading jobs...</div>
            ) : stateJobs.length === 0 ? (
              <div className="text-xs text-gray-600 py-4">No jobs found in this state</div>
            ) : (
              <div className="space-y-2">
                {stateJobs.map((job) => (
                  <div key={job.id} className="border border-gray-800 bg-gray-900/30 p-2 hover:bg-gray-900/50 transition-colors">
                    <div className="text-xs font-medium text-gray-200 mb-1">{job.title}</div>
                    <div className="text-[10px] text-gray-500">{job.company}</div>
                    {(job.salaryMin || job.salaryMax) && (
                      <div className="text-[10px] text-gray-400 mt-1">
                        {job.salaryMin && job.salaryMax
                          ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
                          : job.salaryMin
                          ? `From $${job.salaryMin.toLocaleString()}`
                          : `Up to $${job.salaryMax?.toLocaleString()}`}
                      </div>
                    )}
                    {job.category && (
                      <div className="text-[10px] text-blue-400 mt-1">{job.category}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

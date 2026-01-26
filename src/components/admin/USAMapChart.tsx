'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import * as echarts from 'echarts';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface USAMapChartProps {
  data: any;
  style?: React.CSSProperties;
}

export default function USAMapChart({ data, style }: USAMapChartProps) {
  const [mapRegistered, setMapRegistered] = useState(false);

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

  return <ReactECharts option={option} style={style || { height: '600px' }} />;
}

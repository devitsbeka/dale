/**
 * World Map with Drill-Down
 * - Default: World map with all countries
 * - Click USA: Zoom to US states view
 * - Click other countries: Zoom to country with top 3 cities as dots
 * - Right panel shows relevant data
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { stateData, stateNameToAbbr } from '@/lib/state-data';

type ViewLevel = 'world' | 'us-states' | 'country-cities';

interface MapData {
  data: Array<{ name: string; value: number; jobCount?: number }>;
  totalJobs: number;
}

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  category: string | null;
}

interface WorldMapChartProps {
  data: MapData;
  style?: React.CSSProperties;
  isDark?: boolean;
}

// Capital cities mapping (includes GeoJSON variations)
const countryCapitals: Record<string, string> = {
  // Americas
  'Canada': 'Ottawa',
  'United States': 'Washington, D.C.',
  'United States of America': 'Washington, D.C.',
  'Mexico': 'Mexico City',
  'Brazil': 'Brasília',
  'Argentina': 'Buenos Aires',
  'Chile': 'Santiago',
  'Colombia': 'Bogotá',
  'Peru': 'Lima',
  'Venezuela': 'Caracas',
  'Ecuador': 'Quito',
  'Bolivia': 'La Paz',
  'Uruguay': 'Montevideo',
  'Paraguay': 'Asunción',

  // Europe
  'United Kingdom': 'London',
  'United Kingdom of Great Britain and Northern Ireland': 'London',
  'Germany': 'Berlin',
  'France': 'Paris',
  'Italy': 'Rome',
  'Spain': 'Madrid',
  'Netherlands': 'Amsterdam',
  'Sweden': 'Stockholm',
  'Norway': 'Oslo',
  'Denmark': 'Copenhagen',
  'Finland': 'Helsinki',
  'Poland': 'Warsaw',
  'Switzerland': 'Bern',
  'Austria': 'Vienna',
  'Belgium': 'Brussels',
  'Ireland': 'Dublin',
  'Portugal': 'Lisbon',
  'Greece': 'Athens',
  'Czech Republic': 'Prague',
  'Czechia': 'Prague',
  'Hungary': 'Budapest',
  'Romania': 'Bucharest',
  'Bulgaria': 'Sofia',
  'Croatia': 'Zagreb',
  'Serbia': 'Belgrade',
  'Slovakia': 'Bratislava',
  'Slovenia': 'Ljubljana',
  'Estonia': 'Tallinn',
  'Latvia': 'Riga',
  'Lithuania': 'Vilnius',
  'Iceland': 'Reykjavik',
  'Luxembourg': 'Luxembourg',

  // Asia
  'China': 'Beijing',
  'Japan': 'Tokyo',
  'South Korea': 'Seoul',
  'Korea, Republic of': 'Seoul',
  'India': 'New Delhi',
  'Singapore': 'Singapore',
  'Thailand': 'Bangkok',
  'Vietnam': 'Hanoi',
  'Viet Nam': 'Hanoi',
  'Philippines': 'Manila',
  'Indonesia': 'Jakarta',
  'Malaysia': 'Kuala Lumpur',
  'Taiwan': 'Taipei',
  'Hong Kong': 'Hong Kong',
  'Pakistan': 'Islamabad',
  'Bangladesh': 'Dhaka',
  'Sri Lanka': 'Colombo',
  'Nepal': 'Kathmandu',

  // Middle East
  'Israel': 'Jerusalem',
  'United Arab Emirates': 'Abu Dhabi',
  'Saudi Arabia': 'Riyadh',
  'Turkey': 'Ankara',
  'Iran': 'Tehran',
  'Iraq': 'Baghdad',
  'Jordan': 'Amman',
  'Lebanon': 'Beirut',
  'Kuwait': 'Kuwait City',
  'Qatar': 'Doha',
  'Bahrain': 'Manama',
  'Oman': 'Muscat',

  // Africa
  'South Africa': 'Pretoria',
  'Egypt': 'Cairo',
  'Nigeria': 'Abuja',
  'Kenya': 'Nairobi',
  'Ghana': 'Accra',
  'Ethiopia': 'Addis Ababa',
  'Tanzania': 'Dodoma',
  'Uganda': 'Kampala',
  'Morocco': 'Rabat',
  'Algeria': 'Algiers',
  'Tunisia': 'Tunis',

  // Oceania
  'Australia': 'Canberra',
  'New Zealand': 'Wellington',
};

// US state capitals mapping
const stateCapitals: Record<string, string> = {
  'AL': 'Montgomery', 'AK': 'Juneau', 'AZ': 'Phoenix', 'AR': 'Little Rock',
  'CA': 'Sacramento', 'CO': 'Denver', 'CT': 'Hartford', 'DE': 'Dover',
  'FL': 'Tallahassee', 'GA': 'Atlanta', 'HI': 'Honolulu', 'ID': 'Boise',
  'IL': 'Springfield', 'IN': 'Indianapolis', 'IA': 'Des Moines', 'KS': 'Topeka',
  'KY': 'Frankfort', 'LA': 'Baton Rouge', 'ME': 'Augusta', 'MD': 'Annapolis',
  'MA': 'Boston', 'MI': 'Lansing', 'MN': 'Saint Paul', 'MS': 'Jackson',
  'MO': 'Jefferson City', 'MT': 'Helena', 'NE': 'Lincoln', 'NV': 'Carson City',
  'NH': 'Concord', 'NJ': 'Trenton', 'NM': 'Santa Fe', 'NY': 'Albany',
  'NC': 'Raleigh', 'ND': 'Bismarck', 'OH': 'Columbus', 'OK': 'Oklahoma City',
  'OR': 'Salem', 'PA': 'Harrisburg', 'RI': 'Providence', 'SC': 'Columbia',
  'SD': 'Pierre', 'TN': 'Nashville', 'TX': 'Austin', 'UT': 'Salt Lake City',
  'VT': 'Montpelier', 'VA': 'Richmond', 'WA': 'Olympia', 'WV': 'Charleston',
  'WI': 'Madison', 'WY': 'Cheyenne', 'DC': 'Washington'
};

export default function WorldMapChart({ data, style, isDark = true }: WorldMapChartProps) {
  const [mapReady, setMapReady] = useState(false);
  const [viewLevel, setViewLevel] = useState<ViewLevel>('world');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [avgSalary, setAvgSalary] = useState<number | null>(null);
  const [capital, setCapital] = useState<string | null>(null);
  const chartRef = useRef<any>(null);

  // Load all maps on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let worldLoaded = false;
    let usLoaded = false;

    const checkReady = () => {
      if (worldLoaded && usLoaded) setMapReady(true);
    };

    // World map
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(res => res.json())
      .then(json => {
        echarts.registerMap('WORLD', json);
        worldLoaded = true;
        checkReady();
      })
      .catch(err => {
        console.error('Failed to load world map:', err);
        worldLoaded = true;
        checkReady();
      });

    // US states map
    fetch('https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json')
      .then(res => res.json())
      .then(json => {
        echarts.registerMap('USA', json);
        usLoaded = true;
        checkReady();
      })
      .catch(err => {
        console.error('Failed to load US map:', err);
        usLoaded = true;
        checkReady();
      });
  }, []);

  // Handle region clicks (world → country, state, or city)
  const handleClick = (params: any) => {
    if (!params.name || !params.event || params.event.type !== 'click') return;

    console.log('Clicked:', params.name, 'Current view:', viewLevel);

    if (viewLevel === 'world') {
      // Clicked a country on world map
      if (params.name === 'United States of America' || params.name === 'United States') {
        // Drill into US states
        setViewLevel('us-states');
        setSelectedRegion('USA');
      } else {
        // Drill into country cities
        setViewLevel('country-cities');
        setSelectedRegion(params.name);
        fetchCountryData(params.name);
      }
    } else if (viewLevel === 'us-states') {
      // Clicked a US state
      const stateAbbr = Object.entries(stateNameToAbbr).find(
        ([name]) => name === params.name
      )?.[1];
      if (stateAbbr) {
        setSelectedCity(stateAbbr);
        fetchStateJobs(stateAbbr);
      }
    } else if (viewLevel === 'country-cities') {
      // Clicked a city marker
      setSelectedCity(params.name);
      fetchCityJobs(selectedRegion!, params.name);
    }
  };

  // Fetch jobs for a US state
  const fetchStateJobs = async (state: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics/state-jobs?state=${state}`);
      const result = await response.json();
      const fetchedJobs = result.jobs || [];
      setJobs(fetchedJobs);

      // Calculate average salary
      const jobsWithSalary = fetchedJobs.filter((job: Job) => job.salaryMin && job.salaryMax);
      if (jobsWithSalary.length > 0) {
        const totalSalary = jobsWithSalary.reduce((sum: number, job: Job) => {
          const avg = ((job.salaryMin || 0) + (job.salaryMax || 0)) / 2;
          return sum + avg;
        }, 0);
        setAvgSalary(Math.round(totalSalary / jobsWithSalary.length));
      } else {
        setAvgSalary(null);
      }

      // Set state capital
      setCapital(stateCapitals[state] || null);
    } catch (error) {
      console.error('Failed to fetch state jobs:', error);
      setJobs([]);
      setAvgSalary(null);
      setCapital(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs for a country
  const fetchCountryData = async (country: string) => {
    setLoading(true);
    try {
      // Try exact match first, then try variations
      let capital = countryCapitals[country];

      // Try common variations
      if (!capital) {
        // Try without "Republic of", "Kingdom of", etc.
        const simplifiedName = country
          .replace(/^(Republic of |Kingdom of |United States of )/i, '')
          .trim();
        capital = countryCapitals[simplifiedName];
      }

      setCapital(capital || null);

      // TODO: Implement country jobs API endpoint
      // For now, set empty jobs and salary
      setJobs([]);
      setAvgSalary(null);
    } catch (error) {
      console.error('Failed to fetch country data:', error);
      setJobs([]);
      setAvgSalary(null);
      setCapital(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs for a city
  const fetchCityJobs = async (country: string, city: string) => {
    setLoading(true);
    try {
      // TODO: Implement city jobs API endpoint
      // For now, set empty jobs
      setJobs([]);
      setAvgSalary(null);
      setCapital(null); // Cities don't have capitals
    } catch (error) {
      console.error('Failed to fetch city jobs:', error);
      setJobs([]);
      setAvgSalary(null);
      setCapital(null);
    } finally {
      setLoading(false);
    }
  };

  // Go back to previous view
  const handleBack = () => {
    if (viewLevel === 'country-cities' || viewLevel === 'us-states') {
      setViewLevel('world');
      setSelectedRegion(null);
      setSelectedCity(null);
      setJobs([]);
      setAvgSalary(null);
      setCapital(null);
    }
  };

  // Prepare map configuration based on view level
  const getMapConfig = () => {
    if (viewLevel === 'world') {
      return {
        map: 'WORLD',
        center: [0, 30],
        zoom: 1.3,
        data: [] // World country data
      };
    } else if (viewLevel === 'us-states') {
      return {
        map: 'USA',
        center: [-95, 38],
        zoom: 4.2,
        data: data.data || [] // US state data
      };
    } else {
      // Country cities view - show cities as scatter points
      return {
        map: 'WORLD',
        center: getCenterForCountry(selectedRegion!),
        zoom: 4,
        data: [] // City markers
      };
    }
  };

  const getCenterForCountry = (country: string): [number, number] => {
    const centers: Record<string, [number, number]> = {
      'Canada': [-95, 60],
      'United Kingdom': [-2, 54],
      'Germany': [10, 51],
      'France': [2, 47],
      'Australia': [133, -27],
      'India': [79, 22],
      'Mexico': [-102, 24],
      'Brazil': [-52, -10],
      'Japan': [138, 38]
    };
    return centers[country] || [0, 30];
  };

  const config = getMapConfig();

  const option = {
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.componentType === 'series' && params.seriesType === 'map') {
          return `${params.name}<br/>Jobs: ${params.value || 0}`;
        }
        return params.name;
      },
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: { color: isDark ? '#e5e7eb' : '#1f2937' }
    },
    visualMap: viewLevel === 'us-states' ? {
      min: 0,
      max: Math.max(...(data.data || []).map((d: any) => d.value || 0), 1),
      orient: 'horizontal',
      left: 'center',
      bottom: '3%',
      text: ['High', 'Low'],
      calculable: true,
      itemWidth: 20,
      itemHeight: 140,
      textStyle: {
        color: isDark ? '#9ca3af' : '#6b7280'
      },
      inRange: {
        color: isDark
          ? ['#1e3a8a', '#3b82f6', '#60a5fa', '#fbbf24', '#f97316', '#ef4444']
          : ['#dbeafe', '#93c5fd', '#60a5fa', '#fde68a', '#fbbf24', '#f97316']
      }
    } : undefined,
    series: [
      {
        name: 'Jobs',
        type: 'map',
        map: config.map,
        roam: true,
        center: config.center,
        zoom: config.zoom,
        scaleLimit: { min: 1, max: 8 },
        label: { show: false },
        itemStyle: {
          areaColor: isDark ? '#1f2937' : '#f3f4f6',
          borderColor: isDark ? '#374151' : '#d1d5db',
          borderWidth: 1
        },
        emphasis: {
          label: { show: true, color: isDark ? '#fff' : '#000' },
          itemStyle: {
            areaColor: isDark ? '#3b82f6' : '#93c5fd',
            borderWidth: 2
          }
        },
        data: config.data
      }
    ]
  };

  if (!mapReady) {
    return (
      <div className="flex items-center justify-center" style={style || { height: '600px' }}>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading map...
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex" style={style}>
      {/* Map */}
      <div className="relative" style={{ width: '66.666%' }}>
        {viewLevel !== 'world' && (
          <button
            onClick={handleBack}
            className={`absolute top-4 left-4 z-10 text-xs px-3 py-1.5 border font-medium transition-colors ${
              isDark
                ? 'border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ← Back to World
          </button>
        )}
        <ReactECharts
          key={viewLevel}
          option={option}
          onEvents={{ click: handleClick }}
          onChartReady={(chart: any) => { chartRef.current = chart; }}
          style={{ height: style?.height || '600px' }}
        />
      </div>

      {/* Right Panel */}
      <div
        className={`overflow-y-auto ${
          isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'
        }`}
        style={{
          width: '33.333%',
          borderLeftWidth: '1px',
          paddingLeft: '1rem',
          height: style?.height || '600px'
        }}
      >
        <div className="py-4">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {selectedCity
              ? viewLevel === 'us-states'
                ? Object.entries(stateNameToAbbr).find(([_, abbr]) => abbr === selectedCity)?.[0] || selectedCity
                : selectedCity
              : selectedRegion || 'World'}
          </h3>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            {selectedCity ? 'Location Details' : viewLevel === 'world' ? 'Global Overview' : 'Select a location'}
          </p>

          {/* Capital and Average Salary Info */}
          {!loading && (selectedRegion || selectedCity) && (
            <div className="mt-4 space-y-2">
              {capital && (
                <div className={`flex items-center justify-between py-2 px-3 border ${
                  isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Capital
                  </span>
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {capital}
                  </span>
                </div>
              )}
              {avgSalary && (
                <div className={`flex items-center justify-between py-2 px-3 border ${
                  isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Avg Salary
                  </span>
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    ${avgSalary.toLocaleString()}
                  </span>
                </div>
              )}
              {!capital && !avgSalary && !jobs.length && viewLevel !== 'world' && (
                <div className={`py-4 px-3 text-center border ${
                  isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    No job data available for this location
                  </p>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className="mt-8 text-center">
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading jobs...
              </div>
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {jobs.length} Jobs Found
              </div>
              {jobs.slice(0, 10).map((job) => (
                <div
                  key={job.id}
                  className={`p-3 border cursor-pointer transition-colors ${
                    isDark
                      ? 'border-gray-800 hover:bg-gray-900'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {job.title}
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {job.company}
                  </div>
                  {(job.salaryMin || job.salaryMax) && (
                    <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && !selectedCity && viewLevel === 'world' && (
            <div className={`mt-8 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Click on a country to view jobs
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

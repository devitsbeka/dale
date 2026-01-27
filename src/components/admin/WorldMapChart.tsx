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

// Comprehensive country data
interface CountryData {
  capital: string;
  population: string;
  gdpRank?: number;
  gdpRankChange?: number; // Positive = improved (moved up), negative = declined (moved down)
  costOfLivingRank?: number;
  costOfLivingRankChange?: number;
  medicineRank?: number;
  medicineRankChange?: number;
  safetyRank?: number;
  safetyRankChange?: number;
  airQualityRank?: number;
  airQualityRankChange?: number;
  daleRank?: number; // 0-10 overall score
  daleRankChange?: number;
  costOfLiving?: 1 | 2 | 3 | 4 | 5; // Legacy field, kept for compatibility
  visaCategories: string[];
  relocationTip: string;
}

const countryData: Record<string, CountryData> = {
  // Americas
  'United States': {
    capital: 'Washington, D.C.',
    population: '331M',
    gdpRank: 1,
    gdpRankChange: 0,
    costOfLivingRank: 20,
    costOfLivingRankChange: 2, // Worse (higher cost)
    medicineRank: 37,
    medicineRankChange: 3, // Declined
    safetyRank: 129,
    safetyRankChange: 5, // Safety declined
    airQualityRank: 84,
    airQualityRankChange: -2, // Improved
    daleRank: 8.5,
    daleRankChange: 0.2,
    visaCategories: ['H-1B Work', 'L-1 Transfer', 'O-1 Talent', 'Green Card', 'Student F-1'],
    relocationTip: 'Tech hubs like SF, NYC, and Seattle offer the most opportunities. H-1B visa lottery typically opens in March.'
  },
  'United States of America': {
    capital: 'Washington, D.C.',
    population: '331M',
    gdpRank: 1,
    gdpRankChange: 0,
    costOfLivingRank: 20,
    costOfLivingRankChange: 2,
    medicineRank: 37,
    medicineRankChange: 3,
    safetyRank: 129,
    safetyRankChange: 5,
    airQualityRank: 84,
    airQualityRankChange: -2,
    daleRank: 8.5,
    daleRankChange: 0.2,
    visaCategories: ['H-1B Work', 'L-1 Transfer', 'O-1 Talent', 'Green Card', 'Student F-1'],
    relocationTip: 'Tech hubs like SF, NYC, and Seattle offer the most opportunities. H-1B visa lottery typically opens in March.'
  },
  'Canada': {
    capital: 'Ottawa',
    population: '38M',
    gdpRank: 9,
    gdpRankChange: 0,
    costOfLivingRank: 25,
    costOfLivingRankChange: 3, // Housing crisis
    medicineRank: 14,
    medicineRankChange: 0,
    safetyRank: 11,
    safetyRankChange: -1, // Improved
    airQualityRank: 45,
    airQualityRankChange: 3, // Wildfires impact
    daleRank: 9.2,
    daleRankChange: 0.3,
    visaCategories: ['Express Entry', 'Work Permit', 'Study Permit', 'PNP', 'Start-up Visa'],
    relocationTip: 'Express Entry is the fastest path to permanent residence. Toronto and Vancouver have thriving tech scenes.'
  },
  'Mexico': {
    capital: 'Mexico City',
    population: '128M',
    gdpRank: 15,
    gdpRankChange: -1, // Improved
    costOfLivingRank: 85,
    costOfLivingRankChange: 5, // Inflation impact
    medicineRank: 61,
    medicineRankChange: -2, // Healthcare improving
    safetyRank: 140,
    safetyRankChange: 8, // Ongoing challenges
    airQualityRank: 106,
    airQualityRankChange: 4, // Urban pollution worse
    daleRank: 7.8,
    daleRankChange: -0.4, // Declined due to safety
    visaCategories: ['Temporary Resident', 'Permanent Resident', 'Digital Nomad', 'Work Visa'],
    relocationTip: 'Mexico City and Playa del Carmen are popular for remote workers. Low cost of living with great quality of life.'
  },
  'Brazil': {
    capital: 'Brasília',
    population: '214M',
    gdpRank: 12,
    gdpRankChange: 0,
    costOfLivingRank: 92,
    costOfLivingRankChange: 7, // Economic challenges
    medicineRank: 125,
    medicineRankChange: 3, // Healthcare struggles
    safetyRank: 116,
    safetyRankChange: -4, // Crime reduced in some areas
    airQualityRank: 95,
    airQualityRankChange: 6, // Deforestation impact
    daleRank: 7.4,
    daleRankChange: -0.3, // Slight overall decline
    visaCategories: ['Work Visa', 'Investor Visa', 'Digital Nomad', 'Student Visa'],
    relocationTip: 'São Paulo is the tech capital. Portuguese language skills are highly beneficial.'
  },

  // Europe
  'United Kingdom': {
    capital: 'London',
    population: '67M',
    costOfLiving: 5,
    visaCategories: ['Skilled Worker', 'Global Talent', 'Graduate', 'Start-up', 'Innovator'],
    relocationTip: 'Post-Brexit visa rules require sponsorship. London remains a global tech hub despite high costs.'
  },
  'United Kingdom of Great Britain and Northern Ireland': {
    capital: 'London',
    population: '67M',
    costOfLiving: 5,
    visaCategories: ['Skilled Worker', 'Global Talent', 'Graduate', 'Start-up', 'Innovator'],
    relocationTip: 'Post-Brexit visa rules require sponsorship. London remains a global tech hub despite high costs.'
  },
  'Germany': {
    capital: 'Berlin',
    population: '83M',
    costOfLiving: 3,
    visaCategories: ['EU Blue Card', 'Job Seeker', 'Freelance', 'Student', 'Work Visa'],
    relocationTip: 'EU Blue Card is easiest for tech workers. Berlin and Munich have the most opportunities. German language helps but not required.'
  },
  'France': {
    capital: 'Paris',
    population: '67M',
    costOfLiving: 4,
    visaCategories: ['Talent Passport', 'Work Permit', 'Student', 'Entrepreneur', 'EU Blue Card'],
    relocationTip: 'French Tech Visa offers fast-track for startup employees. Paris is expensive, consider Lyon or Toulouse.'
  },
  'Netherlands': {
    capital: 'Amsterdam',
    population: '17M',
    costOfLiving: 4,
    visaCategories: ['Highly Skilled Migrant', 'Orientation Year', 'Self-Employed', 'Student'],
    relocationTip: 'Amsterdam and Eindhoven are tech hubs. Housing shortage is a major challenge. English widely spoken.'
  },
  'Spain': {
    capital: 'Madrid',
    population: '47M',
    costOfLiving: 3,
    visaCategories: ['Digital Nomad', 'Work Visa', 'Entrepreneur', 'Student', 'Non-lucrative'],
    relocationTip: 'New digital nomad visa launched 2023. Barcelona and Madrid have growing tech scenes. Lower costs than Northern Europe.'
  },
  'Portugal': {
    capital: 'Lisbon',
    population: '10M',
    costOfLiving: 2,
    visaCategories: ['D7 Passive Income', 'Digital Nomad', 'Golden Visa', 'Work Visa', 'Student'],
    relocationTip: 'Popular for remote workers. Lisbon and Porto have great weather and affordable living. English widely spoken.'
  },
  'Italy': {
    capital: 'Rome',
    population: '60M',
    costOfLiving: 3,
    visaCategories: ['Work Visa', 'Self-Employment', 'Student', 'Elective Residence', 'EU Blue Card'],
    relocationTip: 'Milan is the business hub. Quality of life is excellent but bureaucracy can be challenging.'
  },
  'Ireland': {
    capital: 'Dublin',
    population: '5M',
    costOfLiving: 4,
    visaCategories: ['Critical Skills', 'General Work', 'Start-up', 'Graduate', 'Student'],
    relocationTip: 'Dublin is a major tech hub with Google, Facebook, and Apple offices. English speaking is a big plus.'
  },
  'Sweden': {
    capital: 'Stockholm',
    population: '10M',
    costOfLiving: 4,
    visaCategories: ['Work Permit', 'Job Seeker', 'Self-Employment', 'Student', 'EU Blue Card'],
    relocationTip: 'Stockholm has a thriving startup scene. High taxes but excellent quality of life and work-life balance.'
  },
  'Switzerland': {
    capital: 'Bern',
    population: '9M',
    costOfLiving: 5,
    visaCategories: ['Work Permit B', 'Settlement C', 'Short-term L', 'Student'],
    relocationTip: 'Highest salaries in Europe but also highest living costs. Zurich and Geneva are financial hubs.'
  },
  'Poland': {
    capital: 'Warsaw',
    population: '38M',
    costOfLiving: 2,
    visaCategories: ['Work Permit', 'Poland Business Harbour', 'Student', 'EU Blue Card'],
    relocationTip: 'Growing tech scene in Warsaw and Krakow. Much lower costs than Western Europe.'
  },

  // Asia
  'Japan': {
    capital: 'Tokyo',
    population: '125M',
    costOfLiving: 4,
    visaCategories: ['Highly Skilled', 'Engineer/Specialist', 'Intra-company Transfer', 'Start-up', 'Student'],
    relocationTip: 'Tokyo offers great opportunities but language barrier exists. Points-based system for skilled workers.'
  },
  'China': {
    capital: 'Beijing',
    population: '1.4B',
    costOfLiving: 3,
    visaCategories: ['Z Work Visa', 'R Talent', 'Student', 'Business M'],
    relocationTip: 'Shanghai and Shenzhen are tech hubs. Language and cultural adaptation are significant challenges.'
  },
  'South Korea': {
    capital: 'Seoul',
    population: '52M',
    costOfLiving: 3,
    visaCategories: ['E-7 Work', 'D-10 Job Seeker', 'F-2 Residence', 'Student', 'Start-up'],
    relocationTip: 'Seoul has a booming tech industry. Korean language skills are highly valued but not always required.'
  },
  'Korea, Republic of': {
    capital: 'Seoul',
    population: '52M',
    costOfLiving: 3,
    visaCategories: ['E-7 Work', 'D-10 Job Seeker', 'F-2 Residence', 'Student', 'Start-up'],
    relocationTip: 'Seoul has a booming tech industry. Korean language skills are highly valued but not always required.'
  },
  'Singapore': {
    capital: 'Singapore',
    population: '6M',
    costOfLiving: 5,
    visaCategories: ['Employment Pass', 'Tech.Pass', 'EntrePass', 'Dependent Pass', 'Student'],
    relocationTip: 'Major financial and tech hub. English speaking, efficient, but very expensive. New Tech.Pass for top talent.'
  },
  'India': {
    capital: 'New Delhi',
    population: '1.4B',
    costOfLiving: 1,
    visaCategories: ['Employment Visa', 'Business Visa', 'Student Visa', 'e-Tourist'],
    relocationTip: 'Bangalore, Hyderabad, and Pune are tech hubs. Very affordable with rapidly growing opportunities.'
  },
  'Thailand': {
    capital: 'Bangkok',
    population: '70M',
    costOfLiving: 2,
    visaCategories: ['Non-B Work', 'Smart Visa', 'Student', 'Retirement', 'Digital Nomad'],
    relocationTip: 'Bangkok and Chiang Mai are popular for remote workers. Great quality of life at low cost.'
  },
  'United Arab Emirates': {
    capital: 'Abu Dhabi',
    population: '10M',
    costOfLiving: 4,
    visaCategories: ['Work Permit', 'Golden Visa', 'Freelance', 'Remote Work', 'Investor'],
    relocationTip: 'Dubai is a major business hub. No income tax, but high living costs. Golden Visa offers long-term residency.'
  },
  'Israel': {
    capital: 'Jerusalem',
    population: '9M',
    costOfLiving: 4,
    visaCategories: ['B-1 Work', 'Student', 'Start-up Visa', 'Expert'],
    relocationTip: 'Tel Aviv is known as "Silicon Wadi" - thriving startup ecosystem. High costs but great opportunities.'
  },

  // Oceania
  'Australia': {
    capital: 'Canberra',
    population: '26M',
    costOfLiving: 4,
    visaCategories: ['Skilled Independent', 'Employer Sponsored', 'Business Innovation', 'Student', 'Working Holiday'],
    relocationTip: 'Sydney and Melbourne are major cities. Points-based immigration system. High salaries and quality of life.'
  },
  'New Zealand': {
    capital: 'Wellington',
    population: '5M',
    costOfLiving: 3,
    visaCategories: ['Skilled Migrant', 'Work to Residence', 'Essential Skills', 'Student', 'Working Holiday'],
    relocationTip: 'Auckland and Wellington offer good work-life balance. Smaller market but beautiful country and friendly immigration policies.'
  },
};

// Legacy capital mapping for backwards compatibility
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
  'Cuba': 'Havana',
  'Costa Rica': 'San José',
  'Panama': 'Panama City',
  'Guatemala': 'Guatemala City',
  'Honduras': 'Tegucigalpa',
  'Nicaragua': 'Managua',
  'El Salvador': 'San Salvador',
  'Dominican Republic': 'Santo Domingo',
  'Haiti': 'Port-au-Prince',
  'Jamaica': 'Kingston',
  'Trinidad and Tobago': 'Port of Spain',
  'Belize': 'Belmopan',
  'Guyana': 'Georgetown',
  'Suriname': 'Paramaribo',

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
  'Malta': 'Valletta',
  'Cyprus': 'Nicosia',
  'Albania': 'Tirana',
  'Bosnia and Herzegovina': 'Sarajevo',
  'North Macedonia': 'Skopje',
  'Macedonia': 'Skopje',
  'Montenegro': 'Podgorica',
  'Kosovo': 'Pristina',
  'Moldova': 'Chișinău',
  'Ukraine': 'Kyiv',
  'Belarus': 'Minsk',
  'Russia': 'Moscow',
  'Russian Federation': 'Moscow',
  'Monaco': 'Monaco',
  'Andorra': 'Andorra la Vella',
  'San Marino': 'San Marino',
  'Vatican City': 'Vatican City',
  'Liechtenstein': 'Vaduz',

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
  'Myanmar': 'Naypyidaw',
  'Cambodia': 'Phnom Penh',
  'Laos': 'Vientiane',
  'Mongolia': 'Ulaanbaatar',
  'Bhutan': 'Thimphu',
  'Maldives': 'Malé',
  'Brunei': 'Bandar Seri Begawan',
  'Timor-Leste': 'Dili',
  'East Timor': 'Dili',
  'North Korea': 'Pyongyang',
  'Dem. Rep. Korea': 'Pyongyang',

  // Middle East
  'Israel': 'Jerusalem',
  'United Arab Emirates': 'Abu Dhabi',
  'Saudi Arabia': 'Riyadh',
  'Turkey': 'Ankara',
  'Türkiye': 'Ankara',
  'Iran': 'Tehran',
  'Iraq': 'Baghdad',
  'Jordan': 'Amman',
  'Lebanon': 'Beirut',
  'Kuwait': 'Kuwait City',
  'Qatar': 'Doha',
  'Bahrain': 'Manama',
  'Oman': 'Muscat',
  'Yemen': 'Sanaa',
  'Syria': 'Damascus',
  'Afghanistan': 'Kabul',
  'Armenia': 'Yerevan',
  'Azerbaijan': 'Baku',
  'Georgia': 'Tbilisi',
  'Kazakhstan': 'Nur-Sultan',
  'Kyrgyzstan': 'Bishkek',
  'Tajikistan': 'Dushanbe',
  'Turkmenistan': 'Ashgabat',
  'Uzbekistan': 'Tashkent',

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
  'Libya': 'Tripoli',
  'Sudan': 'Khartoum',
  'Senegal': 'Dakar',
  'Côte d\'Ivoire': 'Yamoussoukro',
  'Ivory Coast': 'Yamoussoukro',
  'Zimbabwe': 'Harare',
  'Angola': 'Luanda',
  'Mozambique': 'Maputo',
  'Cameroon': 'Yaoundé',
  'Rwanda': 'Kigali',
  'Zambia': 'Lusaka',
  'Mali': 'Bamako',
  'Somalia': 'Mogadishu',
  'Chad': 'N\'Djamena',
  'Niger': 'Niamey',
  'Madagascar': 'Antananarivo',
  'Mauritius': 'Port Louis',
  'Botswana': 'Gaborone',
  'Namibia': 'Windhoek',

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
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [selectedCountryData, setSelectedCountryData] = useState<CountryData | null>(null);
  const [selectedVisaCategory, setSelectedVisaCategory] = useState<string | null>(null);
  const [showVisaDetail, setShowVisaDetail] = useState(false);
  const [selectedVisaId, setSelectedVisaId] = useState<string | null>(null);
  const [hasVisaDataFromDB, setHasVisaDataFromDB] = useState(false);
  const [selectedVisaData, setSelectedVisaData] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'country' | 'visa'>('map');
  const [countryTab, setCountryTab] = useState<'overview' | 'immigration'>('overview');
  const [panelWidth, setPanelWidth] = useState(33.333); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      // Stay in world view but show country data
      setSelectedRegion(params.name);
      fetchCountryData(params.name);
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

  // Helper function to fetch visa category details
  const fetchVisaCategoryDetails = async (countryCode: string, visaName: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/visa-categories?country=${countryCode}`);
      const data = await response.json();

      // Try exact match first
      let category = data.visaCategories?.find((v: any) => v.shortName === visaName);

      // Try fuzzy match if exact fails
      if (!category) {
        category = data.visaCategories?.find((v: any) =>
          v.name.toLowerCase().includes(visaName.toLowerCase()) ||
          visaName.toLowerCase().includes(v.shortName.toLowerCase()) ||
          v.shortName.toLowerCase().includes(visaName.toLowerCase())
        );
      }

      if (category) {
        // Fetch full details
        const detailsResponse = await fetch(`/api/visa-categories/${category.id}`);
        const detailsData = await detailsResponse.json();
        setSelectedVisaData(detailsData.visaCategory);
        setViewMode('visa');
        window.history.pushState({ viewMode: 'visa', selectedRegion: countryCode }, '');
      } else {
        console.error(`No match found for: ${visaName}`);
      }
    } catch (error) {
      console.error('Error fetching visa category details:', error);
    } finally {
      setLoading(false);
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
      // Try exact match first
      let data = countryData[country];

      // Try common variations if exact match fails
      if (!data) {
        const simplifiedName = country
          .replace(/^(Republic of |Kingdom of |United States of |The )/i, '')
          .trim();
        data = countryData[simplifiedName];
      }

      // Convert country name to ISO code
      const isoCode = country === 'United States' || country === 'United States of America' ? 'USA' :
                     country === 'United Kingdom' || country === 'United Kingdom of Great Britain and Northern Ireland' ? 'GBR' :
                     country === 'Canada' ? 'CAN' :
                     country === 'Germany' ? 'DEU' :
                     country === 'France' ? 'FRA' :
                     country === 'Mexico' ? 'MEX' :
                     country === 'Brazil' ? 'BRA' :
                     country === 'Spain' ? 'ESP' :
                     country === 'Italy' ? 'ITA' :
                     country === 'Netherlands' ? 'NLD' :
                     country === 'Switzerland' ? 'CHE' :
                     country === 'Australia' ? 'AUS' :
                     country === 'Japan' ? 'JPN' :
                     country === 'Singapore' ? 'SGP' :
                     country === 'India' ? 'IND' :
                     country === 'China' ? 'CHN' :
                     country.substring(0, 3).toUpperCase();

      // Fetch real visa categories from database
      let visaCategoriesFromDB: string[] = [];
      try {
        const visaResponse = await fetch(`/api/visa-categories?country=${isoCode}`);
        if (visaResponse.ok) {
          const visaData = await visaResponse.json();
          visaCategoriesFromDB = (visaData.visaCategories || []).map((v: any) => v.shortName);
        }
      } catch (visaError) {
        console.error('Failed to fetch visa categories:', visaError);
      }

      if (data) {
        // Use real visa categories if available, otherwise fall back to hardcoded
        const visaCategories = visaCategoriesFromDB.length > 0 ? visaCategoriesFromDB : data.visaCategories;
        setSelectedCountryData({
          ...data,
          visaCategories
        });
        setCapital(data.capital);
        setSelectedVisaCategory(null); // Reset visa selection
        setViewMode('country');
        setHasVisaDataFromDB(visaCategoriesFromDB.length > 0);
        window.history.pushState({ viewMode: 'country', selectedRegion: country }, '');
      } else {
        // Fallback: Create basic CountryData from legacy capital mapping
        const capital = countryCapitals[country] || countryCapitals[
          country.replace(/^(Republic of |Kingdom of |United States of |The )/i, '').trim()
        ];

        if (capital) {
          // Use real visa categories if available
          const visaCategories = visaCategoriesFromDB.length > 0
            ? visaCategoriesFromDB
            : ['Work Visa', 'Business Visa', 'Student Visa'];

          const fallbackData: CountryData = {
            capital: capital,
            population: 'N/A',
            gdpRank: 0,
            costOfLivingRank: 0,
            medicineRank: 0,
            safetyRank: 0,
            airQualityRank: 0,
            daleRank: 0,
            visaCategories,
            relocationTip: visaCategoriesFromDB.length > 0
              ? 'Click on visa categories to view detailed information about requirements, costs, and processing times.'
              : 'Limited visa and relocation information available. Research local immigration policies for specific requirements.'
          };
          setSelectedCountryData(fallbackData);
          setCapital(capital);
          setSelectedVisaCategory(null);
          setViewMode('country');
          setHasVisaDataFromDB(visaCategoriesFromDB.length > 0);
          window.history.pushState({ viewMode: 'country', selectedRegion: country }, '');
        } else {
          setCapital(null);
          setSelectedCountryData(null);
          setHasVisaDataFromDB(false);
        }
      }

      // TODO: Implement country jobs API endpoint
      setJobs([]);
      setAvgSalary(null);
    } catch (error) {
      console.error('Failed to fetch country data:', error);
      setJobs([]);
      setAvgSalary(null);
      setCapital(null);
      setSelectedCountryData(null);
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
    if (viewMode === 'visa') {
      // Go back from visa details to country view
      setViewMode('country');
      setSelectedVisaData(null);
      setSelectedVisaId(null);
    } else if (viewLevel === 'country-cities' || viewLevel === 'us-states') {
      setViewLevel('world');
      setSelectedRegion(null);
      setSelectedCity(null);
      setJobs([]);
      setAvgSalary(null);
      setCapital(null);
      setSelectedCountryData(null);
      setSelectedVisaCategory(null);
      setViewMode('map');
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

  // Handle panel resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const mouseX = e.clientX - containerRef.current.getBoundingClientRect().left;
      const newPanelWidth = ((containerWidth - mouseX) / containerWidth) * 100;

      // Constrain between 20% and 60%
      const constrainedWidth = Math.min(Math.max(newPanelWidth, 20), 60);
      setPanelWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Handle keyboard shortcuts and browser navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // CMD+← to expand panel
      if (cmdOrCtrl && e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsPanelCollapsed(false);
      }

      // CMD+→ to collapse panel
      if (cmdOrCtrl && e.key === 'ArrowRight') {
        e.preventDefault();
        setIsPanelCollapsed(true);
      }
    };

    const handlePopState = () => {
      // Browser back button pressed
      if (viewMode === 'visa') {
        // Go back from visa to country
        setViewMode('country');
        setSelectedVisaData(null);
        setSelectedVisaId(null);
      } else if (viewMode === 'country' && selectedRegion) {
        // Go back from country to collapsed panel
        setIsPanelCollapsed(true);
        setViewMode('map');
        setSelectedCountryData(null);
        setSelectedRegion(null);
      } else if (isPanelCollapsed) {
        // Panel is collapsed, open it
        setIsPanelCollapsed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    // Push initial state
    if (!window.history.state?.initialized) {
      window.history.pushState({ initialized: true }, '');
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [viewMode, selectedRegion, isPanelCollapsed]);

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
            areaColor: '#fbbf24',
            borderWidth: 2
          }
        },
        select: {
          label: { show: true, color: isDark ? '#fff' : '#000' },
          itemStyle: {
            areaColor: '#fbbf24',
            borderColor: '#f59e0b',
            borderWidth: 2
          }
        },
        selectedMode: 'single',
        data: config.data.map((item: any) => ({
          ...item,
          selected: viewLevel === 'world' && selectedRegion &&
            (item.name === selectedRegion || item.name.includes(selectedRegion) || selectedRegion.includes(item.name))
        }))
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
    <div ref={containerRef} className="relative flex transition-all duration-300" style={style}>
      {/* Map */}
      <div className="relative transition-all duration-300 overflow-hidden" style={{ width: isPanelCollapsed ? '100%' : `${100 - panelWidth}%` }}>
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

        {/* Collapse/Expand or Back Button */}
        <button
          onClick={() => {
            if (viewMode === 'visa') {
              handleBack();
            } else {
              setIsPanelCollapsed(!isPanelCollapsed);
            }
          }}
          className={`absolute top-4 right-4 z-10 text-xs px-3 py-1.5 border font-medium transition-colors ${
            isDark
              ? 'border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title={viewMode === 'visa' ? `Back to ${selectedRegion}` : isPanelCollapsed ? 'Show panel' : 'Hide panel'}
        >
          {isPanelCollapsed ? '→' : '←'}
        </button>

        <ReactECharts
          key={viewLevel}
          option={option}
          onEvents={{ click: handleClick }}
          onChartReady={(chart: any) => { chartRef.current = chart; }}
          style={{ height: style?.height || '600px' }}
        />
      </div>

      {/* Resize Handle */}
      {!isPanelCollapsed && (
        <div
          onMouseDown={handleMouseDown}
          className={`relative w-1 cursor-col-resize group ${
            isDark ? 'hover:bg-blue-500' : 'hover:bg-blue-600'
          } ${isResizing ? (isDark ? 'bg-blue-500' : 'bg-blue-600') : ''}`}
          style={{ height: style?.height || '600px' }}
        >
          <div className={`absolute inset-y-0 -left-1 -right-1 ${isResizing ? 'bg-transparent' : ''}`} />
        </div>
      )}

      {/* Right Panel */}
      {!isPanelCollapsed && (
        <div
          className={`overflow-y-auto transition-none border-l ${
            isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-300 bg-white'
          }`}
          style={{
            width: `${panelWidth}%`,
            paddingLeft: '1rem',
            paddingRight: '1rem',
            height: style?.height || '600px'
          }}
        >
        <div className="py-4">
          <h3 className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {selectedCity
              ? viewLevel === 'us-states'
                ? Object.entries(stateNameToAbbr).find(([_, abbr]) => abbr === selectedCity)?.[0] || selectedCity
                : selectedCity
              : selectedRegion || 'World'}
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            {selectedCity ? 'Location Details' : (viewLevel === 'world' && !selectedRegion) ? 'Select a country to view details' : 'Select a location'}
          </p>

          {/* Visa Details View */}
          {!loading && viewMode === 'visa' && selectedVisaData && (
            <div className="mt-4 space-y-4">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className={`flex items-center gap-2 text-sm font-medium transition ${
                  isDark
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {selectedRegion}
              </button>

              {/* Visa Header */}
              <div className={`p-4 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  {selectedVisaData.name}
                </h3>
                <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  {selectedVisaData.countryName}
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-3 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Processing Time</div>
                  <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {selectedVisaData.processingTimeMin}-{selectedVisaData.processingTimeMax} days
                  </div>
                </div>
                <div className={`p-3 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Total Cost</div>
                  <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    ${selectedVisaData.costTotalEstimateUSD?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div className={`p-3 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Approval Rate</div>
                  <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {selectedVisaData.approvalRate}%
                  </div>
                </div>
                <div className={`p-3 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Validity</div>
                  <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {selectedVisaData.validityYears} year{selectedVisaData.validityYears !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className={`p-3 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Overview
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {selectedVisaData.description}
                </p>
              </div>

              {/* Eligibility Criteria */}
              <div className={`p-3 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Eligibility Requirements
                </div>
                <ul className="space-y-1">
                  {selectedVisaData.eligibilityCriteria?.slice(0, 5).map((criteria: string, i: number) => (
                    <li key={i} className={`text-xs flex items-start gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`text-xs font-medium mb-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                    Advantages
                  </div>
                  <ul className="space-y-1">
                    {selectedVisaData.pros?.slice(0, 3).map((pro: string, i: number) => (
                      <li key={i} className={`text-xs flex items-start gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className="text-green-500">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`p-3 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`text-xs font-medium mb-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                    Challenges
                  </div>
                  <ul className="space-y-1">
                    {selectedVisaData.cons?.slice(0, 3).map((con: string, i: number) => (
                      <li key={i} className={`text-xs flex items-start gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className="text-red-500">✗</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Official Link */}
              {selectedVisaData.officialUrl && (
                <a
                  href={selectedVisaData.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-3 border text-center text-xs font-medium transition ${
                    isDark
                      ? 'border-gray-800 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      : 'border-gray-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Visit Official Immigration Website →
                </a>
              )}
            </div>
          )}

          {/* Country/State Data */}
          {!loading && viewMode === 'country' && selectedCountryData && (
            <div className="mt-4 space-y-3">
              {/* Tabs */}
              <div className="flex gap-1 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}">
                <button
                  onClick={() => setCountryTab('overview')}
                  className={`px-3 py-2 text-xs font-medium border-b-2 transition ${
                    countryTab === 'overview'
                      ? isDark
                        ? 'border-blue-500 text-blue-400'
                        : 'border-blue-600 text-blue-700'
                      : isDark
                        ? 'border-transparent text-gray-500 hover:text-gray-300'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setCountryTab('immigration')}
                  className={`px-3 py-2 text-xs font-medium border-b-2 transition ${
                    countryTab === 'immigration'
                      ? isDark
                        ? 'border-blue-500 text-blue-400'
                        : 'border-blue-600 text-blue-700'
                      : isDark
                        ? 'border-transparent text-gray-500 hover:text-gray-300'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Immigration
                </button>
              </div>

              {/* Overview Tab Content */}
              {countryTab === 'overview' && (
                <div className="space-y-3">
                  {/* Dale Rank - Highlighted Widget */}
                  {(selectedCountryData.daleRank ?? 0) > 0 && (
                    <div className={`p-3 border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                          Dale Rank
                        </div>
                        <div className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                          {selectedCountryData.daleRank!.toFixed(1)}
                          <span className={`text-xs font-normal ml-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>/10</span>
                        </div>
                      </div>
                      <div className={`h-1 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} overflow-hidden`}>
                        <div
                          className={`h-full ${isDark ? 'bg-gray-600' : 'bg-gray-400'} transition-all`}
                          style={{ width: `${(selectedCountryData.daleRank! / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Capital</div>
                      <div className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        {selectedCountryData.capital}
                      </div>
                    </div>
                    <div className={`p-2 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Population</div>
                      <div className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        {selectedCountryData.population}
                      </div>
                    </div>
                  </div>

                  {/* Rankings Grid */}
                  {(selectedCountryData.gdpRank ?? 0) > 0 && (
                    <div className="space-y-2">
                      <div className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Global Rankings</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-2 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>GDP</div>
                          <div className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            #{selectedCountryData.gdpRank}
                          </div>
                        </div>
                        <div className={`p-2 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Cost of Living</div>
                          <div className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            #{selectedCountryData.costOfLivingRank}
                          </div>
                        </div>
                        <div className={`p-2 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Medicine</div>
                          <div className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            #{selectedCountryData.medicineRank}
                          </div>
                        </div>
                        <div className={`p-2 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Safety</div>
                          <div className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            #{selectedCountryData.safetyRank}
                          </div>
                        </div>
                        <div className={`p-2 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Air Quality</div>
                          <div className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            #{selectedCountryData.airQualityRank}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Immigration Tab Content */}
              {countryTab === 'immigration' && (
                <div className="space-y-3">
                  {/* Visa Categories or Empty State */}
              {hasVisaDataFromDB ? (
                <>
                  <div>
                    <div className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Immigration Visa Categories</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCountryData.visaCategories.map((visa) => (
                        <button
                          key={visa}
                          onClick={async () => {
                            // Fetch visa category details and show in panel
                            const countryCode = selectedRegion || '';
                            // Convert country name to ISO code
                            const isoCode = countryCode === 'United States' || countryCode === 'United States of America' ? 'USA' :
                                           countryCode === 'United Kingdom' || countryCode === 'United Kingdom of Great Britain and Northern Ireland' ? 'GBR' :
                                           countryCode === 'Canada' ? 'CAN' :
                                           countryCode === 'Germany' ? 'DEU' :
                                           countryCode === 'France' ? 'FRA' :
                                           countryCode === 'Mexico' ? 'MEX' :
                                           countryCode === 'Brazil' ? 'BRA' :
                                           countryCode === 'Spain' ? 'ESP' :
                                           countryCode === 'Italy' ? 'ITA' :
                                           countryCode === 'Netherlands' ? 'NLD' :
                                           countryCode === 'Switzerland' ? 'CHE' :
                                           countryCode === 'Australia' ? 'AUS' :
                                           countryCode === 'Japan' ? 'JPN' :
                                           countryCode === 'Singapore' ? 'SGP' :
                                           countryCode === 'India' ? 'IND' :
                                           countryCode === 'China' ? 'CHN' :
                                           countryCode.substring(0, 3).toUpperCase();

                            await fetchVisaCategoryDetails(isoCode, visa);
                          }}
                          className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                            isDark
                              ? 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:border-blue-500'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-blue-500'
                          }`}
                        >
                          {visa}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Relocation Assistant Tip */}
                  <div className={`p-3 border-l-2 ${
                    isDark ? 'border-blue-500 bg-blue-950/30' : 'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start gap-2">
                      <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className={`text-xs font-medium mb-1 ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>
                          Relocation Assistant
                        </div>
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                          {selectedCountryData.relocationTip}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className={`p-4 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'} text-center`}>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    We are still gathering information on visa categories for this country. Check back soon!
                  </div>
                </div>
              )}
                </div>
              )}
            </div>
          )}

          {/* US State Data (simplified) */}
          {!loading && viewLevel === 'us-states' && selectedCity && (
            <div className="mt-4 space-y-3">
              {capital && (
                <div className={`p-2 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Capital</div>
                  <div className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    {capital}
                  </div>
                </div>
              )}
              {avgSalary && (
                <div className={`p-2 border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Avg Salary</div>
                  <div className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    ${avgSalary.toLocaleString()}
                  </div>
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
        </div>
        </div>
      )}

    </div>
  );
}

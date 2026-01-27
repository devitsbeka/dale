/**
 * US State metadata - population, cities, cost of living
 */

export interface StateInfo {
  name: string;
  population: number;
  topCities: string[];
  costOfLiving: 1 | 2 | 3; // 1 = $, 2 = $$, 3 = $$$
  qualityOfLife: number; // 0-100 score (higher is better)
  stateTaxRate: number; // Combined state income tax rate percentage
}

export const stateData: Record<string, StateInfo> = {
  AL: { name: 'Alabama', population: 5024279, topCities: ['Birmingham', 'Montgomery', 'Mobile'], costOfLiving: 1, qualityOfLife: 62, stateTaxRate: 5.0 },
  AK: { name: 'Alaska', population: 733391, topCities: ['Anchorage', 'Fairbanks', 'Juneau'], costOfLiving: 3, qualityOfLife: 68, stateTaxRate: 0 },
  AZ: { name: 'Arizona', population: 7151502, topCities: ['Phoenix', 'Tucson', 'Mesa'], costOfLiving: 2, qualityOfLife: 71, stateTaxRate: 2.5 },
  AR: { name: 'Arkansas', population: 3011524, topCities: ['Little Rock', 'Fort Smith', 'Fayetteville'], costOfLiving: 1, qualityOfLife: 64, stateTaxRate: 4.7 },
  CA: { name: 'California', population: 39538223, topCities: ['Los Angeles', 'San Francisco', 'San Diego'], costOfLiving: 3, qualityOfLife: 78, stateTaxRate: 13.3 },
  CO: { name: 'Colorado', population: 5773714, topCities: ['Denver', 'Colorado Springs', 'Aurora'], costOfLiving: 2, qualityOfLife: 82, stateTaxRate: 4.4 },
  CT: { name: 'Connecticut', population: 3605944, topCities: ['Bridgeport', 'New Haven', 'Hartford'], costOfLiving: 3, qualityOfLife: 74, stateTaxRate: 6.99 },
  DE: { name: 'Delaware', population: 989948, topCities: ['Wilmington', 'Dover', 'Newark'], costOfLiving: 2, qualityOfLife: 70, stateTaxRate: 6.6 },
  FL: { name: 'Florida', population: 21538187, topCities: ['Miami', 'Tampa', 'Orlando'], costOfLiving: 2, qualityOfLife: 76, stateTaxRate: 0 },
  GA: { name: 'Georgia', population: 10711908, topCities: ['Atlanta', 'Augusta', 'Columbus'], costOfLiving: 2, qualityOfLife: 73, stateTaxRate: 5.75 },
  HI: { name: 'Hawaii', population: 1455271, topCities: ['Honolulu', 'Pearl City', 'Hilo'], costOfLiving: 3, qualityOfLife: 79, stateTaxRate: 11.0 },
  ID: { name: 'Idaho', population: 1839106, topCities: ['Boise', 'Meridian', 'Nampa'], costOfLiving: 1, qualityOfLife: 75, stateTaxRate: 5.8 },
  IL: { name: 'Illinois', population: 12812508, topCities: ['Chicago', 'Aurora', 'Naperville'], costOfLiving: 2, qualityOfLife: 72, stateTaxRate: 4.95 },
  IN: { name: 'Indiana', population: 6785528, topCities: ['Indianapolis', 'Fort Wayne', 'Evansville'], costOfLiving: 1, qualityOfLife: 69, stateTaxRate: 3.15 },
  IA: { name: 'Iowa', population: 3190369, topCities: ['Des Moines', 'Cedar Rapids', 'Davenport'], costOfLiving: 1, qualityOfLife: 74, stateTaxRate: 6.0 },
  KS: { name: 'Kansas', population: 2937880, topCities: ['Wichita', 'Overland Park', 'Kansas City'], costOfLiving: 1, qualityOfLife: 70, stateTaxRate: 5.7 },
  KY: { name: 'Kentucky', population: 4505836, topCities: ['Louisville', 'Lexington', 'Bowling Green'], costOfLiving: 1, qualityOfLife: 66, stateTaxRate: 4.5 },
  LA: { name: 'Louisiana', population: 4657757, topCities: ['New Orleans', 'Baton Rouge', 'Shreveport'], costOfLiving: 1, qualityOfLife: 65, stateTaxRate: 4.25 },
  ME: { name: 'Maine', population: 1362359, topCities: ['Portland', 'Lewiston', 'Bangor'], costOfLiving: 2, qualityOfLife: 76, stateTaxRate: 7.15 },
  MD: { name: 'Maryland', population: 6177224, topCities: ['Baltimore', 'Columbia', 'Germantown'], costOfLiving: 3, qualityOfLife: 77, stateTaxRate: 5.75 },
  MA: { name: 'Massachusetts', population: 7029917, topCities: ['Boston', 'Worcester', 'Springfield'], costOfLiving: 3, qualityOfLife: 80, stateTaxRate: 9.0 },
  MI: { name: 'Michigan', population: 10077331, topCities: ['Detroit', 'Grand Rapids', 'Warren'], costOfLiving: 1, qualityOfLife: 68, stateTaxRate: 4.25 },
  MN: { name: 'Minnesota', population: 5706494, topCities: ['Minneapolis', 'St. Paul', 'Rochester'], costOfLiving: 2, qualityOfLife: 81, stateTaxRate: 9.85 },
  MS: { name: 'Mississippi', population: 2961279, topCities: ['Jackson', 'Gulfport', 'Southaven'], costOfLiving: 1, qualityOfLife: 61, stateTaxRate: 5.0 },
  MO: { name: 'Missouri', population: 6154913, topCities: ['Kansas City', 'St. Louis', 'Springfield'], costOfLiving: 1, qualityOfLife: 69, stateTaxRate: 4.95 },
  MT: { name: 'Montana', population: 1084225, topCities: ['Billings', 'Missoula', 'Great Falls'], costOfLiving: 1, qualityOfLife: 73, stateTaxRate: 6.75 },
  NE: { name: 'Nebraska', population: 1961504, topCities: ['Omaha', 'Lincoln', 'Bellevue'], costOfLiving: 1, qualityOfLife: 72, stateTaxRate: 6.64 },
  NV: { name: 'Nevada', population: 3104614, topCities: ['Las Vegas', 'Henderson', 'Reno'], costOfLiving: 2, qualityOfLife: 70, stateTaxRate: 0 },
  NH: { name: 'New Hampshire', population: 1377529, topCities: ['Manchester', 'Nashua', 'Concord'], costOfLiving: 2, qualityOfLife: 78, stateTaxRate: 0 },
  NJ: { name: 'New Jersey', population: 9288994, topCities: ['Newark', 'Jersey City', 'Paterson'], costOfLiving: 3, qualityOfLife: 75, stateTaxRate: 10.75 },
  NM: { name: 'New Mexico', population: 2117522, topCities: ['Albuquerque', 'Las Cruces', 'Rio Rancho'], costOfLiving: 1, qualityOfLife: 67, stateTaxRate: 5.9 },
  NY: { name: 'New York', population: 20201249, topCities: ['New York City', 'Buffalo', 'Rochester'], costOfLiving: 3, qualityOfLife: 77, stateTaxRate: 10.9 },
  NC: { name: 'North Carolina', population: 10439388, topCities: ['Charlotte', 'Raleigh', 'Greensboro'], costOfLiving: 2, qualityOfLife: 75, stateTaxRate: 4.75 },
  ND: { name: 'North Dakota', population: 779094, topCities: ['Fargo', 'Bismarck', 'Grand Forks'], costOfLiving: 1, qualityOfLife: 71, stateTaxRate: 2.9 },
  OH: { name: 'Ohio', population: 11799448, topCities: ['Columbus', 'Cleveland', 'Cincinnati'], costOfLiving: 1, qualityOfLife: 70, stateTaxRate: 3.75 },
  OK: { name: 'Oklahoma', population: 3959353, topCities: ['Oklahoma City', 'Tulsa', 'Norman'], costOfLiving: 1, qualityOfLife: 67, stateTaxRate: 4.75 },
  OR: { name: 'Oregon', population: 4237256, topCities: ['Portland', 'Eugene', 'Salem'], costOfLiving: 2, qualityOfLife: 77, stateTaxRate: 9.9 },
  PA: { name: 'Pennsylvania', population: 13002700, topCities: ['Philadelphia', 'Pittsburgh', 'Allentown'], costOfLiving: 2, qualityOfLife: 71, stateTaxRate: 3.07 },
  RI: { name: 'Rhode Island', population: 1097379, topCities: ['Providence', 'Warwick', 'Cranston'], costOfLiving: 2, qualityOfLife: 73, stateTaxRate: 5.99 },
  SC: { name: 'South Carolina', population: 5118425, topCities: ['Charleston', 'Columbia', 'North Charleston'], costOfLiving: 1, qualityOfLife: 72, stateTaxRate: 6.4 },
  SD: { name: 'South Dakota', population: 886667, topCities: ['Sioux Falls', 'Rapid City', 'Aberdeen'], costOfLiving: 1, qualityOfLife: 74, stateTaxRate: 0 },
  TN: { name: 'Tennessee', population: 6910840, topCities: ['Nashville', 'Memphis', 'Knoxville'], costOfLiving: 1, qualityOfLife: 71, stateTaxRate: 0 },
  TX: { name: 'Texas', population: 29145505, topCities: ['Houston', 'San Antonio', 'Dallas'], costOfLiving: 2, qualityOfLife: 72, stateTaxRate: 0 },
  UT: { name: 'Utah', population: 3271616, topCities: ['Salt Lake City', 'West Valley City', 'Provo'], costOfLiving: 2, qualityOfLife: 79, stateTaxRate: 4.85 },
  VT: { name: 'Vermont', population: 643077, topCities: ['Burlington', 'Essex', 'South Burlington'], costOfLiving: 2, qualityOfLife: 77, stateTaxRate: 8.75 },
  VA: { name: 'Virginia', population: 8631393, topCities: ['Virginia Beach', 'Norfolk', 'Chesapeake'], costOfLiving: 2, qualityOfLife: 78, stateTaxRate: 5.75 },
  WA: { name: 'Washington', population: 7705281, topCities: ['Seattle', 'Spokane', 'Tacoma'], costOfLiving: 2, qualityOfLife: 79, stateTaxRate: 0 },
  WV: { name: 'West Virginia', population: 1793716, topCities: ['Charleston', 'Huntington', 'Morgantown'], costOfLiving: 1, qualityOfLife: 63, stateTaxRate: 5.12 },
  WI: { name: 'Wisconsin', population: 5893718, topCities: ['Milwaukee', 'Madison', 'Green Bay'], costOfLiving: 1, qualityOfLife: 73, stateTaxRate: 7.65 },
  WY: { name: 'Wyoming', population: 576851, topCities: ['Cheyenne', 'Casper', 'Laramie'], costOfLiving: 1, qualityOfLife: 72, stateTaxRate: 0 },
  DC: { name: 'District of Columbia', population: 689545, topCities: ['Washington'], costOfLiving: 3, qualityOfLife: 74, stateTaxRate: 10.75 },
};

export function getCostOfLivingLabel(level: 1 | 2 | 3): string {
  return level === 1 ? '$' : level === 2 ? '$$' : '$$$';
}

// Map full state names to abbreviations
export const stateNameToAbbr: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'District of Columbia': 'DC'
};

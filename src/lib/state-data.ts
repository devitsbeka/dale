/**
 * US State metadata - population, cities, cost of living
 */

export interface StateInfo {
  name: string;
  population: number;
  topCities: string[];
  costOfLiving: 1 | 2 | 3; // 1 = $, 2 = $$, 3 = $$$
}

export const stateData: Record<string, StateInfo> = {
  AL: { name: 'Alabama', population: 5024279, topCities: ['Birmingham', 'Montgomery', 'Mobile'], costOfLiving: 1 },
  AK: { name: 'Alaska', population: 733391, topCities: ['Anchorage', 'Fairbanks', 'Juneau'], costOfLiving: 3 },
  AZ: { name: 'Arizona', population: 7151502, topCities: ['Phoenix', 'Tucson', 'Mesa'], costOfLiving: 2 },
  AR: { name: 'Arkansas', population: 3011524, topCities: ['Little Rock', 'Fort Smith', 'Fayetteville'], costOfLiving: 1 },
  CA: { name: 'California', population: 39538223, topCities: ['Los Angeles', 'San Francisco', 'San Diego'], costOfLiving: 3 },
  CO: { name: 'Colorado', population: 5773714, topCities: ['Denver', 'Colorado Springs', 'Aurora'], costOfLiving: 2 },
  CT: { name: 'Connecticut', population: 3605944, topCities: ['Bridgeport', 'New Haven', 'Hartford'], costOfLiving: 3 },
  DE: { name: 'Delaware', population: 989948, topCities: ['Wilmington', 'Dover', 'Newark'], costOfLiving: 2 },
  FL: { name: 'Florida', population: 21538187, topCities: ['Miami', 'Tampa', 'Orlando'], costOfLiving: 2 },
  GA: { name: 'Georgia', population: 10711908, topCities: ['Atlanta', 'Augusta', 'Columbus'], costOfLiving: 2 },
  HI: { name: 'Hawaii', population: 1455271, topCities: ['Honolulu', 'Pearl City', 'Hilo'], costOfLiving: 3 },
  ID: { name: 'Idaho', population: 1839106, topCities: ['Boise', 'Meridian', 'Nampa'], costOfLiving: 1 },
  IL: { name: 'Illinois', population: 12812508, topCities: ['Chicago', 'Aurora', 'Naperville'], costOfLiving: 2 },
  IN: { name: 'Indiana', population: 6785528, topCities: ['Indianapolis', 'Fort Wayne', 'Evansville'], costOfLiving: 1 },
  IA: { name: 'Iowa', population: 3190369, topCities: ['Des Moines', 'Cedar Rapids', 'Davenport'], costOfLiving: 1 },
  KS: { name: 'Kansas', population: 2937880, topCities: ['Wichita', 'Overland Park', 'Kansas City'], costOfLiving: 1 },
  KY: { name: 'Kentucky', population: 4505836, topCities: ['Louisville', 'Lexington', 'Bowling Green'], costOfLiving: 1 },
  LA: { name: 'Louisiana', population: 4657757, topCities: ['New Orleans', 'Baton Rouge', 'Shreveport'], costOfLiving: 1 },
  ME: { name: 'Maine', population: 1362359, topCities: ['Portland', 'Lewiston', 'Bangor'], costOfLiving: 2 },
  MD: { name: 'Maryland', population: 6177224, topCities: ['Baltimore', 'Columbia', 'Germantown'], costOfLiving: 3 },
  MA: { name: 'Massachusetts', population: 7029917, topCities: ['Boston', 'Worcester', 'Springfield'], costOfLiving: 3 },
  MI: { name: 'Michigan', population: 10077331, topCities: ['Detroit', 'Grand Rapids', 'Warren'], costOfLiving: 1 },
  MN: { name: 'Minnesota', population: 5706494, topCities: ['Minneapolis', 'St. Paul', 'Rochester'], costOfLiving: 2 },
  MS: { name: 'Mississippi', population: 2961279, topCities: ['Jackson', 'Gulfport', 'Southaven'], costOfLiving: 1 },
  MO: { name: 'Missouri', population: 6154913, topCities: ['Kansas City', 'St. Louis', 'Springfield'], costOfLiving: 1 },
  MT: { name: 'Montana', population: 1084225, topCities: ['Billings', 'Missoula', 'Great Falls'], costOfLiving: 1 },
  NE: { name: 'Nebraska', population: 1961504, topCities: ['Omaha', 'Lincoln', 'Bellevue'], costOfLiving: 1 },
  NV: { name: 'Nevada', population: 3104614, topCities: ['Las Vegas', 'Henderson', 'Reno'], costOfLiving: 2 },
  NH: { name: 'New Hampshire', population: 1377529, topCities: ['Manchester', 'Nashua', 'Concord'], costOfLiving: 2 },
  NJ: { name: 'New Jersey', population: 9288994, topCities: ['Newark', 'Jersey City', 'Paterson'], costOfLiving: 3 },
  NM: { name: 'New Mexico', population: 2117522, topCities: ['Albuquerque', 'Las Cruces', 'Rio Rancho'], costOfLiving: 1 },
  NY: { name: 'New York', population: 20201249, topCities: ['New York City', 'Buffalo', 'Rochester'], costOfLiving: 3 },
  NC: { name: 'North Carolina', population: 10439388, topCities: ['Charlotte', 'Raleigh', 'Greensboro'], costOfLiving: 2 },
  ND: { name: 'North Dakota', population: 779094, topCities: ['Fargo', 'Bismarck', 'Grand Forks'], costOfLiving: 1 },
  OH: { name: 'Ohio', population: 11799448, topCities: ['Columbus', 'Cleveland', 'Cincinnati'], costOfLiving: 1 },
  OK: { name: 'Oklahoma', population: 3959353, topCities: ['Oklahoma City', 'Tulsa', 'Norman'], costOfLiving: 1 },
  OR: { name: 'Oregon', population: 4237256, topCities: ['Portland', 'Eugene', 'Salem'], costOfLiving: 2 },
  PA: { name: 'Pennsylvania', population: 13002700, topCities: ['Philadelphia', 'Pittsburgh', 'Allentown'], costOfLiving: 2 },
  RI: { name: 'Rhode Island', population: 1097379, topCities: ['Providence', 'Warwick', 'Cranston'], costOfLiving: 2 },
  SC: { name: 'South Carolina', population: 5118425, topCities: ['Charleston', 'Columbia', 'North Charleston'], costOfLiving: 1 },
  SD: { name: 'South Dakota', population: 886667, topCities: ['Sioux Falls', 'Rapid City', 'Aberdeen'], costOfLiving: 1 },
  TN: { name: 'Tennessee', population: 6910840, topCities: ['Nashville', 'Memphis', 'Knoxville'], costOfLiving: 1 },
  TX: { name: 'Texas', population: 29145505, topCities: ['Houston', 'San Antonio', 'Dallas'], costOfLiving: 2 },
  UT: { name: 'Utah', population: 3271616, topCities: ['Salt Lake City', 'West Valley City', 'Provo'], costOfLiving: 2 },
  VT: { name: 'Vermont', population: 643077, topCities: ['Burlington', 'Essex', 'South Burlington'], costOfLiving: 2 },
  VA: { name: 'Virginia', population: 8631393, topCities: ['Virginia Beach', 'Norfolk', 'Chesapeake'], costOfLiving: 2 },
  WA: { name: 'Washington', population: 7705281, topCities: ['Seattle', 'Spokane', 'Tacoma'], costOfLiving: 2 },
  WV: { name: 'West Virginia', population: 1793716, topCities: ['Charleston', 'Huntington', 'Morgantown'], costOfLiving: 1 },
  WI: { name: 'Wisconsin', population: 5893718, topCities: ['Milwaukee', 'Madison', 'Green Bay'], costOfLiving: 1 },
  WY: { name: 'Wyoming', population: 576851, topCities: ['Cheyenne', 'Casper', 'Laramie'], costOfLiving: 1 },
  DC: { name: 'District of Columbia', population: 689545, topCities: ['Washington'], costOfLiving: 3 },
};

export function getCostOfLivingLabel(level: 1 | 2 | 3): string {
  return level === 1 ? '$' : level === 2 ? '$$' : '$$$';
}

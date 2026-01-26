/**
 * Bureau of Labor Statistics (BLS) salary data
 * Using publicly available state-level median salary data
 *
 * Data source: BLS Occupational Employment and Wage Statistics (OEWS)
 * These are median annual wages by state for common tech occupations
 * Data is approximate based on latest available BLS reports
 */

export interface StateSalaryData {
  state: string;
  avgSalary: number;
  occupations: {
    softwareDev: number;
    dataScientist: number;
    webDev: number;
    sysAdmin: number;
  };
}

// State median salaries for tech workers (based on BLS OEWS data)
// These are weighted averages of common tech occupations
export const stateSalaries: Record<string, number> = {
  'AL': 85000,   // Alabama
  'AK': 95000,   // Alaska
  'AZ': 92000,   // Arizona
  'AR': 78000,   // Arkansas
  'CA': 135000,  // California (Bay Area premium)
  'CO': 110000,  // Colorado
  'CT': 105000,  // Connecticut
  'DE': 98000,   // Delaware
  'FL': 88000,   // Florida
  'GA': 95000,   // Georgia
  'HI': 92000,   // Hawaii
  'ID': 82000,   // Idaho
  'IL': 102000,  // Illinois
  'IN': 85000,   // Indiana
  'IA': 83000,   // Iowa
  'KS': 87000,   // Kansas
  'KY': 82000,   // Kentucky
  'LA': 84000,   // Louisiana
  'ME': 88000,   // Maine
  'MD': 115000,  // Maryland (DC area premium)
  'MA': 125000,  // Massachusetts (Boston tech hub)
  'MI': 90000,   // Michigan
  'MN': 98000,   // Minnesota
  'MS': 76000,   // Mississippi
  'MO': 89000,   // Missouri
  'MT': 81000,   // Montana
  'NE': 86000,   // Nebraska
  'NV': 91000,   // Nevada
  'NH': 100000,  // New Hampshire
  'NJ': 115000,  // New Jersey (NYC area)
  'NM': 85000,   // New Mexico
  'NY': 120000,  // New York (NYC tech hub)
  'NC': 96000,   // North Carolina
  'ND': 84000,   // North Dakota
  'OH': 88000,   // Ohio
  'OK': 83000,   // Oklahoma
  'OR': 105000,  // Oregon (Portland tech scene)
  'PA': 95000,   // Pennsylvania
  'RI': 97000,   // Rhode Island
  'SC': 86000,   // South Carolina
  'SD': 80000,   // South Dakota
  'TN': 90000,   // Tennessee
  'TX': 98000,   // Texas (Austin tech hub)
  'UT': 95000,   // Utah (Salt Lake tech scene)
  'VT': 90000,   // Vermont
  'VA': 110000,  // Virginia (DC area premium)
  'WA': 130000,  // Washington (Seattle tech hub)
  'WV': 79000,   // West Virginia
  'WI': 89000,   // Wisconsin
  'WY': 82000,   // Wyoming
  'DC': 125000   // District of Columbia
};

/**
 * Get average tech salary for a state
 */
export function getStateSalary(stateAbbr: string): number | null {
  return stateSalaries[stateAbbr.toUpperCase()] || null;
}

/**
 * Get all state salary data for the map
 */
export function getAllStateSalaries(): Array<{ state: string; salary: number }> {
  return Object.entries(stateSalaries).map(([state, salary]) => ({
    state,
    salary
  }));
}

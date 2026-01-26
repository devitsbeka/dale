/**
 * Shared utilities for location parsing and state extraction
 */

// US State mappings
const stateAbbreviations: Record<string, string> = {
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
  'District of Columbia': 'DC', 'Washington DC': 'DC', 'Washington D.C.': 'DC'
};

const validStates = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]);

/**
 * Extract state abbreviation from location string
 * @param location - Location string (e.g., "San Francisco, CA" or "Austin, Texas")
 * @returns State abbreviation (e.g., "CA", "TX") or null if not found
 */
export function extractState(location: string | null): string | null {
  if (!location) return null;

  const normalized = location.trim();

  // Priority 1: Match state abbreviation after comma (most common format: "City, ST")
  const commaMatch = normalized.match(/,\s*([A-Z]{2})(?:\s|$|,)/i);
  if (commaMatch) {
    const abbr = commaMatch[1].toUpperCase();
    if (validStates.has(abbr)) {
      return abbr;
    }
  }

  // Priority 2: Match full state name with WORD BOUNDARIES (not substring)
  for (const [fullName, abbr] of Object.entries(stateAbbreviations)) {
    // Use word boundary regex to avoid partial matches
    const stateRegex = new RegExp(`\\b${fullName}\\b`, 'i');
    if (stateRegex.test(normalized)) {
      return abbr;
    }
  }

  // Priority 3: Standalone state abbreviation
  const tokens = normalized.split(/[\s,]+/);
  for (const token of tokens) {
    const upper = token.toUpperCase();
    if (validStates.has(upper) && upper.length === 2) {
      return upper;
    }
  }

  return null;
}

/**
 * Check if location matches a specific state
 * @param location - Location string
 * @param targetState - State abbreviation to match (e.g., "CA", "TX")
 * @returns true if location is in the target state
 */
export function matchesState(location: string | null, targetState: string): boolean {
  const extractedState = extractState(location);
  return extractedState !== null && extractedState.toUpperCase() === targetState.toUpperCase();
}

/**
 * Extract city name from location string
 * @param location - Location string (e.g., "San Francisco, CA" or "Austin, Texas, USA")
 * @returns City name or null if not parseable
 */
export function extractCity(location: string | null): string | null {
  if (!location) return null;

  const normalized = location.trim();

  // Handle "City, ST" or "City, State" format
  const parts = normalized.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    // First part is city, unless it's a country
    const city = parts[0];

    // Exclude invalid city names
    if (city.length < 2 || city.toLowerCase() === 'remote' || city.toLowerCase() === 'worldwide') {
      return null;
    }

    return city;
  }

  // Single token - could be city or state, return null to be safe
  return null;
}

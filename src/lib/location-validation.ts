/**
 * Location validation utilities
 */

import { extractState } from './location-utils';

// Map of category slugs to friendly display names
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

/**
 * Validate that a location string is likely a valid US location
 */
export function isValidUSLocation(location: string | null): boolean {
  if (!location) return false;

  const normalized = location.toLowerCase();

  // Exclude international locations
  const invalidKeywords = ['worldwide', 'remote', 'global', 'international',
                          'europe', 'asia', 'uk', 'canada', 'australia'];
  if (invalidKeywords.some(kw => normalized.includes(kw))) {
    return false;
  }

  // Must have either state abbreviation or state name
  const state = extractState(location);
  return state !== null;
}

/**
 * Get confidence score for location extraction (0-100)
 */
export function getLocationConfidence(location: string | null): number {
  if (!location) return 0;

  const state = extractState(location);
  if (!state) return 0;

  const normalized = location.trim();

  // High confidence: Has comma and state abbreviation
  if (/,\s*[A-Z]{2}(?:\s|$|,)/i.test(normalized)) {
    return 95;
  }

  // Medium confidence: Has full state name
  for (const fullName of Object.keys(stateAbbreviations)) {
    if (new RegExp(`\\b${fullName}\\b`, 'i').test(normalized)) {
      return 75;
    }
  }

  // Low confidence: Only standalone abbreviation
  return 50;
}

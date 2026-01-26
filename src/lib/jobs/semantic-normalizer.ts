/**
 * Semantic Content Normalizer
 * Standardizes job data from various sources into consistent, clean format
 */

/**
 * Normalize job title to consistent format
 * - Standardizes abbreviations (Sr. → Senior)
 * - Fixes capitalization (Title Case)
 * - Removes special characters
 * - Standardizes common variations
 */
export function normalizeJobTitle(title: string | undefined | null): string {
  if (!title) return 'Untitled Position';

  let normalized = title.trim();

  // Standardize common abbreviations
  const abbreviations: Record<string, string> = {
    'Sr\\.?': 'Senior',
    'Jr\\.?': 'Junior',
    'Mgr\\.?': 'Manager',
    'Dev\\.?': 'Developer',
    'Eng\\.?': 'Engineer',
    'Devops': 'DevOps',
    'Fullstack': 'Full Stack',
    'Full-stack': 'Full Stack',
    'Front-end': 'Frontend',
    'Back-end': 'Backend',
    'Architect\\.?': 'Architect',
    'Admin\\.?': 'Administrator',
    'Sys\\.?': 'System',
    'DB\\.?': 'Database',
    'QA': 'Quality Assurance',
    'UI/UX': 'UI/UX',
    'ML': 'Machine Learning',
    'AI': 'Artificial Intelligence',
  };

  for (const [abbr, full] of Object.entries(abbreviations)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    normalized = normalized.replace(regex, full);
  }

  // Remove special characters but keep meaningful ones
  normalized = normalized
    .replace(/[\/\|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Standardize level prefixes to end
  normalized = normalized
    .replace(/^(Senior|Junior|Lead|Principal|Staff)\s+(.+)/, '$2 ($1)')
    .replace(/\s+\(([^)]+)\)$/, ' ($1)'); // Ensure only one level designation

  // Convert to Title Case
  normalized = toTitleCase(normalized);

  return normalized;
}

/**
 * Normalize company name to consistent format
 * - Removes legal suffixes (stores separately)
 * - Standardizes capitalization
 * - Removes extra whitespace
 */
export function normalizeCompanyName(
  company: string | undefined | null
): { name: string; legalSuffix: string | null; displayName: string } {
  if (!company) {
    return {
      name: 'Unknown Company',
      legalSuffix: null,
      displayName: 'Unknown Company',
    };
  }

  let normalized = company.trim();

  // Extract legal suffix
  const legalSuffixes = [
    'Inc\\.?',
    'LLC',
    'Ltd\\.?',
    'Limited',
    'Corporation',
    'Corp\\.?',
    'Company',
    'Co\\.?',
    'LLP',
    'LP',
    'PLC',
    'GmbH',
    'AG',
    'S\\.A\\.?',
    'N\\.V\\.?',
  ];

  const suffixRegex = new RegExp(
    `,?\\s*(${legalSuffixes.join('|')})\\s*$`,
    'i'
  );
  const match = normalized.match(suffixRegex);

  let legalSuffix: string | null = null;
  if (match) {
    legalSuffix = match[1];
    normalized = normalized.replace(suffixRegex, '').trim();
  }

  // Remove "The" prefix
  normalized = normalized.replace(/^The\s+/i, '');

  // Clean up whitespace and special characters
  normalized = normalized
    .replace(/\s+/g, ' ')
    .replace(/[™®©]/g, '')
    .trim();

  // Standardize capitalization (preserve acronyms)
  normalized = normalizeCapitalization(normalized);

  const displayName = legalSuffix
    ? `${normalized} ${legalSuffix}`
    : normalized;

  return {
    name: normalized,
    legalSuffix,
    displayName,
  };
}

/**
 * Normalize job description
 * - Strips HTML but preserves structure
 * - Removes excessive whitespace
 * - Standardizes line breaks
 * - Removes boilerplate text
 */
export function normalizeDescription(
  description: string | undefined | null,
  descriptionHtml?: string | null
): string {
  if (!description && !descriptionHtml) return '';

  let text = description || '';

  // If we have HTML, parse it better
  if (descriptionHtml) {
    text = stripHtmlPreservingStructure(descriptionHtml);
  } else {
    // Clean up existing text
    text = stripHtmlPreservingStructure(text);
  }

  // Remove common boilerplate patterns
  const boilerplatePatterns = [
    /Equal\s+Opportunity\s+Employer[\s\S]*?discrimination/gi,
    /We\s+are\s+an\s+equal\s+opportunity[\s\S]*?$/gi,
    /This\s+job\s+description\s+is\s+not[\s\S]*?$/gi,
  ];

  for (const pattern of boilerplatePatterns) {
    text = text.replace(pattern, '');
  }

  // Standardize whitespace
  text = text
    .replace(/\n{3,}/g, '\n\n') // Max 2 newlines
    .replace(/[ \t]+/g, ' ') // Normalize spaces
    .replace(/^\s+|\s+$/g, '') // Trim
    .trim();

  return text;
}

/**
 * Strip HTML while preserving structure with newlines
 */
function stripHtmlPreservingStructure(html: string): string {
  return (
    html
      // Convert block elements to newlines
      .replace(/<\/?(div|p|br|h[1-6]|li|tr)[^>]*>/gi, '\n')
      .replace(/<\/?(ul|ol|table)[^>]*>/gi, '\n\n')
      // Remove all other tags
      .replace(/<[^>]*>/g, '')
      // Decode HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&hellip;/g, '...')
      // Clean up whitespace
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/[ \t]+/g, ' ')
      .trim()
  );
}

/**
 * Normalize location to consistent format
 * - Standardizes "Remote" variations
 * - Parses city, state, country
 * - Returns consistent format
 */
export function normalizeLocation(
  location: string | undefined | null
): {
  raw: string;
  city: string | null;
  state: string | null;
  country: string | null;
  isRemote: boolean;
  display: string;
} {
  if (!location) {
    return {
      raw: '',
      city: null,
      state: null,
      country: null,
      isRemote: false,
      display: 'Location Not Specified',
    };
  }

  const normalized = location.trim();

  // Check if remote
  const remotePatterns = [
    /\b(remote|work from home|wfh|anywhere)\b/i,
    /^remote$/i,
  ];
  const isRemote = remotePatterns.some((pattern) => pattern.test(normalized));

  if (isRemote) {
    return {
      raw: normalized,
      city: null,
      state: null,
      country: null,
      isRemote: true,
      display: 'Remote',
    };
  }

  // Parse location components
  // Format: "City, State" or "City, State, Country" or "City, Country"
  const parts = normalized.split(',').map((p) => p.trim());

  let city: string | null = null;
  let state: string | null = null;
  let country: string | null = null;

  if (parts.length === 1) {
    city = parts[0];
  } else if (parts.length === 2) {
    city = parts[0];
    // Could be state or country
    const secondPart = parts[1];
    if (secondPart.length === 2) {
      state = secondPart.toUpperCase(); // US state abbreviation
    } else {
      country = secondPart;
    }
  } else if (parts.length >= 3) {
    city = parts[0];
    state = parts[1];
    country = parts[2];
  }

  // Build display string
  let display = '';
  if (city) display += city;
  if (state) display += display ? `, ${state}` : state;
  if (country && country.toLowerCase() !== 'usa' && country.toLowerCase() !== 'united states') {
    display += display ? `, ${country}` : country;
  }

  return {
    raw: normalized,
    city,
    state,
    country,
    isRemote,
    display: display || normalized,
  };
}

/**
 * Get company logo URL
 * Uses Clearbit Logo API (free, no auth required)
 */
export function getCompanyLogoUrl(
  companyName: string,
  companyUrl?: string | null
): string | null {
  if (!companyName) return null;

  // If we have a company URL, extract domain
  if (companyUrl) {
    try {
      const url = new URL(companyUrl);
      const domain = url.hostname.replace(/^www\./, '');
      return `https://logo.clearbit.com/${domain}`;
    } catch (error) {
      // Invalid URL, continue with company name
    }
  }

  // Attempt to construct domain from company name
  const { name } = normalizeCompanyName(companyName);
  const domain = name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

  return `https://logo.clearbit.com/${domain}.com`;
}

/**
 * Normalize URL
 * - Ensures https://
 * - Removes tracking parameters
 * - Validates format
 */
export function normalizeUrl(url: string | undefined | null): string | null {
  if (!url) return null;

  try {
    // Ensure protocol
    let normalized = url.trim();
    if (!normalized.match(/^https?:\/\//i)) {
      normalized = `https://${normalized}`;
    }

    const urlObj = new URL(normalized);

    // Remove common tracking parameters
    const trackingParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'ref',
      'referrer',
      'fbclid',
      'gclid',
      'msclkid',
    ];

    for (const param of trackingParams) {
      urlObj.searchParams.delete(param);
    }

    return urlObj.toString();
  } catch (error) {
    console.error('Invalid URL:', url);
    return null;
  }
}

/**
 * Normalize salary range
 * - Standardizes format
 * - Converts to annual if needed
 * - Validates ranges
 */
export function normalizeSalary(
  min: number | null | undefined,
  max: number | null | undefined,
  period?: string | null
): {
  min: number | null;
  max: number | null;
  period: 'yearly' | 'monthly' | 'hourly';
  annualMin: number | null;
  annualMax: number | null;
} {
  const normalizedPeriod =
    period?.toLowerCase() === 'hourly'
      ? 'hourly'
      : period?.toLowerCase() === 'monthly'
      ? 'monthly'
      : 'yearly';

  const normalizedMin = min ?? null;
  const normalizedMax = max ?? null;

  let annualMin: number | null = null;
  let annualMax: number | null = null;

  if (normalizedMin) {
    annualMin =
      normalizedPeriod === 'hourly'
        ? normalizedMin * 40 * 52 // 40 hours/week, 52 weeks/year
        : normalizedPeriod === 'monthly'
        ? normalizedMin * 12
        : normalizedMin;
  }

  if (normalizedMax) {
    annualMax =
      normalizedPeriod === 'hourly'
        ? normalizedMax * 40 * 52
        : normalizedPeriod === 'monthly'
        ? normalizedMax * 12
        : normalizedMax;
  }

  // Validate range
  if (annualMin && annualMax && annualMin > annualMax) {
    [annualMin, annualMax] = [annualMax, annualMin];
  }

  return {
    min: normalizedMin,
    max: normalizedMax,
    period: normalizedPeriod,
    annualMin,
    annualMax,
  };
}

/**
 * Helper: Convert to Title Case (preserving acronyms)
 */
function toTitleCase(str: string): string {
  // List of acronyms to preserve
  const acronyms = [
    'CEO',
    'CTO',
    'CFO',
    'COO',
    'VP',
    'SVP',
    'EVP',
    'API',
    'UI',
    'UX',
    'QA',
    'DevOps',
    'IT',
    'HR',
    'AI',
    'ML',
    'AWS',
    'iOS',
    'Android',
    'PHP',
    'SQL',
    'HTML',
    'CSS',
    'JavaScript',
  ];

  return str
    .split(' ')
    .map((word) => {
      // Check if it's a known acronym
      const upperWord = word.toUpperCase();
      if (acronyms.includes(upperWord)) {
        return upperWord;
      }

      // Check if it's in parentheses (preserve casing)
      if (word.startsWith('(') && word.endsWith(')')) {
        return word;
      }

      // Standard title case
      if (word.length === 0) return word;

      // Don't capitalize small words unless they're the first word
      const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'];
      if (smallWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Helper: Normalize capitalization (preserve acronyms and special casing)
 */
function normalizeCapitalization(str: string): string {
  // If the string is all uppercase or all lowercase, apply title case
  if (str === str.toUpperCase() || str === str.toLowerCase()) {
    return toTitleCase(str);
  }

  // Otherwise preserve existing casing (likely intentional like "iPhone" or "eBay")
  return str;
}

/**
 * Extract skills/tags from description using common patterns
 */
export function extractSkillsFromDescription(
  description: string,
  existingTags: string[] = []
): string[] {
  const skills = new Set<string>(existingTags);

  // Common tech skills to look for
  const techKeywords = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C\\+\\+',
    'C#',
    'Ruby',
    'Go',
    'Rust',
    'PHP',
    'Swift',
    'Kotlin',
    'React',
    'Angular',
    'Vue',
    'Node\\.?js',
    'Django',
    'Flask',
    'Spring',
    'Rails',
    'Express',
    'Next\\.?js',
    'AWS',
    'Azure',
    'GCP',
    'Docker',
    'Kubernetes',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Redis',
    'GraphQL',
    'REST',
    'API',
    'Git',
    'CI/CD',
    'Agile',
    'Scrum',
    'TDD',
  ];

  const lowerDesc = description.toLowerCase();

  for (const keyword of techKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(description)) {
      const match = description.match(regex);
      if (match) {
        skills.add(match[0]);
      }
    }
  }

  return Array.from(skills).slice(0, 20); // Limit to 20 tags
}

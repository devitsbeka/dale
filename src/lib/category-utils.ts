/**
 * Category utilities for displaying friendly category names
 */

/**
 * Map of category slugs to friendly display names
 */
export const CATEGORY_LABELS: Record<string, string> = {
  'software-dev': 'Software Development',
  'engineering': 'Engineering',
  'data': 'Data & Analytics',
  'devops': 'DevOps & Infrastructure',
  'design': 'Design',
  'product': 'Product Management',
  'marketing': 'Marketing',
  'sales': 'Sales',
  'customer-support': 'Customer Support',
  'hr': 'Human Resources',
  'finance': 'Finance',
  'legal': 'Legal',
  'operations': 'Operations',
  'writing': 'Content & Writing',
  'qa': 'Quality Assurance',
  'management': 'Management',
  'other': 'Other'
};

/**
 * Convert category slug to friendly label
 */
export function getCategoryLabel(category: string | null): string {
  if (!category) return 'Uncategorized';
  return CATEGORY_LABELS[category] || category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

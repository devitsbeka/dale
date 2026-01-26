/**
 * Text formatting utilities for job descriptions and content
 */

/**
 * Format job description/requirements/benefits for display
 * Handles both HTML and plain text, adds proper spacing
 */
export function formatJobText(text: string | null, maxLength?: number): string {
  if (!text) return '';

  let formatted = text;

  // Check if it's HTML
  const isHTML = /<[a-z][\s\S]*>/i.test(text);

  if (isHTML) {
    // Clean up HTML
    formatted = text
      // Add spacing after headings
      .replace(/<\/(h[1-6])>/gi, '</$1>\n\n')
      // Add spacing after paragraphs
      .replace(/<\/p>/gi, '</p>\n\n')
      // Add spacing after list items
      .replace(/<\/li>/gi, '</li>\n')
      // Add spacing after lists
      .replace(/<\/(ul|ol)>/gi, '</$1>\n\n')
      // Remove multiple consecutive newlines
      .replace(/\n{3,}/g, '\n\n')
      // Trim whitespace
      .trim();
  } else {
    // Plain text - add paragraph breaks
    formatted = text
      // Normalize line endings
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Add double newlines after periods followed by capital letters (likely new paragraph)
      .replace(/\.\s+([A-Z])/g, '.\n\n$1')
      // Clean up multiple spaces
      .replace(/  +/g, ' ')
      // Remove multiple consecutive newlines (max 2)
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  // Truncate if needed
  if (maxLength && formatted.length > maxLength) {
    formatted = formatted.substring(0, maxLength) + '...';
  }

  return formatted;
}

/**
 * Convert HTML to plain text for previews
 */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Sanitize resume data to remove HTML markup from achievements
 * This prevents hydration errors when old data contains HTML tags
 */

import type { ResumeData, WorkExperience } from '@/types/resume';

/**
 * Strip HTML tags from a string
 */
function stripHTML(html: string): string {
    if (typeof html !== 'string') return String(html || '');

    // Remove HTML tags
    let stripped = html.replace(/<[^>]*>/g, '');

    // Decode common HTML entities
    stripped = stripped
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"');

    // Trim whitespace
    return stripped.trim();
}

/**
 * Sanitize work experience achievements
 */
function sanitizeExperience(exp: WorkExperience): WorkExperience {
    return {
        ...exp,
        achievements: exp.achievements.map(achievement => stripHTML(achievement)).filter(a => a.trim() !== '')
    };
}

/**
 * Sanitize all resume data
 */
export function sanitizeResumeData(data: Partial<ResumeData>): Partial<ResumeData> {
    return {
        ...data,
        experience: data.experience?.map(sanitizeExperience) || []
    };
}

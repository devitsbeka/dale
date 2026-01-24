import type { ResumeData } from '@/types/resume';

export interface KeywordMatch {
    keyword: string;
    category: 'required' | 'preferred' | 'bonus';
    found: boolean;
    locations: string[]; // Where in resume the keyword appears
}

export interface KeywordAnalysisResult {
    matchRate: number; // 0-100 percentage
    totalKeywords: number;
    matchedKeywords: number;
    missingKeywords: KeywordMatch[];
    foundKeywords: KeywordMatch[];
    suggestions: string[];
}

/**
 * Extract keywords from job description
 * Identifies required, preferred, and bonus skills
 */
export function extractJobKeywords(jobDescription: string): {
    required: string[];
    preferred: string[];
    bonus: string[];
} {
    const text = jobDescription.toLowerCase();
    const required: string[] = [];
    const preferred: string[] = [];
    const bonus: string[] = [];

    // Common technical skills
    const technicalKeywords = [
        'javascript', 'typescript', 'react', 'node.js', 'python', 'java',
        'sql', 'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum',
        'rest api', 'graphql', 'mongodb', 'postgresql', 'redis', 'ci/cd',
        'machine learning', 'ai', 'data analysis', 'cloud', 'devops',
    ];

    // Common soft skills
    const softSkills = [
        'leadership', 'communication', 'teamwork', 'problem solving',
        'analytical', 'creative', 'organized', 'detail-oriented',
        'collaborative', 'self-motivated', 'adaptable', 'innovative',
    ];

    // Check for required sections
    const requiredSection = text.match(/(?:required|requirements|must have|essential)[:\s]+([\s\S]*?)(?:\n\n|preferred|desired|nice to have|$)/i);
    if (requiredSection) {
        const requiredText = requiredSection[1];

        technicalKeywords.forEach(keyword => {
            if (requiredText.includes(keyword)) {
                required.push(keyword);
            }
        });

        softSkills.forEach(keyword => {
            if (requiredText.includes(keyword)) {
                required.push(keyword);
            }
        });
    }

    // Check for preferred sections
    const preferredSection = text.match(/(?:preferred|desired|nice to have|plus)[:\s]+([\s\S]*?)(?:\n\n|$)/i);
    if (preferredSection) {
        const preferredText = preferredSection[1];

        technicalKeywords.forEach(keyword => {
            if (preferredText.includes(keyword) && !required.includes(keyword)) {
                preferred.push(keyword);
            }
        });

        softSkills.forEach(keyword => {
            if (preferredText.includes(keyword) && !required.includes(keyword)) {
                preferred.push(keyword);
            }
        });
    }

    // If no sections found, extract from entire text
    if (required.length === 0 && preferred.length === 0) {
        technicalKeywords.forEach(keyword => {
            if (text.includes(keyword)) {
                required.push(keyword);
            }
        });
    }

    // Extract degree requirements
    const degreePattern = /\b(bachelor'?s?|master'?s?|phd|doctorate)\b/gi;
    const degrees = text.match(degreePattern);
    if (degrees) {
        degrees.forEach(degree => {
            if (!required.includes(degree.toLowerCase())) {
                required.push(degree.toLowerCase());
            }
        });
    }

    // Extract years of experience
    const experiencePattern = /(\d+)\+?\s*years?\s+(?:of\s+)?experience/gi;
    const experience = text.match(experiencePattern);
    if (experience) {
        experience.forEach(exp => {
            if (!required.includes(exp.toLowerCase())) {
                required.push(exp.toLowerCase());
            }
        });
    }

    return { required, preferred, bonus };
}

/**
 * Analyze resume against job description keywords
 */
export function analyzeKeywords(
    resumeData: Partial<ResumeData>,
    jobDescription: string
): KeywordAnalysisResult {
    const { required, preferred, bonus } = extractJobKeywords(jobDescription);
    const allKeywords = [...required, ...preferred, ...bonus];

    // Build searchable resume text
    const resumeText = buildResumeSearchText(resumeData).toLowerCase();

    const matches: KeywordMatch[] = [];

    // Check required keywords
    required.forEach(keyword => {
        const found = resumeText.includes(keyword.toLowerCase());
        const locations = found ? findKeywordLocations(resumeData, keyword) : [];

        matches.push({
            keyword,
            category: 'required',
            found,
            locations,
        });
    });

    // Check preferred keywords
    preferred.forEach(keyword => {
        const found = resumeText.includes(keyword.toLowerCase());
        const locations = found ? findKeywordLocations(resumeData, keyword) : [];

        matches.push({
            keyword,
            category: 'preferred',
            found,
            locations,
        });
    });

    // Check bonus keywords
    bonus.forEach(keyword => {
        const found = resumeText.includes(keyword.toLowerCase());
        const locations = found ? findKeywordLocations(resumeData, keyword) : [];

        matches.push({
            keyword,
            category: 'bonus',
            found,
            locations,
        });
    });

    const matchedKeywords = matches.filter(m => m.found);
    const missingKeywords = matches.filter(m => !m.found);
    const matchRate = allKeywords.length > 0
        ? Math.round((matchedKeywords.length / allKeywords.length) * 100)
        : 0;

    // Generate suggestions
    const suggestions = generateSuggestions(missingKeywords, resumeData);

    return {
        matchRate,
        totalKeywords: allKeywords.length,
        matchedKeywords: matchedKeywords.length,
        missingKeywords,
        foundKeywords: matchedKeywords,
        suggestions,
    };
}

/**
 * Build searchable text from resume data
 */
function buildResumeSearchText(data: Partial<ResumeData>): string {
    const parts: string[] = [];

    if (data.personalInfo?.summary) {
        parts.push(data.personalInfo.summary);
    }

    if (data.experience) {
        data.experience.forEach(exp => {
            parts.push(exp.position, exp.company);
            parts.push(...exp.achievements);
        });
    }

    if (data.education) {
        data.education.forEach(edu => {
            parts.push(edu.degree, edu.field, edu.school);
        });
    }

    if (data.skills) {
        parts.push(...data.skills.map(s => s.name));
    }

    return parts.join(' ');
}

/**
 * Find where in the resume a keyword appears
 */
function findKeywordLocations(data: Partial<ResumeData>, keyword: string): string[] {
    const locations: string[] = [];
    const keywordLower = keyword.toLowerCase();

    if (data.personalInfo?.summary?.toLowerCase().includes(keywordLower)) {
        locations.push('Professional Summary');
    }

    if (data.skills?.some(s => s.name.toLowerCase().includes(keywordLower))) {
        locations.push('Skills');
    }

    if (data.experience?.some(exp =>
        exp.position.toLowerCase().includes(keywordLower) ||
        exp.company.toLowerCase().includes(keywordLower) ||
        exp.achievements.some(a => a.toLowerCase().includes(keywordLower))
    )) {
        locations.push('Work Experience');
    }

    if (data.education?.some(edu =>
        edu.degree.toLowerCase().includes(keywordLower) ||
        edu.field.toLowerCase().includes(keywordLower)
    )) {
        locations.push('Education');
    }

    return locations;
}

/**
 * Generate suggestions for missing keywords
 */
function generateSuggestions(
    missingKeywords: KeywordMatch[],
    resumeData: Partial<ResumeData>
): string[] {
    const suggestions: string[] = [];

    const missingRequired = missingKeywords.filter(k => k.category === 'required');
    const missingPreferred = missingKeywords.filter(k => k.category === 'preferred');

    if (missingRequired.length > 0) {
        suggestions.push(
            `Add ${missingRequired.length} required keyword${missingRequired.length > 1 ? 's' : ''}: ${
                missingRequired.slice(0, 3).map(k => k.keyword).join(', ')
            }${missingRequired.length > 3 ? '...' : ''}`
        );
    }

    if (missingPreferred.length > 0) {
        suggestions.push(
            `Consider adding preferred skills: ${
                missingPreferred.slice(0, 3).map(k => k.keyword).join(', ')
            }`
        );
    }

    // Check if skills section exists
    if (!resumeData.skills || resumeData.skills.length === 0) {
        suggestions.push('Add a Skills section to highlight your technical abilities');
    }

    // Check if summary mentions key skills
    const hasSkillsInSummary = resumeData.personalInfo?.summary &&
        missingKeywords.some(k =>
            resumeData.personalInfo!.summary!.toLowerCase().includes(k.keyword.toLowerCase())
        );

    if (!hasSkillsInSummary && missingKeywords.length > 0) {
        suggestions.push('Incorporate key job requirements into your professional summary');
    }

    return suggestions;
}

import type { ResumeData } from '@/types/resume';

export interface ATSIssue {
    category: 'critical' | 'warning' | 'suggestion';
    title: string;
    description: string;
    fix?: string;
}

export interface ATSAnalysisResult {
    score: number; // 0-100
    grade: 'excellent' | 'good' | 'fair' | 'poor';
    issues: ATSIssue[];
    strengths: string[];
    breakdown: {
        formatting: number; // 0-25
        content: number; // 0-25
        structure: number; // 0-25
        keywords: number; // 0-25
    };
}

/**
 * Analyze resume for ATS compatibility
 * Returns score 0-100 with detailed breakdown
 */
export function analyzeATSCompatibility(data: Partial<ResumeData>): ATSAnalysisResult {
    const issues: ATSIssue[] = [];
    const strengths: string[] = [];
    let formattingScore = 25;
    let contentScore = 25;
    let structureScore = 25;
    let keywordScore = 25;

    // === FORMATTING CHECKS (25 points) ===

    // Check for standard section headers
    const hasExperience = (data.experience?.length || 0) > 0;
    const hasEducation = (data.education?.length || 0) > 0;
    const hasSkills = (data.skills?.length || 0) > 0;

    if (!hasExperience) {
        issues.push({
            category: 'critical',
            title: 'Missing Work Experience',
            description: 'ATS systems expect a "Work Experience" or "Experience" section',
            fix: 'Add at least one work experience entry',
        });
        formattingScore -= 10;
    } else {
        strengths.push('Standard work experience section present');
    }

    if (!hasEducation) {
        issues.push({
            category: 'warning',
            title: 'Missing Education',
            description: 'Most ATS systems look for an education section',
            fix: 'Add your educational background',
        });
        formattingScore -= 5;
    } else {
        strengths.push('Education section included');
    }

    if (!hasSkills) {
        issues.push({
            category: 'warning',
            title: 'Missing Skills Section',
            description: 'Skills section helps ATS match you to job requirements',
            fix: 'Add a skills section with relevant keywords',
        });
        formattingScore -= 5;
    } else {
        strengths.push('Skills section included');
    }

    // Check contact information
    const personalInfo = data.personalInfo;
    if (!personalInfo?.email || !personalInfo?.phone) {
        issues.push({
            category: 'critical',
            title: 'Incomplete Contact Information',
            description: 'ATS requires email and phone number',
            fix: 'Add both email and phone number',
        });
        formattingScore -= 5;
    } else {
        strengths.push('Complete contact information');
    }

    // === CONTENT CHECKS (25 points) ===

    // Check for professional summary
    if (!personalInfo?.summary || personalInfo.summary.length < 50) {
        issues.push({
            category: 'suggestion',
            title: 'Missing or Short Professional Summary',
            description: 'A summary helps ATS understand your profile quickly',
            fix: 'Add a 2-3 sentence professional summary (100-200 words)',
        });
        contentScore -= 5;
    } else {
        strengths.push('Professional summary included');
    }

    // Check for action verbs and metrics in experience
    if (hasExperience && data.experience) {
        const actionVerbs = [
            'managed', 'led', 'developed', 'created', 'implemented', 'improved',
            'increased', 'decreased', 'achieved', 'delivered', 'designed', 'built',
            'launched', 'established', 'optimized', 'coordinated', 'analyzed',
        ];

        let hasActionVerbs = false;
        let hasMetrics = false;
        const metricPattern = /\d+%|\$[\d,]+|\d+[\sx]|increase|decrease|reduce|improve/i;

        for (const exp of data.experience) {
            const achievementText = exp.achievements.join(' ').toLowerCase();

            if (actionVerbs.some(verb => achievementText.includes(verb))) {
                hasActionVerbs = true;
            }

            if (metricPattern.test(exp.achievements.join(' '))) {
                hasMetrics = true;
            }
        }

        if (!hasActionVerbs) {
            issues.push({
                category: 'suggestion',
                title: 'Limited Action Verbs',
                description: 'Start bullet points with strong action verbs',
                fix: 'Use verbs like "managed", "led", "developed", "improved"',
            });
            contentScore -= 5;
        } else {
            strengths.push('Strong action verbs used');
        }

        if (!hasMetrics) {
            issues.push({
                category: 'suggestion',
                title: 'Missing Quantifiable Achievements',
                description: 'ATS and recruiters value metrics and numbers',
                fix: 'Add numbers, percentages, or measurable results',
            });
            contentScore -= 5;
        } else {
            strengths.push('Quantifiable achievements included');
        }
    }

    // === STRUCTURE CHECKS (25 points) ===

    // Check for consistent date formatting
    if (hasExperience && data.experience) {
        const dates = data.experience.map(exp => exp.startDate + ' ' + exp.endDate);
        const hasInconsistentDates = dates.some(date =>
            !date.match(/\d{4}/) && !date.match(/[A-Z][a-z]{2}\s+\d{4}/)
        );

        if (hasInconsistentDates) {
            issues.push({
                category: 'warning',
                title: 'Inconsistent Date Formatting',
                description: 'Use consistent date format throughout',
                fix: 'Use format like "Jan 2020" or "2020-01"',
            });
            structureScore -= 5;
        } else {
            strengths.push('Consistent date formatting');
        }
    }

    // Check for appropriate resume length
    const totalBullets = (data.experience?.reduce((sum, exp) =>
        sum + exp.achievements.length, 0) || 0);

    if (totalBullets < 5) {
        issues.push({
            category: 'warning',
            title: 'Limited Experience Details',
            description: 'Resume appears too brief for ATS parsing',
            fix: 'Add more detail about your responsibilities and achievements',
        });
        structureScore -= 5;
    } else if (totalBullets > 20) {
        issues.push({
            category: 'suggestion',
            title: 'Potentially Too Detailed',
            description: 'Very long resumes can overwhelm ATS systems',
            fix: 'Focus on most relevant and recent experience',
        });
        structureScore -= 3;
    } else {
        strengths.push('Appropriate level of detail');
    }

    // Check for location information
    if (hasExperience && data.experience) {
        const missingLocations = data.experience.filter(exp => !exp.location);
        if (missingLocations.length > 0) {
            issues.push({
                category: 'suggestion',
                title: 'Missing Location Information',
                description: 'Some positions lack location details',
                fix: 'Add city and state/country for each position',
            });
            structureScore -= 3;
        }
    }

    // === KEYWORD CHECKS (25 points) ===

    const skillCount = data.skills?.length || 0;

    if (skillCount < 5) {
        issues.push({
            category: 'warning',
            title: 'Limited Skills Listed',
            description: 'ATS matches resumes based on skills keywords',
            fix: 'Add at least 8-12 relevant skills',
        });
        keywordScore -= 10;
    } else if (skillCount >= 10) {
        strengths.push('Comprehensive skills section');
    } else {
        keywordScore -= 5;
    }

    // Check for skill categories
    if (hasSkills && data.skills) {
        const categories = new Set(data.skills.map(s => s.category));
        if (categories.size >= 2) {
            strengths.push('Diverse skill categories');
        } else {
            issues.push({
                category: 'suggestion',
                title: 'Limited Skill Diversity',
                description: 'Include different types of skills (technical, soft, tools)',
                fix: 'Add skills from multiple categories',
            });
            keywordScore -= 5;
        }
    }

    // Check for industry-specific keywords in summary
    if (personalInfo?.summary) {
        const commonKeywords = [
            'experience', 'expertise', 'skilled', 'proficient', 'specialist',
            'professional', 'certified', 'proven', 'results', 'leadership',
        ];
        const hasKeywords = commonKeywords.some(keyword =>
            personalInfo.summary.toLowerCase().includes(keyword)
        );

        if (!hasKeywords) {
            issues.push({
                category: 'suggestion',
                title: 'Limited Keywords in Summary',
                description: 'Professional summary lacks industry keywords',
                fix: 'Include relevant industry terms and qualifications',
            });
            keywordScore -= 5;
        }
    }

    // Calculate final score
    const totalScore = formattingScore + contentScore + structureScore + keywordScore;

    // Determine grade
    let grade: 'excellent' | 'good' | 'fair' | 'poor';
    if (totalScore >= 85) grade = 'excellent';
    else if (totalScore >= 70) grade = 'good';
    else if (totalScore >= 55) grade = 'fair';
    else grade = 'poor';

    return {
        score: totalScore,
        grade,
        issues,
        strengths,
        breakdown: {
            formatting: formattingScore,
            content: contentScore,
            structure: structureScore,
            keywords: keywordScore,
        },
    };
}

/**
 * Get color for ATS score display
 */
export function getScoreColor(score: number): string {
    if (score >= 85) return 'emerald';
    if (score >= 70) return 'blue';
    if (score >= 55) return 'yellow';
    return 'red';
}

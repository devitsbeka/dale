import type { ResumeData } from '@/types/resume';

export function generateJSON(data: Partial<ResumeData>): string {
    // Clean up the data and ensure it's properly formatted
    const cleanData = {
        personalInfo: data.personalInfo || {},
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        customization: data.customization || {},
        metadata: {
            exportedAt: new Date().toISOString(),
            version: '1.0',
        },
    };

    return JSON.stringify(cleanData, null, 2);
}

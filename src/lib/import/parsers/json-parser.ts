import type { ResumeData } from '@/types/resume';

export function parseJSON(jsonString: string): Partial<ResumeData> {
    try {
        const data = JSON.parse(jsonString);

        // Validate that it's a resume data object
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid JSON format');
        }

        // Return the parsed data (assuming it matches ResumeData structure)
        return data as Partial<ResumeData>;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Failed to parse JSON file');
    }
}

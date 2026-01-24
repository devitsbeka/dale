import type { ResumeData } from '@/types/resume';

export interface TemplateProps {
    data: Partial<ResumeData>;
}

export interface TemplateMetadata {
    id: string;
    name: string;
    description: string;
    category: 'professional' | 'creative' | 'minimal' | 'academic';
    primaryFont: string;
    accentColor: string;
}

export const AVAILABLE_TEMPLATES: TemplateMetadata[] = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and contemporary design with subtle accents',
        category: 'professional',
        primaryFont: 'Inter',
        accentColor: '#3B82F6',
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional serif layout for formal industries',
        category: 'professional',
        primaryFont: 'Georgia',
        accentColor: '#1F2937',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Ultra-clean sans-serif with maximum white space',
        category: 'minimal',
        primaryFont: 'Helvetica',
        accentColor: '#000000',
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Bold colors and asymmetric layout for design roles',
        category: 'creative',
        primaryFont: 'Poppins',
        accentColor: '#8B5CF6',
    },
    {
        id: 'executive',
        name: 'Executive',
        description: 'Refined and authoritative for senior positions',
        category: 'professional',
        primaryFont: 'Playfair Display',
        accentColor: '#0F172A',
    },
    {
        id: 'tech',
        name: 'Tech',
        description: 'Developer-focused with monospace accents',
        category: 'professional',
        primaryFont: 'JetBrains Mono',
        accentColor: '#10B981',
    },
    {
        id: 'academic',
        name: 'Academic',
        description: 'Publication-emphasis layout for researchers',
        category: 'academic',
        primaryFont: 'Times New Roman',
        accentColor: '#374151',
    },
    {
        id: 'compact',
        name: 'Compact',
        description: 'Dense one-page layout maximizing content',
        category: 'minimal',
        primaryFont: 'Arial',
        accentColor: '#1E40AF',
    },
];

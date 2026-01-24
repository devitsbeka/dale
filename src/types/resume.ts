export interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    summary: string;
}

export interface WorkExperience {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    achievements: string[];
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
}

export interface Skill {
    id: string;
    name: string;
    category: 'technical' | 'soft' | 'language' | 'tool';
}

export interface ResumeTemplate {
    id: string;
    name: string;
    description: string;
    preview: string;
}

export interface ResumeCustomization {
    template: string;
    primaryColor: string;
    font: string;
    sectionOrder: string[];
}

export interface ResumeData {
    id: string;
    name: string; // User-defined name for this resume version
    personalInfo: PersonalInfo;
    experience: WorkExperience[];
    education: Education[];
    skills: Skill[];
    customization: ResumeCustomization;
    createdAt: string;
    updatedAt: string;
}

export type WizardStep =
    | 'personal'
    | 'experience'
    | 'education'
    | 'skills'
    | 'customize'
    | 'preview';

export interface WizardState {
    currentStep: WizardStep;
    completedSteps: WizardStep[];
    data: Partial<ResumeData>;
}

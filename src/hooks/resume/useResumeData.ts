import { useState, useCallback } from 'react';
import type {
    ResumeData,
    PersonalInfo,
    WorkExperience,
    Education,
    Skill,
    ResumeCustomization,
} from '@/types/resume';

const defaultResumeData: Partial<ResumeData> = {
    personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
        summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    customization: {
        template: 'modern',
        primaryColor: '#E9684B',
        font: 'inter',
        sectionOrder: ['experience', 'education', 'skills'],
    },
};

export function useResumeData() {
    const [resumeData, setResumeData] = useState<Partial<ResumeData>>(defaultResumeData);
    const [resumeId, setResumeId] = useState<string | null>(null);

    const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
        setResumeData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, ...info } as PersonalInfo,
        }));
    }, []);

    const addExperience = useCallback((exp: WorkExperience) => {
        setResumeData((prev) => ({
            ...prev,
            experience: [...(prev.experience || []), exp],
        }));
    }, []);

    const updateExperience = useCallback((id: string, exp: Partial<WorkExperience>) => {
        setResumeData((prev) => ({
            ...prev,
            experience: (prev.experience || []).map((e) =>
                e.id === id ? { ...e, ...exp } : e
            ),
        }));
    }, []);

    const removeExperience = useCallback((id: string) => {
        setResumeData((prev) => ({
            ...prev,
            experience: (prev.experience || []).filter((e) => e.id !== id),
        }));
    }, []);

    const addEducation = useCallback((edu: Education) => {
        setResumeData((prev) => ({
            ...prev,
            education: [...(prev.education || []), edu],
        }));
    }, []);

    const updateEducation = useCallback((id: string, edu: Partial<Education>) => {
        setResumeData((prev) => ({
            ...prev,
            education: (prev.education || []).map((e) =>
                e.id === id ? { ...e, ...edu } : e
            ),
        }));
    }, []);

    const removeEducation = useCallback((id: string) => {
        setResumeData((prev) => ({
            ...prev,
            education: (prev.education || []).filter((e) => e.id !== id),
        }));
    }, []);

    const addSkill = useCallback((skill: Skill) => {
        setResumeData((prev) => ({
            ...prev,
            skills: [...(prev.skills || []), skill],
        }));
    }, []);

    const removeSkill = useCallback((id: string) => {
        setResumeData((prev) => ({
            ...prev,
            skills: (prev.skills || []).filter((s) => s.id !== id),
        }));
    }, []);

    const updateCustomization = useCallback((custom: Partial<ResumeCustomization>) => {
        setResumeData((prev) => ({
            ...prev,
            customization: { ...prev.customization, ...custom } as ResumeCustomization,
        }));
    }, []);

    const resetData = useCallback(() => {
        setResumeData(defaultResumeData);
        setResumeId(null);
    }, []);

    return {
        resumeData,
        resumeId,
        setResumeData,
        setResumeId,
        updatePersonalInfo,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        removeSkill,
        updateCustomization,
        resetData,
    };
}

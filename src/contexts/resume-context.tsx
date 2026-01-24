'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ResumeData, WizardStep, PersonalInfo, WorkExperience, Education, Skill, ResumeCustomization } from '@/types/resume';

interface ResumeContextType {
    resumeData: Partial<ResumeData>;
    currentStep: WizardStep;
    completedSteps: WizardStep[];
    isOnboardingEnabled: boolean;

    // Actions
    updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
    addExperience: (exp: WorkExperience) => void;
    updateExperience: (id: string, exp: Partial<WorkExperience>) => void;
    removeExperience: (id: string) => void;
    addEducation: (edu: Education) => void;
    updateEducation: (id: string, edu: Partial<Education>) => void;
    removeEducation: (id: string) => void;
    addSkill: (skill: Skill) => void;
    removeSkill: (id: string) => void;
    updateCustomization: (custom: Partial<ResumeCustomization>) => void;
    setCurrentStep: (step: WizardStep) => void;
    markStepComplete: (step: WizardStep) => void;
    toggleOnboarding: () => void;
    saveResume: () => void;
    loadResume: (id: string) => void;
    resetResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const STORAGE_KEY = 'dale_resume_data';
const ONBOARDING_KEY = 'dale_resume_onboarding_disabled';

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

export function ResumeProvider({ children }: { children: React.ReactNode }) {
    const [resumeData, setResumeData] = useState<Partial<ResumeData>>(defaultResumeData);
    const [currentStep, setCurrentStep] = useState<WizardStep>('personal');
    const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
    const [isOnboardingEnabled, setIsOnboardingEnabled] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setResumeData(parsed);
            } catch (e) {
                console.error('Failed to parse saved resume data', e);
            }
        }

        const onboardingDisabled = localStorage.getItem(ONBOARDING_KEY);
        if (onboardingDisabled === 'true') {
            setIsOnboardingEnabled(false);
        }
    }, []);

    // Auto-save to localStorage
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [resumeData]);

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

    const markStepComplete = useCallback((step: WizardStep) => {
        setCompletedSteps((prev) => {
            if (prev.includes(step)) return prev;
            return [...prev, step];
        });
    }, []);

    const toggleOnboarding = useCallback(() => {
        setIsOnboardingEnabled((prev) => {
            const newValue = !prev;
            localStorage.setItem(ONBOARDING_KEY, String(!newValue));
            return newValue;
        });
    }, []);

    const saveResume = useCallback(() => {
        const updated = {
            ...resumeData,
            updatedAt: new Date().toISOString(),
        };
        setResumeData(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }, [resumeData]);

    const loadResume = useCallback((id: string) => {
        // In a real app, this would load from a database
        // For now, we'll just load from localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setResumeData(JSON.parse(saved));
        }
    }, []);

    const resetResume = useCallback(() => {
        setResumeData(defaultResumeData);
        setCurrentStep('personal');
        setCompletedSteps([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <ResumeContext.Provider
            value={{
                resumeData,
                currentStep,
                completedSteps,
                isOnboardingEnabled,
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
                setCurrentStep,
                markStepComplete,
                toggleOnboarding,
                saveResume,
                loadResume,
                resetResume,
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error('useResume must be used within ResumeProvider');
    }
    return context;
}

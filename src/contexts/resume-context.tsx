'use client';

import React, { createContext, useContext, useEffect, useCallback } from 'react';
import type { ResumeData, WizardStep, PersonalInfo, WorkExperience, Education, Skill, ResumeCustomization } from '@/types/resume';
import { useResume as useResumeHook } from '@/hooks/resume';

interface ResumeContextType {
    resumeData: Partial<ResumeData>;
    currentStep: WizardStep;
    completedSteps: WizardStep[];
    isOnboardingEnabled: boolean;

    // Actions
    setResumeData: (data: Partial<ResumeData>) => void;
    updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
    addExperience: (exp: WorkExperience) => void;
    updateExperience: (id: string, exp: Partial<WorkExperience>) => void;
    removeExperience: (id: string) => void;
    setExperiences: (experiences: WorkExperience[]) => void;
    addEducation: (edu: Education) => void;
    updateEducation: (id: string, edu: Partial<Education>) => void;
    removeEducation: (id: string) => void;
    setEducation: (education: Education[]) => void;
    addSkill: (skill: Skill) => void;
    removeSkill: (id: string) => void;
    updateCustomization: (custom: Partial<ResumeCustomization>) => void;
    setCurrentStep: (step: WizardStep) => void;
    markStepComplete: (step: WizardStep) => void;
    toggleOnboarding: () => void;
    saveResume: () => void;
    loadResume: (id: string) => void;
    resetResume: () => void;

    // New properties from refactored hooks
    isSaving?: boolean;
    lastSaved?: Date | null;
    saveError?: string | null;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const STORAGE_KEY = 'dale_resume_data';

export function ResumeProvider({ children }: { children: React.ReactNode }) {
    const resume = useResumeHook();

    // Load from localStorage on mount (backward compatibility)
    useEffect(() => {
        // Only access localStorage on client side
        if (typeof window === 'undefined') return;

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && !resume.resumeId) {
            try {
                const parsed = JSON.parse(saved);
                resume.setResumeData(parsed);
            } catch (e) {
                console.error('Failed to parse saved resume data', e);
            }
        }
    }, [resume]);

    const saveResume = useCallback(async () => {
        try {
            await resume.saveNow();
        } catch (error) {
            console.error('Failed to save resume:', error);
        }
    }, [resume]);

    const loadResume = useCallback(async (id: string) => {
        try {
            const data = await resume.fetchResume(id);
            resume.setResumeData(data);
            resume.setResumeId(id);
        } catch (error) {
            console.error('Failed to load resume:', error);
            // Fallback to localStorage
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                resume.setResumeData(JSON.parse(saved));
            }
        }
    }, [resume]);

    const resetResume = useCallback(() => {
        resume.resetData();
        resume.resetWizard();
        localStorage.removeItem(STORAGE_KEY);
    }, [resume]);

    const value: ResumeContextType = {
        resumeData: resume.resumeData,
        currentStep: resume.currentStep,
        completedSteps: resume.completedSteps,
        isOnboardingEnabled: resume.isOnboardingEnabled,
        setResumeData: resume.setResumeData,
        updatePersonalInfo: resume.updatePersonalInfo,
        addExperience: resume.addExperience,
        updateExperience: resume.updateExperience,
        removeExperience: resume.removeExperience,
        setExperiences: resume.setExperiences,
        addEducation: resume.addEducation,
        updateEducation: resume.updateEducation,
        removeEducation: resume.removeEducation,
        setEducation: resume.setEducation,
        addSkill: resume.addSkill,
        removeSkill: resume.removeSkill,
        updateCustomization: resume.updateCustomization,
        setCurrentStep: resume.setCurrentStep,
        markStepComplete: resume.markStepComplete,
        toggleOnboarding: resume.toggleOnboarding,
        saveResume,
        loadResume,
        resetResume,
        isSaving: resume.isSaving,
        lastSaved: resume.lastSaved,
        saveError: resume.saveError,
    };

    return (
        <ResumeContext.Provider value={value}>
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

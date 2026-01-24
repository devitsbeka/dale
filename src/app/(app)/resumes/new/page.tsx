'use client';

import React, { useState, useEffect, Suspense } from 'react';
import type { Key } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '@/components/application/tabs/tabs';
import { ResumeProvider, useResume } from '@/contexts/resume-context';
import { PersonalInfoStep } from '@/components/resume/steps/personal-info-step';
import { ExperienceStep } from '@/components/resume/steps/experience-step';
import { EducationStep } from '@/components/resume/steps/education-step';
import { SkillsStep } from '@/components/resume/steps/skills-step';
import { CustomizeStep } from '@/components/resume/steps/customize-step';
import { PreviewStep } from '@/components/resume/steps/preview-step';
import { ResumePreview } from '@/components/resume/resume-preview';
import { OnboardingOverlay } from '@/components/resume/onboarding-overlay';
import { Check } from '@untitledui/icons';
import { useSearchParams } from 'next/navigation';
import type { WizardStep } from '@/types/resume';

const STEPS: { id: WizardStep; label: string; description: string }[] = [
    { id: 'personal', label: 'Personal Info', description: 'Your contact details' },
    { id: 'experience', label: 'Experience', description: 'Work history' },
    { id: 'education', label: 'Education', description: 'Academic background' },
    { id: 'skills', label: 'Skills', description: 'Your expertise' },
    { id: 'customize', label: 'Customize', description: 'Template & style' },
    { id: 'preview', label: 'Preview', description: 'Review & export' },
];

// Loading skeleton for SSR
function LoadingSkeleton() {
    return (
        <div className="flex h-screen bg-primary">
            <div className="flex w-[600px] flex-col border-r border-secondary">
                <div className="border-b border-secondary bg-primary px-6 py-6">
                    <div className="h-7 w-48 animate-pulse rounded bg-secondary"></div>
                    <div className="mt-2 h-4 w-64 animate-pulse rounded bg-secondary"></div>
                </div>
                <div className="flex gap-2 border-b border-secondary px-6 py-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-8 w-24 animate-pulse rounded bg-secondary"></div>
                    ))}
                </div>
                <div className="flex-1 p-6">
                    <div className="space-y-4">
                        <div className="h-10 w-full animate-pulse rounded bg-secondary"></div>
                        <div className="h-10 w-full animate-pulse rounded bg-secondary"></div>
                        <div className="h-10 w-3/4 animate-pulse rounded bg-secondary"></div>
                    </div>
                </div>
            </div>
            <div className="flex flex-1 flex-col bg-secondary/30">
                <div className="border-b border-secondary bg-primary px-6 py-4">
                    <div className="h-5 w-24 animate-pulse rounded bg-secondary"></div>
                </div>
                <div className="flex-1 p-6">
                    <div className="mx-auto h-[600px] max-w-[800px] animate-pulse rounded-lg bg-white shadow-xl"></div>
                </div>
            </div>
        </div>
    );
}

function ResumeBuilderContent() {
    const [isMounted, setIsMounted] = useState(false);
    const { currentStep, setCurrentStep, completedSteps, isOnboardingEnabled, resumeData, setResumeData } = useResume();
    const [showOnboarding, setShowOnboarding] = useState(true);
    const searchParams = useSearchParams();

    // Client-side mount guard to prevent hydration mismatches
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load imported resume data if present
    useEffect(() => {
        const isImport = searchParams.get('import');
        if (isImport === 'true') {
            const importedData = localStorage.getItem('dale_imported_resume');
            if (importedData) {
                try {
                    const data = JSON.parse(importedData);
                    setResumeData(data);
                    localStorage.removeItem('dale_imported_resume');
                } catch (error) {
                    console.error('Failed to load imported resume:', error);
                }
            }
        }
    }, [searchParams, setResumeData]);

    const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEPS.length - 1;

    const handleNext = () => {
        if (!isLastStep) {
            setCurrentStep(STEPS[currentStepIndex + 1].id);
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setCurrentStep(STEPS[currentStepIndex - 1].id);
        }
    };

    const handleTabChange = (key: Key) => {
        setCurrentStep(key as WizardStep);
    };

    // Show loading skeleton during SSR to avoid hydration mismatch
    if (!isMounted) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="relative flex h-screen overflow-hidden bg-primary">
            {/* Onboarding overlay */}
            {isOnboardingEnabled && showOnboarding && (
                <OnboardingOverlay
                    currentStep={currentStep}
                    onDismiss={() => setShowOnboarding(false)}
                />
            )}

            {/* Left side - Form */}
            <div className="flex w-[600px] flex-col border-r border-secondary">
                {/* Header */}
                <div className="border-b border-secondary bg-primary px-6 py-6">
                    <div>
                        <h1 className="text-xl font-semibold text-primary">Create Your Resume</h1>
                        <p className="mt-1 text-sm text-tertiary">
                            Build an ATS-optimized resume in minutes
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <Tabs
                    selectedKey={currentStep}
                    onSelectionChange={handleTabChange}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <TabList
                        type="underline"
                        className="border-b border-secondary px-6"
                        items={STEPS}
                    >
                        {(item) => {
                            const stepId = item.id as WizardStep;
                            const index = STEPS.findIndex((s) => s.id === stepId);
                            const isCompleted = completedSteps.includes(stepId);
                            const isCurrent = stepId === currentStep;
                            const isAccessible = isCompleted || isCurrent || index <= currentStepIndex;

                            return (
                                <Tab
                                    id={item.id}
                                    isDisabled={!isAccessible}
                                    className="relative"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                                                isCompleted
                                                    ? 'bg-success-500 text-white'
                                                    : isCurrent
                                                      ? 'bg-brand-600 text-white'
                                                      : isAccessible
                                                        ? 'bg-secondary text-tertiary'
                                                        : 'bg-quaternary/30 text-quaternary'
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <Check className="h-3 w-3" />
                                            ) : (
                                                <span className="text-[10px]">{index + 1}</span>
                                            )}
                                        </div>
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                </Tab>
                            );
                        }}
                    </TabList>

                    {/* Content area */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <TabPanel id="personal">
                            <PersonalInfoStep onNext={handleNext} />
                        </TabPanel>
                        <TabPanel id="experience">
                            <ExperienceStep onNext={handleNext} onPrevious={handlePrevious} />
                        </TabPanel>
                        <TabPanel id="education">
                            <EducationStep onNext={handleNext} onPrevious={handlePrevious} />
                        </TabPanel>
                        <TabPanel id="skills">
                            <SkillsStep onNext={handleNext} onPrevious={handlePrevious} />
                        </TabPanel>
                        <TabPanel id="customize">
                            <CustomizeStep onNext={handleNext} onPrevious={handlePrevious} />
                        </TabPanel>
                        <TabPanel id="preview">
                            <PreviewStep
                                onPrevious={handlePrevious}
                                onClose={() => window.history.back()}
                            />
                        </TabPanel>
                    </div>
                </Tabs>
            </div>

            {/* Right side - Live Preview */}
            <div className="flex flex-1 flex-col bg-secondary/30">
                <div className="border-b border-secondary bg-primary px-6 py-4">
                    <h2 className="text-sm font-semibold text-primary">Live Preview</h2>
                    <p className="text-xs text-tertiary">See your resume update in real-time</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-[800px]">
                        <ResumePreview data={resumeData} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResumeNewPage() {
    return (
        <ResumeProvider>
            <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
                <ResumeBuilderContent />
            </Suspense>
        </ResumeProvider>
    );
}

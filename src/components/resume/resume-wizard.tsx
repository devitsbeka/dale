'use client';

import React, { useState } from 'react';
import { Modal, ModalOverlay, Dialog } from '@/components/application/modals/modal';
import { Button } from '@/components/base/buttons/button';
import { useResume } from '@/contexts/resume-context';
import { PersonalInfoStep } from './steps/personal-info-step';
import { ExperienceStep } from './steps/experience-step';
import { EducationStep } from './steps/education-step';
import { SkillsStep } from './steps/skills-step';
import { CustomizeStep } from './steps/customize-step';
import { PreviewStep } from './steps/preview-step';
import { ResumePreview } from './resume-preview';
import { OnboardingOverlay } from './onboarding-overlay';
import { Check, X } from '@untitledui/icons';
import type { WizardStep } from '@/types/resume';

interface ResumeWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS: { id: WizardStep; label: string; description: string }[] = [
    { id: 'personal', label: 'Personal Info', description: 'Your contact details' },
    { id: 'experience', label: 'Experience', description: 'Work history' },
    { id: 'education', label: 'Education', description: 'Academic background' },
    { id: 'skills', label: 'Skills', description: 'Your expertise' },
    { id: 'customize', label: 'Customize', description: 'Template & style' },
    { id: 'preview', label: 'Preview', description: 'Review & export' },
];

export function ResumeWizard({ isOpen, onClose }: ResumeWizardProps) {
    const { currentStep, setCurrentStep, completedSteps, isOnboardingEnabled, resumeData } = useResume();
    const [showOnboarding, setShowOnboarding] = useState(true);

    const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEPS.length - 1;
    const progressPercentage = ((currentStepIndex + 1) / STEPS.length) * 100;

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

    const handleStepClick = (stepId: WizardStep) => {
        setCurrentStep(stepId);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 'personal':
                return <PersonalInfoStep onNext={handleNext} />;
            case 'experience':
                return <ExperienceStep onNext={handleNext} onPrevious={handlePrevious} />;
            case 'education':
                return <EducationStep onNext={handleNext} onPrevious={handlePrevious} />;
            case 'skills':
                return <SkillsStep onNext={handleNext} onPrevious={handlePrevious} />;
            case 'customize':
                return <CustomizeStep onNext={handleNext} onPrevious={handlePrevious} />;
            case 'preview':
                return <PreviewStep onPrevious={handlePrevious} onClose={onClose} />;
            default:
                return null;
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onClose} isDismissable={false}>
            <Modal className="max-w-[1600px]">
                <Dialog>
                    <div className="relative flex h-[90vh] w-full overflow-hidden rounded-2xl bg-primary shadow-2xl ring-1 ring-secondary">
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
                                <div className="mb-6 flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold text-primary">
                                            Create Your Resume
                                        </h2>
                                        <p className="mt-1 text-sm text-tertiary">
                                            Build an ATS-optimized resume in minutes
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="rounded-lg p-2 text-tertiary outline-focus-ring transition hover:bg-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
                                        aria-label="Close"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Progress bar */}
                                <div className="mb-6">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-medium text-secondary">
                                            Step {currentStepIndex + 1} of {STEPS.length}
                                        </span>
                                        <span className="text-xs font-medium text-secondary">
                                            {Math.round(progressPercentage)}% Complete
                                        </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500 ease-out"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Step indicators */}
                                <div className="flex items-center gap-2">
                                    {STEPS.map((step, index) => {
                                        const isCompleted = completedSteps.includes(step.id);
                                        const isCurrent = step.id === currentStep;
                                        const isAccessible =
                                            isCompleted || isCurrent || index <= currentStepIndex;

                                        return (
                                            <button
                                                key={step.id}
                                                onClick={() => isAccessible && handleStepClick(step.id)}
                                                disabled={!isAccessible}
                                                className={`group relative flex flex-1 flex-col items-center gap-1.5 rounded-lg border p-2 outline-focus-ring transition-all focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                                    isCurrent
                                                        ? 'border-brand-500 bg-brand-50'
                                                        : isAccessible
                                                          ? 'border-secondary bg-secondary/30 hover:border-brand-300 hover:bg-brand-50/50 cursor-pointer'
                                                          : 'border-transparent bg-secondary/20 cursor-not-allowed opacity-50'
                                                }`}
                                            >
                                                <div
                                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all ${
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
                                                <span
                                                    className={`text-[10px] font-medium transition-all ${
                                                        isCurrent
                                                            ? 'text-brand-700'
                                                            : isAccessible
                                                              ? 'text-secondary'
                                                              : 'text-quaternary'
                                                    }`}
                                                >
                                                    {step.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Content area */}
                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                {renderStepContent()}
                            </div>
                        </div>

                        {/* Right side - Live Preview */}
                        <div className="flex flex-1 flex-col bg-secondary/30">
                            <div className="border-b border-secondary bg-primary px-6 py-4">
                                <h3 className="text-sm font-semibold text-primary">Live Preview</h3>
                                <p className="text-xs text-tertiary">See your resume update in real-time</p>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="mx-auto max-w-[800px]">
                                    <ResumePreview data={resumeData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}

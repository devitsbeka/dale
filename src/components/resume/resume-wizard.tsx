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
    const { currentStep, setCurrentStep, completedSteps, isOnboardingEnabled } = useResume();
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
        <ModalOverlay isOpen={isOpen} onOpenChange={onClose} isDismissable={true}>
            <Modal className="max-w-7xl">
                <Dialog>
                    <div className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-primary shadow-2xl ring-1 ring-secondary">
                        {/* Onboarding overlay */}
                        {isOnboardingEnabled && showOnboarding && (
                            <OnboardingOverlay
                                currentStep={currentStep}
                                onDismiss={() => setShowOnboarding(false)}
                            />
                        )}

                        {/* Header */}
                        <div className="border-b border-secondary bg-primary px-8 pt-8 pb-6">
                            <div className="mb-8 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-primary">
                                        Create Your Resume
                                    </h2>
                                    <p className="mt-1.5 text-sm text-tertiary">
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
                            <div className="relative flex items-center justify-between">
                                {/* Progress line background */}
                                <div className="absolute left-6 right-6 top-3 h-0.5 bg-secondary" />
                                <div
                                    className="absolute left-6 top-3 h-0.5 bg-brand-500 transition-all duration-500 ease-out"
                                    style={{
                                        width: `calc(${(currentStepIndex / (STEPS.length - 1)) * 100}% - 48px)`,
                                    }}
                                />

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
                                            className={`group relative z-10 flex flex-col items-center gap-2 outline-focus-ring transition-all focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                                isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'
                                            }`}
                                        >
                                            {/* Circle indicator */}
                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-full border-4 font-semibold shadow-lg transition-all ${
                                                    isCompleted
                                                        ? 'border-success-500 bg-success-500 text-white ring-4 ring-success-500/20'
                                                        : isCurrent
                                                          ? 'border-white bg-brand-600 text-white ring-4 ring-brand-500/30 scale-110'
                                                          : isAccessible
                                                            ? 'border-white bg-secondary text-tertiary ring-2 ring-secondary group-hover:bg-tertiary/20 group-hover:ring-tertiary/20'
                                                            : 'border-white bg-quaternary/30 text-quaternary opacity-50'
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <Check className="h-5 w-5" />
                                                ) : (
                                                    <span className="text-sm">{index + 1}</span>
                                                )}
                                            </div>

                                            {/* Label */}
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span
                                                    className={`whitespace-nowrap text-xs font-semibold transition-all ${
                                                        isCurrent
                                                            ? 'text-brand-700'
                                                            : isAccessible
                                                              ? 'text-secondary group-hover:text-primary'
                                                              : 'text-quaternary'
                                                    }`}
                                                >
                                                    {step.label}
                                                </span>
                                                <span
                                                    className={`hidden text-xs transition-all md:block ${
                                                        isCurrent ? 'text-brand-600' : 'text-quaternary'
                                                    }`}
                                                >
                                                    {step.description}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content area */}
                        <div className="flex-1 overflow-y-auto bg-primary px-8 py-8">
                            {renderStepContent()}
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}

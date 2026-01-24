'use client';

import React, { useState } from 'react';
import { Modal, ModalOverlay } from '@/components/application/modals/modal';
import { Button } from '@/components/base/buttons/button';
import { useResume } from '@/contexts/resume-context';
import { PersonalInfoStep } from './steps/personal-info-step';
import { ExperienceStep } from './steps/experience-step';
import { EducationStep } from './steps/education-step';
import { SkillsStep } from './steps/skills-step';
import { CustomizeStep } from './steps/customize-step';
import { PreviewStep } from './steps/preview-step';
import { OnboardingOverlay } from './onboarding-overlay';
import { Check, ChevronLeft, ChevronRight } from '@untitledui/icons';
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
            <Modal
               
                aria-label="Resume Builder Wizard"
            >
                {/* Onboarding overlay */}
                {isOnboardingEnabled && showOnboarding && (
                    <OnboardingOverlay
                        currentStep={currentStep}
                        onDismiss={() => setShowOnboarding(false)}
                    />
                )}

                {/* Header with step indicator */}
                <div>
                    <div>
                        <div>
                            <h2>
                                Create Your Resume
                            </h2>
                            <p>
                                Build an ATS-optimized resume in minutes
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                           
                            aria-label="Close"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Step indicator */}
                    <div>
                        {STEPS.map((step, index) => {
                            const isCompleted = completedSteps.includes(step.id);
                            const isCurrent = step.id === currentStep;
                            const isAccessible =
                                isCompleted || isCurrent || index <= currentStepIndex;

                            return (
                                <React.Fragment key={step.id}>
                                    <button
                                        onClick={() => isAccessible && handleStepClick(step.id)}
                                        disabled={!isAccessible}
                                        className={`group flex min-w-0 flex-1 flex-col gap-1 rounded-lg p-3 outline-focus-ring transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                            isCurrent
                                                ? 'bg-brand-50 ring-1 ring-brand-500'
                                                : isAccessible
                                                  ? 'cursor-pointer hover:bg-secondary'
                                                  : 'cursor-not-allowed opacity-40'
                                        }`}
                                    >
                                        <div>
                                            <div
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                                    isCompleted
                                                        ? 'bg-success-500 text-white'
                                                        : isCurrent
                                                          ? 'bg-brand-500 text-white'
                                                          : 'bg-secondary text-tertiary'
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <Check />
                                                ) : (
                                                    index + 1
                                                )}
                                            </div>
                                            <span
                                                className={`truncate text-sm font-medium ${
                                                    isCurrent
                                                        ? 'text-brand-700'
                                                        : isAccessible
                                                          ? 'text-secondary'
                                                          : 'text-quaternary'
                                                }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                        <p
                                            className={`hidden truncate text-xs md:block ${
                                                isCurrent ? 'text-brand-600' : 'text-quaternary'
                                            }`}
                                        >
                                            {step.description}
                                        </p>
                                    </button>
                                    {index < STEPS.length - 1 && (
                                        <div />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Content area */}
                <div>{renderStepContent()}</div>
            </Modal>
        </ModalOverlay>
    );
}

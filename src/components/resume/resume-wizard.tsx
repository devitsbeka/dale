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

                        {/* Header with step indicator */}
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

                            {/* Step indicator */}
                            <div className="flex items-stretch gap-2">
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
                                                className={`group relative flex min-w-0 flex-1 flex-col gap-2 rounded-xl border p-3 text-left outline-focus-ring transition-all focus-visible:outline-2 focus-visible:outline-offset-2 ${
                                                    isCurrent
                                                        ? 'border-brand-500 bg-brand-50 shadow-sm'
                                                        : isAccessible
                                                          ? 'border-transparent bg-secondary/50 hover:border-secondary hover:bg-secondary hover:shadow-sm cursor-pointer'
                                                          : 'border-transparent bg-secondary/30 cursor-not-allowed opacity-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                                                            isCompleted
                                                                ? 'bg-success-500 text-white'
                                                                : isCurrent
                                                                  ? 'bg-brand-600 text-white'
                                                                  : isAccessible
                                                                    ? 'bg-tertiary/10 text-tertiary'
                                                                    : 'bg-quaternary/10 text-quaternary'
                                                        }`}
                                                    >
                                                        {isCompleted ? (
                                                            <Check className="h-3.5 w-3.5" />
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`truncate text-sm font-medium transition-colors ${
                                                            isCurrent
                                                                ? 'text-brand-700'
                                                                : isAccessible
                                                                  ? 'text-secondary group-hover:text-primary'
                                                                  : 'text-quaternary'
                                                        }`}
                                                    >
                                                        {step.label}
                                                    </span>
                                                </div>
                                                <p
                                                    className={`hidden truncate text-xs transition-colors sm:block ${
                                                        isCurrent ? 'text-brand-600' : 'text-quaternary'
                                                    }`}
                                                >
                                                    {step.description}
                                                </p>
                                            </button>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content area */}
                        <div className="flex-1 overflow-y-auto bg-primary px-6 py-6">
                            {renderStepContent()}
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}

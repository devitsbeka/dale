'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResume } from '@/hooks/resume';
import { Button } from '@/components/base/buttons/button';
import { WelcomeModal } from '@/components/resume/welcome-modal';
import { TemplateGallery } from '@/components/resume/template-gallery';
import { TemplatePreviewModal } from '@/components/resume/template-preview-modal';
import { ImportModal } from '@/components/resume/import-modal';
import { ShareDialog } from '@/components/resume/share-dialog';
import { PersonalInfoStep } from '@/components/resume/steps/personal-info-step';
import { ExperienceStep } from '@/components/resume/steps/experience-step';
import { EducationStep } from '@/components/resume/steps/education-step';
import { SkillsStep } from '@/components/resume/steps/skills-step';
import { CustomizeStep } from '@/components/resume/steps/customize-step';
import { PreviewStep } from '@/components/resume/steps/preview-step';
import { ResumePreview } from '@/components/resume/resume-preview';
import {
    ChevronRight,
    ChevronLeft,
    Download03,
    Share07,
    Upload04,
    Save01,
} from '@untitledui/icons';
import type { ResumeData, WizardStep } from '@/types/resume';

const STEPS: { id: WizardStep; label: string; icon: string }[] = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'customize', label: 'Customize', icon: '🎨' },
    { id: 'preview', label: 'Preview', icon: '👁️' },
];

export function ResumeBuilderContent() {
    const router = useRouter();
    const {
        resumeData,
        currentStep,
        setCurrentStep,
        updateCustomization,
        setResumeData,
        saveNow,
        resumeId,
        isSaving,
    } = useResume();

    // Modal states
    const [showTemplatePreview, setShowTemplatePreview] = useState<string | null>(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);

    // Check for imported data
    useEffect(() => {
        const importedData = localStorage.getItem('dale_imported_resume');
        if (importedData) {
            try {
                const parsed = JSON.parse(importedData);
                setResumeData(parsed);
                localStorage.removeItem('dale_imported_resume');
                setCurrentStep('personal');
            } catch (error) {
                console.error('Failed to parse imported data:', error);
            }
        }
    }, []);

    const handleStartFromScratch = () => {
        // User chose to start from scratch, just continue
        setCurrentStep('personal');
    };

    const handleImportResume = () => {
        // User chose to import, open import modal
        setShowImportModal(true);
    };

    const handleTemplateSelect = (templateId: string) => {
        updateCustomization({ template: templateId });
    };

    const handleImportComplete = (importedData: Partial<ResumeData>) => {
        setResumeData(importedData);
        setShowImportModal(false);
        setCurrentStep('personal');
    };

    const handleSave = async () => {
        try {
            await saveNow();
        } catch (error) {
            console.error('Failed to save resume:', error);
        }
    };

    const handleExport = async (format: 'pdf' | 'docx' | 'txt' | 'json' = 'pdf') => {
        if (!resumeId) {
            alert('Please save your resume first');
            await handleSave();
            return;
        }

        try {
            const response = await fetch(`/api/resumes/${resumeId}/export`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ format }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `resume.${format}`;
                link.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Failed to export resume:', error);
        }
    };

    const getCurrentStepIndex = () =>
        STEPS.findIndex((s) => s.id === currentStep);

    const goToNextStep = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex < STEPS.length - 1) {
            setCurrentStep(STEPS[currentIndex + 1].id);
        }
    };

    const goToPreviousStep = () => {
        const currentIndex = getCurrentStepIndex();
        if (currentIndex > 0) {
            setCurrentStep(STEPS[currentIndex - 1].id);
        }
    };

    return (
        <>
            <div className="flex h-screen overflow-hidden bg-primary">
                {/* Left Panel - Form */}
                <div className="flex w-[700px] flex-col border-r border-secondary">
                    {/* Header */}
                    <div className="border-b border-secondary bg-primary px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-primary">
                                    Resume Builder
                                </h1>
                                <p className="mt-1 text-sm text-tertiary">
                                    Create your professional ATS-ready resume
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    color="link-gray"
                                    size="sm"
                                    onClick={() => setShowImportModal(true)}
                                    iconLeading={Upload04}
                                >
                                    Import
                                </Button>
                                <Button
                                    color="secondary"
                                    size="sm"
                                    onClick={handleSave}
                                    isDisabled={isSaving}
                                    iconLeading={Save01}
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="border-b border-secondary bg-secondary/10 px-8 py-4">
                        <div className="flex gap-2 overflow-x-auto">
                            {STEPS.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStep(step.id)}
                                    className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                                        currentStep === step.id
                                            ? 'bg-brand-600 text-white'
                                            : 'bg-secondary/50 text-secondary hover:bg-secondary'
                                    }`}
                                >
                                    <span className="text-sm">{step.icon}</span>
                                    <span className="text-sm font-medium">{step.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-6">
                        {currentStep === 'personal' && (
                            <PersonalInfoStep onNext={goToNextStep} />
                        )}

                        {currentStep === 'experience' && (
                            <ExperienceStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
                        )}

                        {currentStep === 'education' && (
                            <EducationStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
                        )}

                        {currentStep === 'skills' && (
                            <SkillsStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
                        )}

                        {currentStep === 'customize' && (
                            <CustomizeStep onNext={goToNextStep} onPrevious={goToPreviousStep} />
                        )}

                        {currentStep === 'preview' && (
                            <PreviewStep
                                onPrevious={goToPreviousStep}
                                onClose={() => router.push('/resumes')}
                            />
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between border-t border-secondary bg-primary px-8 py-6">
                        <Button
                            color="secondary"
                            onClick={goToPreviousStep}
                            isDisabled={currentStep === 'personal'}
                            iconLeading={ChevronLeft}
                        >
                            Previous
                        </Button>
                        <div className="flex gap-2">
                            {currentStep === 'preview' ? (
                                <>
                                    <Button
                                        color="secondary"
                                        onClick={() => handleExport('pdf')}
                                        iconLeading={Download03}
                                    >
                                        Export PDF
                                    </Button>
                                    <Button
                                        color="primary"
                                        onClick={() => setShowShareDialog(true)}
                                        iconLeading={Share07}
                                    >
                                        Share
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    color="primary"
                                    onClick={goToNextStep}
                                    iconTrailing={ChevronRight}
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Live Preview */}
                <div className="flex flex-1 flex-col bg-secondary/30">
                    <div className="border-b border-secondary bg-primary px-8 py-4">
                        <h2 className="text-sm font-semibold text-primary">Live Preview</h2>
                        <p className="text-xs text-tertiary">See your resume in real-time</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="mx-auto max-w-[800px]">
                            <ResumePreview data={resumeData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <WelcomeModal
                onStartFromScratch={handleStartFromScratch}
                onImportResume={handleImportResume}
            />

            {showTemplatePreview && (
                <TemplatePreviewModal
                    templateId={showTemplatePreview}
                    isOpen={true}
                    onClose={() => setShowTemplatePreview(null)}
                    onUseTemplate={(id) => {
                        handleTemplateSelect(id);
                        setShowTemplatePreview(null);
                        setCurrentStep('personal');
                    }}
                />
            )}

            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImportComplete={handleImportComplete}
            />

            {resumeId && showShareDialog && (
                <ShareDialog
                    resumeId={resumeId}
                    onClose={() => setShowShareDialog(false)}
                />
            )}
        </>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResume } from '@/contexts/resume-context';
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
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'customize', label: 'Customize', icon: '🎨' },
    { id: 'preview', label: 'Preview', icon: '👁️' },
];

// Dummy data for beautiful preview
const SAMPLE_DATA: Partial<ResumeData> = {
    personalInfo: {
        firstName: 'Ronald',
        lastName: 'Dump',
        email: 'ronald.dump@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        linkedin: 'linkedin.com/in/ronalddump',
        website: 'ronalddump.com',
        summary:
            'Visionary entrepreneur and business magnate with 40+ years of experience in real estate development, hospitality, and entertainment. Known for ambitious projects and transformative leadership.',
    },
    experience: [
        {
            id: '1',
            company: 'Dump Organization',
            position: 'Chairman & CEO',
            location: 'New York, NY',
            startDate: '1971-01',
            endDate: '',
            current: true,
            achievements: [
                'Built multinational conglomerate with holdings in real estate, hospitality, entertainment, and media',
                'Developed iconic properties including Dump Tower, Dump World Tower, and luxury golf courses worldwide',
                'Expanded brand into successful ventures in television, gaming, and consumer products',
                'Negotiated billions in commercial real estate transactions across major metropolitan areas',
            ],
        },
        {
            id: '2',
            company: 'The Apprentice',
            position: 'Executive Producer & Host',
            location: 'New York, NY',
            startDate: '2004-01',
            endDate: '2015-01',
            current: false,
            achievements: [
                'Created and hosted Emmy-nominated reality TV show reaching 20+ million viewers',
                'Produced 14 seasons featuring business challenges and entrepreneurial mentorship',
                'Transformed into cultural phenomenon generating $200M+ in revenue',
            ],
        },
        {
            id: '3',
            company: 'Dump Entertainment Resorts',
            position: 'Founder & President',
            location: 'Atlantic City, NJ',
            startDate: '1984-01',
            endDate: '2009-01',
            current: false,
            achievements: [
                'Founded and operated three major casino hotels in Atlantic City',
                'Created integrated resort properties combining gaming, entertainment, and hospitality',
                'Developed innovative marketing strategies that increased property visibility',
            ],
        },
    ],
    education: [
        {
            id: '1',
            school: 'Wharton School, University of Pennsylvania',
            degree: 'Bachelor of Science',
            field: 'Economics',
            location: 'Philadelphia, PA',
            startDate: '1966',
            endDate: '1968',
            gpa: '3.8',
        },
        {
            id: '2',
            school: 'Fordham University',
            degree: 'Undergraduate Studies',
            field: 'Business',
            location: 'Bronx, NY',
            startDate: '1964',
            endDate: '1966',
            gpa: '',
        },
    ],
    skills: [
        { id: '1', name: 'Real Estate Development', category: 'technical' },
        { id: '2', name: 'Negotiation & Deal-Making', category: 'technical' },
        { id: '3', name: 'Brand Building & Marketing', category: 'technical' },
        { id: '4', name: 'Strategic Planning', category: 'technical' },
        { id: '5', name: 'Public Speaking', category: 'soft' },
        { id: '6', name: 'Media Relations', category: 'soft' },
        { id: '7', name: 'Leadership & Management', category: 'soft' },
        { id: '8', name: 'Financial Analysis', category: 'technical' },
    ],
    customization: {
        template: 'modern',
        primaryColor: '#2563EB',
        font: 'Inter',
        sectionOrder: ['experience', 'education', 'skills'],
    },
};

export function ResumeBuilderContent() {
    const router = useRouter();
    const {
        resumeData,
        currentStep,
        setCurrentStep,
        updateCustomization,
        setResumeData,
        resumeId,
        createResume,
        saveNow,
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
    }, [setResumeData, setCurrentStep]);

    const handleStartFromScratch = () => {
        setCurrentStep('personal');
    };

    const handleImportResume = () => {
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
            if (!resumeId) {
                // Create new resume if it doesn't exist
                const newResume = await createResume(resumeData);
                // Show success message
                alert('Resume saved successfully!');
            } else {
                // Update existing resume
                await saveNow();
                alert('Resume updated successfully!');
            }
        } catch (error) {
            console.error('Failed to save resume:', error);
            alert('Failed to save resume. Please try again.');
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

    // Use sample data if resume is empty, otherwise use actual data
    // Always use user's customization if they've set it
    const hasData = resumeData.personalInfo?.firstName || resumeData.experience?.length;
    const previewData = hasData
        ? resumeData
        : {
            ...SAMPLE_DATA,
            customization: resumeData.customization || SAMPLE_DATA.customization,
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
                            <div className="flex items-center gap-2">
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
                        <div className="flex gap-2">
                            {STEPS.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStep(step.id)}
                                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                                        currentStep === step.id
                                            ? 'bg-primary text-primary shadow-sm ring-2 ring-brand-200'
                                            : 'bg-transparent text-secondary hover:bg-secondary/50'
                                    }`}
                                >
                                    <span className="text-sm">{step.icon}</span>
                                    <span className="text-sm font-medium whitespace-nowrap">{step.label}</span>
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
                <div className="flex flex-1 flex-col bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="border-b border-secondary bg-white/80 backdrop-blur-sm px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-primary">Live Preview</h2>
                                <p className="text-sm text-tertiary">See your resume in real-time</p>
                            </div>
                            {!hasData && (
                                <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                                    Sample Preview
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="mx-auto max-w-[800px]">
                            <div className="rounded-lg bg-white shadow-2xl ring-1 ring-gray-200">
                                <ResumePreview data={previewData} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals - only render when needed */}
            {/* TEMPORARILY DISABLED - WelcomeModal was blocking all interactions
            <WelcomeModal
                onStartFromScratch={handleStartFromScratch}
                onImportResume={handleImportResume}
            />
            */}

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

            {showImportModal && (
                <ImportModal
                    isOpen={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onImportComplete={handleImportComplete}
                />
            )}

            {resumeId && showShareDialog && (
                <ShareDialog
                    resumeId={resumeId}
                    onClose={() => setShowShareDialog(false)}
                />
            )}
        </>
    );
}

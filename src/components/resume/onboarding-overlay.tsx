'use client';

import React from 'react';
import { Button } from '@/components/base/button';
import { useResume } from '@/contexts/resume-context';
import { X, Lightbulb01 } from '@untitledui/icons/react';
import type { WizardStep } from '@/types/resume';

interface OnboardingOverlayProps {
    currentStep: WizardStep;
    onDismiss: () => void;
}

const ONBOARDING_MESSAGES: Record<WizardStep, { title: string; message: string; tip: string }> = {
    personal: {
        title: 'Welcome to Resume Builder! 👋',
        message:
            "Let's create your perfect resume together. Start by filling in your personal information.",
        tip: 'Tip: Use a professional email address and include links to your LinkedIn or portfolio.',
    },
    experience: {
        title: 'Showcase Your Experience',
        message:
            'Add your work history starting with your most recent position. Focus on achievements, not just responsibilities.',
        tip: 'Tip: Use action verbs (Led, Developed, Managed) and quantify your impact with numbers when possible.',
    },
    education: {
        title: 'Add Your Education',
        message:
            'Include your degrees, certifications, and relevant coursework. GPA is optional but recommended if above 3.5.',
        tip: 'Tip: List your most recent or highest degree first.',
    },
    skills: {
        title: 'Highlight Your Skills',
        message:
            'Add both technical and soft skills. Use our suggested skills or add custom ones that match the job description.',
        tip: 'Tip: Organize skills by category to make them easier to scan.',
    },
    customize: {
        title: 'Make It Yours',
        message:
            'Choose a template and color scheme that reflects your professional style while staying ATS-friendly.',
        tip: 'Tip: Stick with professional colors and clean templates for maximum compatibility.',
    },
    preview: {
        title: 'Almost Done!',
        message:
            'Review your resume and export it as a PDF when ready. You can always come back and edit later.',
        tip: 'Tip: Proofread carefully before exporting. Have someone else review it too!',
    },
};

export function OnboardingOverlay({ currentStep, onDismiss }: OnboardingOverlayProps) {
    const { toggleOnboarding } = useResume();
    const content = ONBOARDING_MESSAGES[currentStep];

    const handleDontShowAgain = () => {
        toggleOnboarding();
        onDismiss();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-gray-900/20 p-4 pt-20 backdrop-blur-sm">
            <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-xl border border-secondary bg-white p-6 shadow-2xl">
                <button
                    onClick={onDismiss}
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-tertiary outline-focus-ring transition hover:bg-secondary hover:text-primary"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                    <Lightbulb01 className="h-6 w-6 text-brand-600" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-primary">{content.title}</h3>
                <p className="mb-4 text-sm text-secondary">{content.message}</p>

                <div className="mb-6 rounded-lg bg-brand-50 p-3">
                    <p className="text-sm font-medium text-brand-900">{content.tip}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <Button variant="primary" size="md" onClick={onDismiss} className="w-full">
                        Got it, thanks!
                    </Button>
                    <Button
                        variant="link"
                        size="sm"
                        onClick={handleDontShowAgain}
                        className="text-tertiary"
                    >
                        Don't show these tips again
                    </Button>
                </div>
            </div>
        </div>
    );
}

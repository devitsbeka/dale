'use client';

import React from 'react';
import { Button } from '@/components/base/buttons/button';
import { useResume } from '@/contexts/resume-context';
import { X, Lightbulb01 } from '@untitledui/icons';
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
        <div>
            <div>
                <button
                    onClick={onDismiss}
                   
                    aria-label="Close"
                >
                    <X />
                </button>

                <div>
                    <Lightbulb01 />
                </div>

                <h3>{content.title}</h3>
                <p>{content.message}</p>

                <div>
                    <p>{content.tip}</p>
                </div>

                <div>
                    <Button color="primary" size="md" onClick={onDismiss}>
                        Got it, thanks!
                    </Button>
                    <Button
                        color="link-gray"
                        size="sm"
                        onClick={handleDontShowAgain}
                    >
                        Don't show these tips again
                    </Button>
                </div>
            </div>
        </div>
    );
}

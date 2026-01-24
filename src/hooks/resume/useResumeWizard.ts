import { useState, useCallback, useEffect } from 'react';
import type { WizardStep } from '@/types/resume';

const ONBOARDING_KEY = 'dale_resume_onboarding_disabled';

export function useResumeWizard() {
    const [currentStep, setCurrentStep] = useState<WizardStep>('personal');
    const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
    const [isOnboardingEnabled, setIsOnboardingEnabled] = useState(true);

    // Load onboarding preference
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const onboardingDisabled = localStorage.getItem(ONBOARDING_KEY);
        if (onboardingDisabled === 'true') {
            setIsOnboardingEnabled(false);
        }
    }, []);

    const markStepComplete = useCallback((step: WizardStep) => {
        setCompletedSteps((prev) => {
            if (prev.includes(step)) return prev;
            return [...prev, step];
        });
    }, []);

    const toggleOnboarding = useCallback(() => {
        setIsOnboardingEnabled((prev) => {
            const newValue = !prev;
            localStorage.setItem(ONBOARDING_KEY, String(!newValue));
            return newValue;
        });
    }, []);

    const resetWizard = useCallback(() => {
        setCurrentStep('personal');
        setCompletedSteps([]);
    }, []);

    return {
        currentStep,
        setCurrentStep,
        completedSteps,
        markStepComplete,
        isOnboardingEnabled,
        toggleOnboarding,
        resetWizard,
    };
}

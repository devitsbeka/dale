import { useResumeData } from './useResumeData';
import { useResumeActions } from './useResumeActions';
import { useResumeWizard } from './useResumeWizard';
import { useResumeAutosave } from './useResumeAutosave';

/**
 * Unified hook that combines all resume-related functionality
 *
 * @example
 * ```tsx
 * const resume = useResume();
 *
 * // Update personal info
 * resume.updatePersonalInfo({ firstName: 'John' });
 *
 * // Navigate wizard
 * resume.setCurrentStep('experience');
 *
 * // Load existing resume
 * await resume.fetchResume('resume-id');
 *
 * // Check auto-save status
 * if (resume.isSaving) {
 *   console.log('Saving...');
 * }
 * ```
 */
export function useResume() {
    const data = useResumeData();
    const actions = useResumeActions();
    const wizard = useResumeWizard();
    const autosave = useResumeAutosave(data.resumeData, data.resumeId);

    return {
        // Data state
        resumeData: data.resumeData,
        resumeId: data.resumeId,
        setResumeData: data.setResumeData,
        setResumeId: data.setResumeId,

        // Data mutations
        updatePersonalInfo: data.updatePersonalInfo,
        addExperience: data.addExperience,
        updateExperience: data.updateExperience,
        removeExperience: data.removeExperience,
        addEducation: data.addEducation,
        updateEducation: data.updateEducation,
        removeEducation: data.removeEducation,
        addSkill: data.addSkill,
        removeSkill: data.removeSkill,
        updateCustomization: data.updateCustomization,
        resetData: data.resetData,

        // API actions
        isLoading: actions.isLoading,
        error: actions.error,
        createResume: actions.createResume,
        fetchResume: actions.fetchResume,
        updateResume: actions.updateResume,
        deleteResume: actions.deleteResume,
        listResumes: actions.listResumes,

        // Wizard state
        currentStep: wizard.currentStep,
        setCurrentStep: wizard.setCurrentStep,
        completedSteps: wizard.completedSteps,
        markStepComplete: wizard.markStepComplete,
        isOnboardingEnabled: wizard.isOnboardingEnabled,
        toggleOnboarding: wizard.toggleOnboarding,
        resetWizard: wizard.resetWizard,

        // Auto-save
        isSaving: autosave.isSaving,
        lastSaved: autosave.lastSaved,
        saveError: autosave.saveError,
        saveNow: autosave.saveNow,
    };
}

// Export individual hooks for advanced use cases
export { useResumeData } from './useResumeData';
export { useResumeActions } from './useResumeActions';
export { useResumeWizard } from './useResumeWizard';
export { useResumeAutosave } from './useResumeAutosave';

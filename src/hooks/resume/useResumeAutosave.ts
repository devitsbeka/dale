import { useEffect, useRef, useState, useCallback } from 'react';
import type { ResumeData } from '@/types/resume';

const AUTOSAVE_DELAY = 1500; // 1.5 seconds
const STORAGE_KEY = 'dale_resume_data';

export function useResumeAutosave(resumeData: Partial<ResumeData>, resumeId: string | null) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    // Auto-save to API (when resumeId exists) or localStorage (fallback)
    useEffect(() => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for debounced save
        timeoutRef.current = setTimeout(async () => {
            try {
                setIsSaving(true);
                setSaveError(null);

                if (resumeId) {
                    // Save to API
                    const response = await fetch(`/api/resumes/${resumeId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(resumeData),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to auto-save resume');
                    }

                    setLastSaved(new Date());
                } else {
                    // Save to localStorage as fallback
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
                    setLastSaved(new Date());
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Auto-save failed';
                setSaveError(message);
                console.error('Auto-save error:', err);
            } finally {
                setIsSaving(false);
            }
        }, AUTOSAVE_DELAY);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [resumeData, resumeId]);

    // Manual save function
    const saveNow = useCallback(async () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        try {
            setIsSaving(true);
            setSaveError(null);

            if (resumeId) {
                const response = await fetch(`/api/resumes/${resumeId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(resumeData),
                });

                if (!response.ok) {
                    throw new Error('Failed to save resume');
                }

                setLastSaved(new Date());
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
                setLastSaved(new Date());
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Save failed';
            setSaveError(message);
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, [resumeData, resumeId]);

    return {
        isSaving,
        lastSaved,
        saveError,
        saveNow,
    };
}

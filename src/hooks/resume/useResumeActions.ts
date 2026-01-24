import { useCallback, useState } from 'react';
import type { ResumeData } from '@/types/resume';

export function useResumeActions() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createResume = useCallback(async (name?: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/resumes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name || 'Untitled Resume' }),
            });

            if (!response.ok) {
                throw new Error('Failed to create resume');
            }

            const resume = await response.json();
            return resume;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchResume = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/resumes/${id}`);

            if (!response.ok) {
                throw new Error('Failed to fetch resume');
            }

            const resume = await response.json();
            return resume;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateResume = useCallback(async (id: string, data: Partial<ResumeData>) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/resumes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update resume');
            }

            const resume = await response.json();
            return resume;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteResume = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/resumes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete resume');
            }

            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const listResumes = useCallback(async (page = 1, limit = 10) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/resumes?page=${page}&limit=${limit}`);

            if (!response.ok) {
                throw new Error('Failed to fetch resumes');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An error occurred';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        createResume,
        fetchResume,
        updateResume,
        deleteResume,
        listResumes,
    };
}

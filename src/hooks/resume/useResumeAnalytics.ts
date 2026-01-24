import { useState, useEffect } from 'react';

export interface AnalyticsStats {
    total: number;
    byType: Record<string, number>;
    recent: Array<{
        id: string;
        eventType: string;
        metadata: string | null;
        timestamp: string;
    }>;
    timeline: Array<{
        date: string;
        view?: number;
        export?: number;
        share?: number;
        edit?: number;
        restore?: number;
        total: number;
    }>;
}

export function useResumeAnalytics(resumeId: string | null, days: number = 30) {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch analytics data
    useEffect(() => {
        if (!resumeId) {
            setIsLoading(false);
            return;
        }

        const fetchAnalytics = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/resumes/${resumeId}/analytics?days=${days}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch analytics');
                }

                const data = await response.json();
                setStats(data.stats);
                setError(null);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [resumeId, days]);

    // Track an event
    const trackEvent = async (eventType: string, metadata?: any) => {
        if (!resumeId) return;

        try {
            await fetch(`/api/resumes/${resumeId}/analytics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventType, metadata }),
            });
        } catch (err) {
            console.error('Error tracking event:', err);
        }
    };

    return { stats, isLoading, error, trackEvent };
}

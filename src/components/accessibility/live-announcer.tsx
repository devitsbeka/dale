'use client';

import { useEffect, useState } from 'react';

/**
 * Live Announcer component for screen reader announcements
 * Uses ARIA live regions to announce dynamic content changes
 * WCAG 2.1 Success Criterion 4.1.3 (Status Messages)
 */

interface LiveAnnouncerProps {
    message: string;
    politeness?: 'polite' | 'assertive';
    clearDelay?: number;
}

export function LiveAnnouncer({
    message,
    politeness = 'polite',
    clearDelay = 3000
}: LiveAnnouncerProps) {
    const [announcement, setAnnouncement] = useState('');

    useEffect(() => {
        if (message) {
            setAnnouncement(message);

            if (clearDelay > 0) {
                const timer = setTimeout(() => {
                    setAnnouncement('');
                }, clearDelay);

                return () => clearTimeout(timer);
            }
        }
    }, [message, clearDelay]);

    return (
        <div
            role="status"
            aria-live={politeness}
            aria-atomic="true"
            className="sr-only"
        >
            {announcement}
        </div>
    );
}

/**
 * Hook for managing announcements
 */
export function useAnnouncer() {
    const [message, setMessage] = useState('');

    const announce = (text: string) => {
        setMessage(text);
    };

    return { message, announce };
}

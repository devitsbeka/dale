import { useEffect, useRef } from 'react';

/**
 * Focus trap hook for modal dialogs
 * Traps keyboard focus within a container element
 * WCAG 2.1 Success Criterion 2.4.3 (Focus Order)
 */
export function useFocusTrap<T extends HTMLElement>(isActive: boolean = true) {
    const containerRef = useRef<T>(null);
    const previouslyFocusedElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isActive || !containerRef.current) return;

        const container = containerRef.current;

        // Store the currently focused element to restore later
        previouslyFocusedElement.current = document.activeElement as HTMLElement;

        // Get all focusable elements
        const getFocusableElements = (): HTMLElement[] => {
            const selector = [
                'a[href]',
                'button:not([disabled])',
                'textarea:not([disabled])',
                'input:not([disabled])',
                'select:not([disabled])',
                '[tabindex]:not([tabindex="-1"])',
            ].join(', ');

            return Array.from(container.querySelectorAll(selector));
        };

        // Focus first element
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        // Handle Tab and Shift+Tab
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            const focusable = getFocusableElements();
            if (focusable.length === 0) return;

            const firstElement = focusable[0];
            const lastElement = focusable[focusable.length - 1];

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        container.addEventListener('keydown', handleKeyDown);

        // Cleanup: restore focus and remove listener
        return () => {
            container.removeEventListener('keydown', handleKeyDown);

            if (previouslyFocusedElement.current) {
                previouslyFocusedElement.current.focus();
            }
        };
    }, [isActive]);

    return containerRef;
}

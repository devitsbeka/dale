'use client';

/**
 * Skip Link component for keyboard navigation
 * Allows users to skip repetitive navigation and jump to main content
 * WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks)
 */
export function SkipLink() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-hidden focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
        >
            Skip to main content
        </a>
    );
}

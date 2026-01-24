/**
 * Spinner Loading Indicator
 * Animated spinner for loading states
 */

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    label?: string;
}

export function Spinner({ size = 'md', className = '', label }: SpinnerProps) {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`animate-spin rounded-full border-brand-500 border-t-transparent ${sizes[size]} ${className}`}
                role="status"
                aria-label={label || 'Loading'}
            >
                <span className="sr-only">{label || 'Loading...'}</span>
            </div>
            {label && (
                <p className="text-sm text-tertiary">{label}</p>
            )}
        </div>
    );
}

/**
 * Full-screen loading spinner
 */
export function FullPageSpinner({ label }: { label?: string }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-primary">
            <Spinner size="lg" label={label} />
        </div>
    );
}

/**
 * Inline loading spinner (for buttons, etc.)
 */
export function InlineSpinner({ className = '' }: { className?: string }) {
    return (
        <div
            className={`h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/base/buttons/button';
import { AlertCircle, RefreshCw01 } from '@untitledui/icons';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components
 * WCAG: Provides graceful error recovery
 */

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        console.error('Error caught by boundary:', error, errorInfo);

        // Call optional error handler
        this.props.onError?.(error, errorInfo);

        // In production, you would send this to error monitoring service
        // e.g., Sentry.captureException(error, { extra: errorInfo });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex min-h-[400px] items-center justify-center p-8">
                    <div className="w-full max-w-md text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error-50">
                            <AlertCircle className="h-8 w-8 text-error-600" />
                        </div>

                        <h2 className="mt-6 text-xl font-semibold text-primary">
                            Something went wrong
                        </h2>

                        <p className="mt-2 text-sm text-tertiary">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-4 rounded-lg border border-secondary bg-secondary/10 p-4 text-left">
                                <summary className="cursor-pointer text-sm font-medium text-secondary">
                                    Error Details
                                </summary>
                                <pre className="mt-2 overflow-auto text-xs text-tertiary">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}

                        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                            <Button
                                color="primary"
                                onClick={this.handleReset}
                                iconLeading={RefreshCw01}
                            >
                                Try Again
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => window.location.reload()}
                            >
                                Reload Page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Hook-based error boundary (for functional components)
 * Note: This doesn't catch errors in event handlers or async code
 */
export function useErrorHandler() {
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    return setError;
}

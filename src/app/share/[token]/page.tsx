'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ResumePreview } from '@/components/resume/resume-preview';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Label } from '@/components/base/input/label';
import { Lock01, AlertCircle } from '@untitledui/icons';
import type { ResumeData } from '@/types/resume';

export default function SharePage() {
    const params = useParams();
    const token = params.token as string;

    const [isLoading, setIsLoading] = useState(true);
    const [resumeData, setResumeData] = useState<Partial<ResumeData> | null>(null);
    const [requiresPassword, setRequiresPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        fetchSharedResume();
    }, [token]);

    const fetchSharedResume = async (pwd?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/share/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pwd }),
            });

            const data = await response.json();

            if (response.status === 401) {
                setRequiresPassword(true);
                setError(pwd ? 'Incorrect password' : null);
                return;
            }

            if (response.status === 410) {
                setIsExpired(true);
                setError(data.error);
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch resume');
            }

            setResumeData(data.resumeData);
            setRequiresPassword(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load resume');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSharedResume(password);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-primary">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                    <p className="mt-4 text-sm text-tertiary">Loading resume...</p>
                </div>
            </div>
        );
    }

    if (isExpired) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-primary px-4">
                <div className="w-full max-w-md text-center">
                    <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
                    <h1 className="mt-4 text-2xl font-bold text-primary">Link Expired</h1>
                    <p className="mt-2 text-sm text-tertiary">{error}</p>
                </div>
            </div>
        );
    }

    if (requiresPassword && !resumeData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-primary px-4">
                <div className="w-full max-w-md">
                    <div className="rounded-lg border border-secondary bg-primary p-8 shadow-lg">
                        <div className="mb-6 text-center">
                            <Lock01 className="mx-auto h-12 w-12 text-secondary" />
                            <h1 className="mt-4 text-2xl font-bold text-primary">
                                Password Required
                            </h1>
                            <p className="mt-2 text-sm text-tertiary">
                                This resume is password protected
                            </p>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <Label>Password</Label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={setPassword}
                                    placeholder="Enter password"
                                    isRequired
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                color="primary"
                                size="lg"
                                className="w-full"
                            >
                                View Resume
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (!resumeData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-primary px-4">
                <div className="w-full max-w-md text-center">
                    <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
                    <h1 className="mt-4 text-2xl font-bold text-primary">Resume Not Found</h1>
                    <p className="mt-2 text-sm text-tertiary">
                        This share link is invalid or has been removed.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/10 py-12">
            <div className="mx-auto max-w-4xl px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-primary">
                        {resumeData.personalInfo?.firstName} {resumeData.personalInfo?.lastName}'s Resume
                    </h1>
                    <p className="mt-2 text-sm text-tertiary">
                        Shared via planeta.id Resume Builder
                    </p>
                </div>

                {/* Resume Preview */}
                <div className="rounded-lg border border-secondary bg-primary p-8 shadow-lg">
                    <ResumePreview data={resumeData} />
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-tertiary">
                    <p>
                        Create your own professional resume at{' '}
                        <a href="/" className="text-brand-500 hover:underline">
                            dale-eta.vercel.app
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

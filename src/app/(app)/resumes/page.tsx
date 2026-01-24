'use client';

import { Button } from '@/components/base/buttons/button';
import { Plus, FilePlus02, FileCheck02, Calendar } from '@untitledui/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Resume {
    id: string;
    name: string;
    updatedAt: string;
    status: string;
}

export default function ResumesPage() {
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/resumes');
            if (response.ok) {
                const data = await response.json();
                // API returns { resumes, pagination }
                setResumes(data.resumes || data);
            }
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNew = () => {
        router.push('/resumes/new');
    };

    const handleOpenResume = (id: string) => {
        router.push(`/resumes/new?id=${id}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="flex min-h-screen flex-col bg-primary">
            {/* Header */}
            <div className="border-b border-secondary bg-primary">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-primary">My Resumes</h1>
                            <p className="mt-2 text-sm text-tertiary">
                                Create and manage your professional resumes
                            </p>
                        </div>
                        <Button
                            color="primary"
                            size="lg"
                            onClick={handleCreateNew}
                            iconLeading={Plus}
                        >
                            Create New Resume
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse rounded-xl border border-secondary bg-primary p-6"
                            >
                                <div className="h-6 w-3/4 rounded bg-secondary"></div>
                                <div className="mt-4 h-4 w-1/2 rounded bg-secondary"></div>
                                <div className="mt-6 h-10 rounded bg-secondary"></div>
                            </div>
                        ))}
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-secondary bg-primary">
                        <div className="text-center">
                            <FilePlus02 className="mx-auto h-12 w-12 text-tertiary" />
                            <h3 className="mt-4 text-lg font-semibold text-primary">
                                No resumes yet
                            </h3>
                            <p className="mt-2 text-sm text-tertiary">
                                Get started by creating your first resume
                            </p>
                            <Button
                                color="primary"
                                size="lg"
                                onClick={handleCreateNew}
                                iconLeading={Plus}
                                className="mt-6"
                            >
                                Create New Resume
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="group cursor-pointer rounded-xl border border-secondary bg-primary p-6 transition-all hover:border-brand-500 hover:shadow-md"
                                onClick={() => handleOpenResume(resume.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-lg font-semibold text-primary">
                                            {resume.name}
                                        </h3>
                                        <div className="mt-2 flex items-center gap-2 text-sm text-tertiary">
                                            <Calendar className="h-4 w-4" />
                                            <span>Updated {formatDate(resume.updatedAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {resume.status === 'draft' ? (
                                            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                                                Draft
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                Complete
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            handleOpenResume(resume.id);
                                        }}
                                        iconLeading={FileCheck02}
                                        className="flex-1"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color="link-gray"
                                        size="sm"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            // TODO: Implement preview
                                        }}
                                        className="flex-1"
                                    >
                                        Preview
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

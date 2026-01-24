'use client';

import React from 'react';
import type { ResumeData } from '@/types/resume';
import { TemplateRenderer } from '@/lib/template-engine/template-renderer';

interface ResumePreviewProps {
    data: Partial<ResumeData>;
}

export function ResumePreview({ data }: ResumePreviewProps) {
    const { personalInfo, customization } = data;
    const templateId = customization?.template || 'modern';

    // Show empty state if no personal info yet
    if (!personalInfo?.firstName && !personalInfo?.lastName) {
        return (
            <div className="mx-auto aspect-[8.5/11] w-full overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-gray-200">
                <div className="flex h-full items-center justify-center p-12">
                    <div className="text-center">
                        <svg
                            className="mx-auto h-16 w-16 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">
                            Your resume will appear here
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Start filling out the form to see your resume take shape
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full overflow-hidden rounded-lg shadow-2xl ring-1 ring-gray-200">
            <div className="overflow-y-auto" style={{ maxHeight: '11in' }}>
                <TemplateRenderer templateId={templateId} data={data} />
            </div>
        </div>
    );
}

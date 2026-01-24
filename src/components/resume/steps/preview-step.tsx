'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/base/buttons/button';
import { useResume } from '@/contexts/resume-context';
import { ChevronLeft, Download03, FileCheck02 } from '@untitledui/icons';
import { ResumePreview } from '../resume-preview';

interface PreviewStepProps {
    onPrevious: () => void;
    onClose: () => void;
}

export function PreviewStep({ onPrevious, onClose }: PreviewStepProps) {
    const { resumeData, markStepComplete } = useResume();
    const previewRef = useRef<HTMLDivElement>(null);

    const handleExportPDF = async () => {
        markStepComplete('preview');

        // Use browser's print functionality for now
        // In production, you'd use a library like jsPDF or react-pdf
        const printWindow = window.open('', '_blank');
        if (printWindow && previewRef.current) {
            const content = previewRef.current.innerHTML;
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Resume - ${resumeData.personalInfo?.firstName} ${resumeData.personalInfo?.lastName}</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: Inter, sans-serif; line-height: 1.5; }
                        @media print {
                            body { margin: 0; }
                            @page { margin: 0.5in; }
                        }
                    </style>
                </head>
                <body>${content}</body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleDownloadJSON = () => {
        const dataStr = JSON.stringify(resumeData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `resume_${resumeData.personalInfo?.firstName}_${resumeData.personalInfo?.lastName}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-primary">Preview & Export</h3>
                    <p className="mt-1 text-sm text-tertiary">
                        Review your resume and export when ready.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        color="secondary"
                        size="md"
                        onClick={handleDownloadJSON}
                        iconLeading={FileCheck02}
                    >
                        Save Draft
                    </Button>
                    <Button
                        color="primary"
                        size="md"
                        onClick={handleExportPDF}
                        iconLeading={Download03}
                    >
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* ATS Tips */}
            <div className="rounded-lg border border-secondary bg-secondary/10 p-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                    <FileCheck02 className="h-4 w-4" />
                    ATS-Optimized Resume
                </h4>
                <ul className="space-y-2 text-sm text-tertiary">
                    <li>✓ Clean formatting with no graphics</li>
                    <li>✓ Standard section headings</li>
                    <li>✓ Keyword-rich content</li>
                    <li>✓ Professional fonts and spacing</li>
                </ul>
            </div>

            {/* Preview */}
            <div className="rounded-lg border border-secondary bg-primary p-6">
                <div ref={previewRef}>
                    <ResumePreview data={resumeData} />
                </div>
            </div>

            <div className="flex justify-between border-t border-secondary pt-6">
                <Button color="link-gray" size="lg" onClick={onPrevious} iconLeading={ChevronLeft}>
                    Back to Customize
                </Button>
                <Button color="primary" size="lg" onClick={onClose}>
                    Done
                </Button>
            </div>
        </div>
    );
}

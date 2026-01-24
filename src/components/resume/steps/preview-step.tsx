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
        <div>
            <div>
                <div>
                    <h3>Preview & Export</h3>
                    <p>
                        Review your resume and export when ready.
                    </p>
                </div>
                <div>
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
            <div>
                <h4>
                    <FileCheck02 />
                    ATS-Optimized Resume
                </h4>
                <ul>
                    <li>✓ Clean formatting with no graphics</li>
                    <li>✓ Standard section headings</li>
                    <li>✓ Keyword-rich content</li>
                    <li>✓ Professional fonts and spacing</li>
                </ul>
            </div>

            {/* Preview */}
            <div>
                <div ref={previewRef}>
                    <ResumePreview data={resumeData} />
                </div>
            </div>

            <div>
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

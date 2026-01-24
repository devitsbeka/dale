'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/base/buttons/button';
import { useResume } from '@/contexts/resume-context';
import { ChevronLeft, Download03, FileCheck02 } from '@untitledui/icons';
import { ResumePreview } from '../resume-preview';
import { ATSScorePanel } from '../ats-score-panel';
import { KeywordAnalyzerPanel } from '../keyword-analyzer-panel';
import { analyzeATSCompatibility, type ATSAnalysisResult } from '@/lib/ats/analyzer';

interface PreviewStepProps {
    onPrevious: () => void;
    onClose: () => void;
}

export function PreviewStep({ onPrevious, onClose }: PreviewStepProps) {
    const { resumeData, markStepComplete } = useResume();
    const previewRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysisResult | null>(null);

    // Calculate ATS score only on client to avoid hydration issues
    useEffect(() => {
        setIsMounted(true);
        setAtsAnalysis(analyzeATSCompatibility(resumeData));
    }, [resumeData]);

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

            {/* ATS Analysis - only render after mount to avoid hydration issues */}
            {isMounted && atsAnalysis && <ATSScorePanel analysis={atsAnalysis} />}

            {/* Keyword Analyzer */}
            {isMounted && <KeywordAnalyzerPanel resumeData={resumeData} />}

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

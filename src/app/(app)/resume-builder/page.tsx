'use client';

import React from 'react';
import { ResumeProvider } from '@/contexts/resume-context';
import { ResumeBuilderContent } from '@/components/resume/resume-builder-content';

export default function ResumeBuilderPage() {
    return (
        <ResumeProvider>
            <ResumeBuilderContent />
        </ResumeProvider>
    );
}

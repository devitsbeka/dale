'use client';

import { useState, useEffect } from 'react';
import type { ResumeData } from '@/types/resume';
import { ModernTemplate } from './templates/modern';
import { ClassicTemplate } from './templates/classic';
import { MinimalTemplate } from './templates/minimal';
import { CreativeTemplate } from './templates/creative';
import { ExecutiveTemplate } from './templates/executive';
import { TechTemplate } from './templates/tech';
import { AcademicTemplate } from './templates/academic';
import { CompactTemplate } from './templates/compact';

export interface TemplateRendererProps {
    templateId: string;
    data: Partial<ResumeData>;
}

const TEMPLATE_MAP = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
    tech: TechTemplate,
    academic: AcademicTemplate,
    compact: CompactTemplate,
};

export function TemplateRenderer({ templateId, data }: TemplateRendererProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Don't render template during SSR to avoid hydration mismatches
    if (!isMounted) {
        return <div className="min-h-[11in] animate-pulse bg-gray-100" />;
    }

    const Template = TEMPLATE_MAP[templateId as keyof typeof TEMPLATE_MAP] || ModernTemplate;
    return <Template data={data} />;
}

export function getTemplateComponent(templateId: string) {
    return TEMPLATE_MAP[templateId as keyof typeof TEMPLATE_MAP] || ModernTemplate;
}

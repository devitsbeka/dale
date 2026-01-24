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
    const Template = TEMPLATE_MAP[templateId as keyof typeof TEMPLATE_MAP] || ModernTemplate;
    return <Template data={data} />;
}

export function getTemplateComponent(templateId: string) {
    return TEMPLATE_MAP[templateId as keyof typeof TEMPLATE_MAP] || ModernTemplate;
}

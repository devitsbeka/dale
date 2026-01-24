'use client';

import React from 'react';
import { Modal, ModalOverlay, Dialog } from '@/components/application/modals/modal';
import { Button } from '@/components/base/buttons/button';
import { Badge } from '@/components/base/badges/badges';
import { AVAILABLE_TEMPLATES, type TemplateMetadata } from '@/lib/template-engine/types';
import { TemplateRenderer } from '@/lib/template-engine/template-renderer';
import { Check, X } from '@untitledui/icons';
import type { ResumeData } from '@/types/resume';

interface TemplatePreviewModalProps {
    templateId: string;
    isOpen: boolean;
    onClose: () => void;
    onUseTemplate: (templateId: string) => void;
}

// Sample data for preview
const SAMPLE_DATA: Partial<ResumeData> = {
    personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johndoe',
        website: 'johndoe.com',
        summary:
            'Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.',
    },
    experience: [
        {
            id: '1',
            company: 'Tech Corp',
            position: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2021-01',
            endDate: '2024-01',
            current: false,
            achievements: [
                'Led team of 5 developers to rebuild core platform, improving performance by 40%',
                'Architected microservices infrastructure serving 1M+ daily active users',
                'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
            ],
        },
        {
            id: '2',
            company: 'StartupCo',
            position: 'Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2019-06',
            endDate: '2021-01',
            current: false,
            achievements: [
                'Built RESTful APIs and React frontend for B2B SaaS platform',
                'Reduced page load time by 60% through code splitting and lazy loading',
            ],
        },
    ],
    education: [
        {
            id: '1',
            school: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'Berkeley, CA',
            startDate: '2015-09',
            endDate: '2019-05',
            gpa: '3.8',
        },
    ],
    skills: [
        { id: '1', name: 'JavaScript', category: 'technical' },
        { id: '2', name: 'TypeScript', category: 'technical' },
        { id: '3', name: 'React', category: 'technical' },
        { id: '4', name: 'Node.js', category: 'technical' },
        { id: '5', name: 'PostgreSQL', category: 'technical' },
        { id: '6', name: 'AWS', category: 'technical' },
        { id: '7', name: 'Team Leadership', category: 'soft' },
        { id: '8', name: 'Agile/Scrum', category: 'soft' },
    ],
    customization: {
        template: 'modern',
        primaryColor: '#3B82F6',
        font: 'Inter',
        sectionOrder: ['experience', 'education', 'skills'],
    },
};

const getTemplateFeatures = (template: TemplateMetadata) => {
    const commonFeatures = ['ATS-friendly', 'Professional layout', 'Easy to customize'];

    switch (template.category) {
        case 'professional':
            return [...commonFeatures, 'Business-appropriate', 'Traditional structure'];
        case 'creative':
            return [...commonFeatures, 'Bold design', 'Unique layout', 'Eye-catching'];
        case 'minimal':
            return [...commonFeatures, 'Clean & simple', 'Maximum white space'];
        case 'academic':
            return [...commonFeatures, 'Publication-focused', 'Research-emphasis'];
        default:
            return commonFeatures;
    }
};

const getBestFor = (template: TemplateMetadata) => {
    switch (template.id) {
        case 'modern':
            return ['Software Engineers', 'Product Managers', 'Data Scientists'];
        case 'classic':
            return ['Legal Professionals', 'Finance Roles', 'Corporate Positions'];
        case 'minimal':
            return ['Designers', 'Consultants', 'Freelancers'];
        case 'creative':
            return ['Marketing Roles', 'Creative Directors', 'UX Designers'];
        case 'executive':
            return ['C-Level Executives', 'Senior Management', 'Board Members'];
        case 'tech':
            return ['Developers', 'DevOps Engineers', 'System Architects'];
        case 'academic':
            return ['Researchers', 'Professors', 'PhD Candidates'];
        case 'compact':
            return ['Entry-Level', 'Career Changers', 'Multiple Roles'];
        default:
            return ['General Professionals'];
    }
};

export function TemplatePreviewModal({
    templateId,
    isOpen,
    onClose,
    onUseTemplate,
}: TemplatePreviewModalProps) {
    const template = AVAILABLE_TEMPLATES.find((t) => t.id === templateId);

    if (!template) {
        return null;
    }

    const features = getTemplateFeatures(template);
    const bestFor = getBestFor(template);

    // Update sample data with template customization
    const previewData = {
        ...SAMPLE_DATA,
        customization: {
            ...SAMPLE_DATA.customization!,
            template: template.id,
            primaryColor: template.accentColor,
            font: template.primaryFont,
        },
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
            <Modal className="max-w-6xl">
                <Dialog>
                    <div className="rounded-2xl bg-primary p-6 shadow-2xl ring-1 ring-secondary">{/* Header */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-primary">{template.name} Template</h2>
                        <p className="mt-1 text-sm text-tertiary">{template.description}</p>
                    </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Preview - 2/3 width */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-secondary bg-secondary/10 p-4">
                            <div className="max-h-[600px] overflow-y-auto rounded-lg bg-white p-8 shadow-lg">
                                <TemplateRenderer templateId={template.id} data={previewData} />
                            </div>
                        </div>
                    </div>

                    {/* Info - 1/3 width */}
                    <div className="space-y-6">
                        {/* Best for section */}
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-primary">
                                Best for:
                            </h3>
                            <ul className="space-y-2">
                                {bestFor.map((role) => (
                                    <li
                                        key={role}
                                        className="flex items-start gap-2 text-sm text-secondary"
                                    >
                                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" />
                                        <span>{role}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Features section */}
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-primary">Features:</h3>
                            <ul className="space-y-2">
                                {features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-2 text-sm text-secondary"
                                    >
                                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Typography & Color */}
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-primary">
                                Design Details:
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-tertiary">Font:</span>{' '}
                                    <span
                                        className="font-medium text-secondary"
                                        style={{ fontFamily: template.primaryFont }}
                                    >
                                        {template.primaryFont}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-tertiary">Accent Color:</span>
                                    <div
                                        className="h-6 w-6 rounded border border-secondary"
                                        style={{ backgroundColor: template.accentColor }}
                                    />
                                    <span className="font-mono text-xs text-secondary">
                                        {template.accentColor}
                                    </span>
                                </div>
                                <div>
                                    <Badge
                                        color="gray"
                                        size="sm"
                                    >
                                        {template.category}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-3 border-t border-secondary pt-4">
                        <Button color="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => {
                                onUseTemplate(template.id);
                                onClose();
                            }}
                        >
                            Use This Template
                        </Button>
                    </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}

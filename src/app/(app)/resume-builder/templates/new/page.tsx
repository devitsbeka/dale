'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Label } from '@/components/base/input/label';
import { Select } from '@/components/base/select/select';
import { Slider } from '@/components/base/slider/slider';
import { Modal, ModalOverlay, Dialog } from '@/components/application/modals/modal';
import { ResumePreview } from '@/components/resume/resume-preview';
import { X, Save01 } from '@untitledui/icons';
import type { ResumeData } from '@/types/resume';

interface TemplateConfig {
    layout: 'single' | 'two-column' | 'sidebar';
    headerStyle: 'centered' | 'left' | 'split';
    spacing: number;
    typography: {
        heading: { family: string; size: number };
        body: { family: string; size: number };
    };
    colors: {
        primary: string;
        secondary: string;
    };
}

const SAMPLE_DATA: Partial<ResumeData> = {
    personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        summary: 'Experienced software engineer with a passion for building great products.',
    },
    experience: [
        {
            id: '1',
            company: 'Tech Corp',
            position: 'Senior Engineer',
            location: 'San Francisco, CA',
            startDate: '2020-01',
            endDate: '',
            current: true,
            achievements: [
                'Led team of 5 engineers',
                'Increased performance by 40%',
                'Launched 3 major features',
            ],
        },
    ],
    education: [
        {
            id: '1',
            school: 'University of Technology',
            degree: 'BS Computer Science',
            field: 'Computer Science',
            location: 'Boston, MA',
            startDate: '2016',
            endDate: '2020',
            gpa: '3.8',
        },
    ],
    skills: [
        { id: '1', name: 'JavaScript', category: 'technical' },
        { id: '2', name: 'React', category: 'technical' },
        { id: '3', name: 'Node.js', category: 'technical' },
    ],
};

const FONT_OPTIONS = [
    'Inter',
    'Roboto',
    'Lato',
    'Montserrat',
    'Open Sans',
    'Playfair Display',
    'Merriweather',
    'Source Sans Pro',
];

export default function CustomTemplateBuilderPage() {
    const router = useRouter();
    const [templateName, setTemplateName] = useState('');
    const [config, setConfig] = useState<TemplateConfig>({
        layout: 'single',
        headerStyle: 'centered',
        spacing: 5,
        typography: {
            heading: { family: 'Inter', size: 24 },
            body: { family: 'Inter', size: 11 },
        },
        colors: {
            primary: '#2563EB',
            secondary: '#64748B',
        },
    });
    const [isSaving, setIsSaving] = useState(false);

    const updateConfig = (updates: Partial<TemplateConfig>) => {
        setConfig((prev) => ({ ...prev, ...updates }));
    };

    const updateTypography = (
        type: 'heading' | 'body',
        updates: Partial<{ family: string; size: number }>
    ) => {
        setConfig((prev) => ({
            ...prev,
            typography: {
                ...prev.typography,
                [type]: { ...prev.typography[type], ...updates },
            },
        }));
    };

    const updateColors = (updates: Partial<{ primary: string; secondary: string }>) => {
        setConfig((prev) => ({
            ...prev,
            colors: { ...prev.colors, ...updates },
        }));
    };

    const handleSave = async () => {
        if (!templateName.trim()) {
            alert('Please enter a template name');
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch('/api/templates/custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: templateName,
                    config,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save template');
            }

            const data = await response.json();

            // Redirect to builder with custom template
            router.push(`/resume-builder?template=${data.templateId}`);
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Apply custom styles to preview
    const customStyles = {
        '--heading-font': config.typography.heading.family,
        '--heading-size': `${config.typography.heading.size}px`,
        '--body-font': config.typography.body.family,
        '--body-size': `${config.typography.body.size}px`,
        '--primary-color': config.colors.primary,
        '--secondary-color': config.colors.secondary,
        '--spacing': `${config.spacing * 4}px`,
    } as React.CSSProperties;

    return (
        <div className="min-h-screen bg-secondary">
            {/* Header */}
            <div className="border-b border-secondary bg-primary">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-primary">
                                Create Custom Template
                            </h1>
                            <p className="mt-1 text-sm text-tertiary">
                                Design your own resume template with live preview
                            </p>
                        </div>
                        <Button
                            color="link-gray"
                            onClick={() => router.back()}
                            iconLeading={X}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Controls Panel */}
                    <div className="space-y-6">
                        {/* Template Name */}
                        <div className="rounded-lg border border-secondary bg-primary p-6">
                            <h2 className="mb-4 text-lg font-semibold text-primary">
                                Template Name
                            </h2>
                            <Input
                                value={templateName}
                                onChange={setTemplateName}
                                placeholder="My Custom Template"
                            />
                        </div>

                        {/* Layout */}
                        <div className="rounded-lg border border-secondary bg-primary p-6">
                            <h2 className="mb-4 text-lg font-semibold text-primary">Layout</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {(['single', 'two-column', 'sidebar'] as const).map((layout) => (
                                    <button
                                        key={layout}
                                        onClick={() => updateConfig({ layout })}
                                        className={`rounded-lg border-2 p-4 text-center transition ${
                                            config.layout === layout
                                                ? 'border-brand-600 bg-brand-50'
                                                : 'border-secondary bg-secondary/10'
                                        }`}
                                    >
                                        <p className="text-sm font-medium capitalize text-primary">
                                            {layout}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Header Style */}
                        <div className="rounded-lg border border-secondary bg-primary p-6">
                            <h2 className="mb-4 text-lg font-semibold text-primary">
                                Header Style
                            </h2>
                            <div className="grid grid-cols-3 gap-3">
                                {(['centered', 'left', 'split'] as const).map((style) => (
                                    <button
                                        key={style}
                                        onClick={() => updateConfig({ headerStyle: style })}
                                        className={`rounded-lg border-2 p-4 text-center transition ${
                                            config.headerStyle === style
                                                ? 'border-brand-600 bg-brand-50'
                                                : 'border-secondary bg-secondary/10'
                                        }`}
                                    >
                                        <p className="text-sm font-medium capitalize text-primary">
                                            {style}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="rounded-lg border border-secondary bg-primary p-6">
                            <h2 className="mb-4 text-lg font-semibold text-primary">
                                Typography
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <Label>Heading Font</Label>
                                    <Select
                                        value={config.typography.heading.family}
                                        onChange={(value) =>
                                            updateTypography('heading', { family: value as string })
                                        }
                                    >
                                        {FONT_OPTIONS.map((font) => (
                                            <option key={font} value={font}>
                                                {font}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <Label>Heading Size: {config.typography.heading.size}pt</Label>
                                    <Slider
                                        value={[config.typography.heading.size]}
                                        onChange={(value) =>
                                            updateTypography('heading', { size: Array.isArray(value) ? value[0] : value })
                                        }
                                        minValue={16}
                                        maxValue={36}
                                        step={1}
                                    />
                                </div>
                                <div>
                                    <Label>Body Font</Label>
                                    <Select
                                        value={config.typography.body.family}
                                        onChange={(value) =>
                                            updateTypography('body', { family: value as string })
                                        }
                                    >
                                        {FONT_OPTIONS.map((font) => (
                                            <option key={font} value={font}>
                                                {font}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <Label>Body Size: {config.typography.body.size}pt</Label>
                                    <Slider
                                        value={[config.typography.body.size]}
                                        onChange={(value) =>
                                            updateTypography('body', { size: Array.isArray(value) ? value[0] : value })
                                        }
                                        minValue={9}
                                        maxValue={14}
                                        step={0.5}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="rounded-lg border border-secondary bg-primary p-6">
                            <h2 className="mb-4 text-lg font-semibold text-primary">Colors</h2>
                            <div className="space-y-4">
                                <div>
                                    <Label>Primary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={config.colors.primary}
                                            onChange={(value) =>
                                                updateColors({ primary: value })
                                            }
                                            className="h-10 w-20"
                                        />
                                        <Input
                                            value={config.colors.primary}
                                            onChange={(value) =>
                                                updateColors({ primary: value })
                                            }
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>Secondary Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            value={config.colors.secondary}
                                            onChange={(value) =>
                                                updateColors({ secondary: value })
                                            }
                                            className="h-10 w-20"
                                        />
                                        <Input
                                            value={config.colors.secondary}
                                            onChange={(value) =>
                                                updateColors({ secondary: value })
                                            }
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Spacing */}
                        <div className="rounded-lg border border-secondary bg-primary p-6">
                            <h2 className="mb-4 text-lg font-semibold text-primary">
                                Section Spacing: {config.spacing}
                            </h2>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-tertiary">Compact</span>
                                <Slider
                                    value={[config.spacing]}
                                    onChange={(value) => updateConfig({ spacing: Array.isArray(value) ? value[0] : value })}
                                    minValue={1}
                                    maxValue={10}
                                    step={1}
                                    className="flex-1"
                                />
                                <span className="text-sm text-tertiary">Spacious</span>
                            </div>
                        </div>

                        {/* Save Button */}
                        <Button
                            color="primary"
                            onClick={handleSave}
                            isDisabled={isSaving || !templateName.trim()}
                            iconLeading={Save01}
                            className="w-full"
                        >
                            {isSaving ? 'Saving...' : 'Save & Use Template'}
                        </Button>
                    </div>

                    {/* Live Preview */}
                    <div className="lg:sticky lg:top-8 lg:h-fit">
                        <div className="rounded-lg border border-secondary bg-primary p-6">
                            <h2 className="mb-4 text-lg font-semibold text-primary">
                                Live Preview
                            </h2>
                            <div
                                className="overflow-auto rounded-lg border border-secondary bg-white"
                                style={{ maxHeight: 'calc(100vh - 200px)', ...customStyles }}
                            >
                                <div className="scale-75 origin-top">
                                    <ResumePreview
                                        data={{
                                            ...SAMPLE_DATA,
                                            customization: {
                                                template: 'modern',
                                                primaryColor: config.colors.primary,
                                                font: config.typography.body.family,
                                                sectionOrder: ['experience', 'education', 'skills'],
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

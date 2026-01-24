'use client';

import React, { useState } from 'react';
import { Button } from '@/components/base/buttons/button';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Check } from '@untitledui/icons';
import { AVAILABLE_TEMPLATES } from '@/lib/template-engine/types';
import { TemplateGallery } from '@/components/resume/template-gallery';
import { TemplatePreviewModal } from '@/components/resume/template-preview-modal';

interface CustomizeStepProps {
    onNext: () => void;
    onPrevious: () => void;
}

const COLORS = [
    { value: '#E9684B', label: 'Coral' },
    { value: '#3B82F6', label: 'Azure' },
    { value: '#059669', label: 'Emerald' },
    { value: '#6366F1', label: 'Indigo' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#334155', label: 'Slate' },
];

const FONTS = [
    { value: 'inter', label: 'Inter', preview: 'Modern sans-serif', fontFamily: 'Inter, sans-serif' },
    { value: 'roboto', label: 'Roboto', preview: 'Professional sans-serif', fontFamily: 'Roboto, sans-serif' },
    { value: 'lato', label: 'Lato', preview: 'Friendly sans-serif', fontFamily: 'Lato, sans-serif' },
    { value: 'opensans', label: 'Open Sans', preview: 'Clean sans-serif', fontFamily: 'Open Sans, sans-serif' },
    { value: 'georgia', label: 'Georgia', preview: 'Classic serif', fontFamily: 'Georgia, serif' },
    { value: 'merriweather', label: 'Merriweather', preview: 'Elegant serif', fontFamily: 'Merriweather, serif' },
];

export function CustomizeStep({ onNext, onPrevious }: CustomizeStepProps) {
    const { resumeData, updateCustomization, markStepComplete } = useResume();
    const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
    const [showGallery, setShowGallery] = useState(false);

    const customization = resumeData.customization || {
        template: 'modern',
        primaryColor: '#E9684B',
        font: 'inter',
        sectionOrder: ['experience', 'education', 'skills'],
    };

    const handleNext = () => {
        markStepComplete('customize');
        onNext();
    };

    const handleSelectTemplate = (templateId: string) => {
        updateCustomization({ template: templateId });
        setShowGallery(false);
    };

    const handlePreviewTemplate = (templateId: string) => {
        setPreviewTemplateId(templateId);
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold text-primary">Customize Your Resume</h3>
                <p className="mt-1 text-sm text-tertiary">
                    Choose a template and adjust the styling to match your preferences.
                </p>
            </div>

            {/* Template selection */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-secondary">Choose Template</h4>
                    <Button
                        color="link-gray"
                        size="sm"
                        onClick={() => setShowGallery(!showGallery)}
                    >
                        {showGallery ? 'Simple View' : 'Browse Gallery'}
                    </Button>
                </div>

                {showGallery ? (
                    <TemplateGallery
                        selectedTemplate={customization.template}
                        onSelectTemplate={handleSelectTemplate}
                        onPreviewTemplate={handlePreviewTemplate}
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {AVAILABLE_TEMPLATES.map((template) => {
                                const isSelected = customization.template === template.id;
                                return (
                                    <button
                                        key={template.id}
                                        onClick={() =>
                                            updateCustomization({ template: template.id })
                                        }
                                        className={`group flex flex-col gap-2 rounded-xl border-2 p-3 text-left outline-focus-ring transition-all hover:shadow-md focus-visible:outline-2 ${
                                            isSelected
                                                ? 'border-brand-200 bg-brand-50/30 shadow-sm ring-2 ring-brand-100'
                                                : 'border-secondary bg-primary hover:border-brand-100 hover:bg-brand-50/10'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <h5 className="truncate font-semibold text-primary">
                                                    {template.name}
                                                </h5>
                                                <p className="line-clamp-2 text-xs text-tertiary">
                                                    {template.description}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="flex-shrink-0 text-brand-500">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-1 text-xs">
                                            <span className="rounded bg-secondary px-2 py-0.5 text-tertiary">
                                                {template.category}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-tertiary">
                            Tip: Your selected template will update the preview in real-time
                        </p>
                    </>
                )}
            </div>

            {/* Template Preview Modal */}
            {previewTemplateId && (
                <TemplatePreviewModal
                    templateId={previewTemplateId}
                    isOpen={previewTemplateId !== null}
                    onClose={() => setPreviewTemplateId(null)}
                    onUseTemplate={handleSelectTemplate}
                />
            )}

            {/* Color selection */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-secondary">Accent Color</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {COLORS.map((color) => {
                        const isSelected = customization.primaryColor === color.value;
                        return (
                            <button
                                key={color.value}
                                onClick={() =>
                                    updateCustomization({ primaryColor: color.value })
                                }
                                className={`flex items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left outline-focus-ring transition focus-visible:outline-2 ${
                                    isSelected
                                        ? 'border-brand-200 bg-brand-50/30 ring-2 ring-brand-100'
                                        : 'border-secondary bg-primary hover:border-brand-100 hover:bg-brand-50/10'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-6 w-6 rounded-full"
                                        style={{ backgroundColor: color.value }}
                                    />
                                    <span className="text-sm font-semibold text-primary">
                                        {color.label}
                                    </span>
                                </div>
                                {isSelected && <Check className="h-4 w-4 text-brand-500" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Font selection */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-secondary">Font</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {FONTS.map((font) => {
                        const isSelected = customization.font === font.value;
                        return (
                            <button
                                key={font.value}
                                onClick={() => updateCustomization({ font: font.value })}
                                className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left outline-focus-ring transition focus-visible:outline-2 ${
                                    isSelected
                                        ? 'border-brand-200 bg-brand-50/30 ring-2 ring-brand-100'
                                        : 'border-secondary bg-primary hover:border-brand-100 hover:bg-brand-50/10'
                                }`}
                            >
                                <div>
                                    <p className="font-semibold text-primary" style={{ fontFamily: font.fontFamily }}>
                                        {font.label}
                                    </p>
                                    <p className="text-sm text-tertiary">{font.preview}</p>
                                </div>
                                {isSelected && (
                                    <Check className="h-4 w-4 text-brand-500" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-between border-t border-secondary pt-6">
                <Button color="link-gray" size="lg" onClick={onPrevious} iconLeading={ChevronLeft}>
                    Back
                </Button>
                <Button
                    color="primary"
                    size="lg"
                    onClick={handleNext}
                    iconTrailing={ChevronRight}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

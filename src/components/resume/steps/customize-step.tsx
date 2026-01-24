'use client';

import React from 'react';
import { Button } from '@/components/base/buttons/button';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Check } from '@untitledui/icons';
import { AVAILABLE_TEMPLATES } from '@/lib/template-engine/types';

interface CustomizeStepProps {
    onNext: () => void;
    onPrevious: () => void;
}

const COLORS = [
    { value: '#E9684B', label: 'Warm Orange', class: 'bg-brand-500' },
    { value: '#3B82F6', label: 'Professional Blue', class: 'bg-blue-500' },
    { value: '#059669', label: 'Success Green', class: 'bg-emerald-600' },
    { value: '#6366F1', label: 'Indigo', class: 'bg-indigo-500' },
    { value: '#334155', label: 'Slate Gray', class: 'bg-slate-700' },
];

export function CustomizeStep({ onNext, onPrevious }: CustomizeStepProps) {
    const { resumeData, updateCustomization, markStepComplete } = useResume();
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
                <h4 className="text-sm font-semibold text-secondary">Choose Template</h4>
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
                                        ? 'border-brand-500 bg-brand-50 shadow-sm'
                                        : 'border-secondary bg-primary hover:border-gray-400'
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
            </div>

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
                                className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 outline-focus-ring transition focus-visible:outline-2 ${
                                    isSelected
                                        ? 'border-gray-900 bg-secondary'
                                        : 'border-secondary bg-primary hover:border-gray-400'
                                }`}
                            >
                                <div className={`h-6 w-6 rounded-full ${color.class}`} />
                                <span className="flex-1 text-sm text-primary">
                                    {color.label}
                                </span>
                                {isSelected && <Check className="h-4 w-4 text-gray-900" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Font selection */}
            <div className="space-y-4">
                <h4 className="text-sm font-semibold text-secondary">Font</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {[
                        { value: 'inter', label: 'Inter', preview: 'Modern sans-serif' },
                        { value: 'roboto', label: 'Roboto', preview: 'Professional sans-serif' },
                        { value: 'lato', label: 'Lato', preview: 'Friendly sans-serif' },
                        { value: 'georgia', label: 'Georgia', preview: 'Classic serif' },
                    ].map((font) => {
                        const isSelected = customization.font === font.value;
                        return (
                            <button
                                key={font.value}
                                onClick={() => updateCustomization({ font: font.value })}
                                className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left outline-focus-ring transition focus-visible:outline-2 ${
                                    isSelected
                                        ? 'border-brand-500 bg-brand-50'
                                        : 'border-secondary bg-primary hover:border-gray-400'
                                }`}
                            >
                                <div>
                                    <p className="font-semibold text-primary">{font.label}</p>
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
                    Preview Resume
                </Button>
            </div>
        </div>
    );
}

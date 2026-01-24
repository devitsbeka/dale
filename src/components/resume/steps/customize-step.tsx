'use client';

import React from 'react';
import { Button } from '@/components/base/button';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Check } from '@untitledui/icons/react';

interface CustomizeStepProps {
    onNext: () => void;
    onPrevious: () => void;
}

const TEMPLATES = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and contemporary design',
        preview: '/templates/modern.png',
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional professional layout',
        preview: '/templates/classic.png',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple and elegant',
        preview: '/templates/minimal.png',
    },
];

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
        <div className="flex flex-col gap-8 p-6">
            <div>
                <h3 className="text-md font-semibold text-primary">Customize Your Resume</h3>
                <p className="text-sm text-tertiary">
                    Choose a template and adjust the styling to match your preferences.
                </p>
            </div>

            {/* Template selection */}
            <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-secondary">Choose Template</h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {TEMPLATES.map((template) => {
                        const isSelected = customization.template === template.id;
                        return (
                            <button
                                key={template.id}
                                onClick={() =>
                                    updateCustomization({ template: template.id })
                                }
                                className={`flex flex-col gap-3 rounded-xl border-2 p-4 text-left outline-focus-ring transition focus-visible:outline-2 ${
                                    isSelected
                                        ? 'border-brand-500 bg-brand-50'
                                        : 'border-secondary bg-primary hover:border-gray-400'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h5 className="font-semibold text-primary">
                                            {template.name}
                                        </h5>
                                        <p className="text-sm text-tertiary">
                                            {template.description}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="h-40 rounded-lg bg-secondary/30" />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Color selection */}
            <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-secondary">Accent Color</h4>
                <div className="flex flex-wrap gap-3">
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
                                <span className="text-sm font-medium text-secondary">
                                    {color.label}
                                </span>
                                {isSelected && <Check className="h-4 w-4 text-brand-500" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Font selection */}
            <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-secondary">Font</h4>
                <div className="grid gap-3 sm:grid-cols-2">
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
                                    <Check className="h-5 w-5 text-brand-500" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-between gap-3 border-t border-secondary pt-5">
                <Button variant="link" size="lg" onClick={onPrevious} iconLeading={ChevronLeft}>
                    Back
                </Button>
                <Button
                    variant="primary"
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

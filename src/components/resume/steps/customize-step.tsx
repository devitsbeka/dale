'use client';

import React from 'react';
import { Button } from '@/components/base/buttons/button';
import { useResume } from '@/contexts/resume-context';
import { ChevronRight, ChevronLeft, Check } from '@untitledui/icons';

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
        <div>
            <div>
                <h3>Customize Your Resume</h3>
                <p>
                    Choose a template and adjust the styling to match your preferences.
                </p>
            </div>

            {/* Template selection */}
            <div>
                <h4>Choose Template</h4>
                <div>
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
                                <div>
                                    <div>
                                        <h5>
                                            {template.name}
                                        </h5>
                                        <p>
                                            {template.description}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <div>
                                            <Check />
                                        </div>
                                    )}
                                </div>
                                <div />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Color selection */}
            <div>
                <h4>Accent Color</h4>
                <div>
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
                                <span>
                                    {color.label}
                                </span>
                                {isSelected && <Check />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Font selection */}
            <div>
                <h4>Font</h4>
                <div>
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
                                    <p>{font.label}</p>
                                    <p>{font.preview}</p>
                                </div>
                                {isSelected && (
                                    <Check />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
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

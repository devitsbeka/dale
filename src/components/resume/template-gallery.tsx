'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AVAILABLE_TEMPLATES, type TemplateMetadata } from '@/lib/template-engine/types';
import { Button } from '@/components/base/buttons/button';
import { Badge } from '@/components/base/badges/badges';
import { Check, Plus } from '@untitledui/icons';

interface TemplateGalleryProps {
    selectedTemplate?: string;
    onSelectTemplate: (templateId: string) => void;
    onPreviewTemplate?: (templateId: string) => void;
}

const getCategoryBadgeColor = (category: TemplateMetadata['category']) => {
    switch (category) {
        case 'professional':
            return 'brand' as const;
        case 'creative':
            return 'purple' as const;
        case 'minimal':
            return 'gray' as const;
        case 'academic':
            return 'blue' as const;
        default:
            return 'gray' as const;
    }
};

const getCategoryLabel = (category: TemplateMetadata['category']) => {
    switch (category) {
        case 'professional':
            return 'Professional';
        case 'creative':
            return 'Creative';
        case 'minimal':
            return 'Minimal';
        case 'academic':
            return 'Academic';
        default:
            return category;
    }
};

export function TemplateGallery({
    selectedTemplate,
    onSelectTemplate,
    onPreviewTemplate,
}: TemplateGalleryProps) {
    const router = useRouter();
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-primary">Choose Your Template</h2>
                <p className="mt-1 text-sm text-tertiary">
                    Select a professional template to get started
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {AVAILABLE_TEMPLATES.map((template) => {
                    const isSelected = selectedTemplate === template.id;
                    const isHovered = hoveredTemplate === template.id;

                    return (
                        <div
                            key={template.id}
                            className={`group relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                                isSelected
                                    ? 'border-brand-600 bg-brand-50 shadow-md'
                                    : 'border-secondary bg-primary hover:border-brand-300 hover:shadow-lg'
                            } ${isHovered ? 'scale-105' : ''}`}
                            onClick={() => onSelectTemplate(template.id)}
                            onMouseEnter={() => setHoveredTemplate(template.id)}
                            onMouseLeave={() => setHoveredTemplate(null)}
                        >
                            {/* Selection indicator */}
                            {isSelected && (
                                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 shadow-lg">
                                    <Check className="h-5 w-5 text-white" />
                                </div>
                            )}

                            {/* Template preview thumbnail */}
                            <div
                                className="h-48 rounded-t-xl border-b border-secondary"
                                style={{
                                    background: `linear-gradient(135deg, ${template.accentColor}15 0%, ${template.accentColor}05 100%)`,
                                }}
                            >
                                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                                    <div
                                        className="mb-3 text-4xl font-bold"
                                        style={{
                                            fontFamily: template.primaryFont,
                                            color: template.accentColor,
                                        }}
                                    >
                                        Aa
                                    </div>
                                    <div className="space-y-1">
                                        <div
                                            className="h-2 w-20 rounded"
                                            style={{ backgroundColor: template.accentColor }}
                                        />
                                        <div className="h-1 w-16 rounded bg-secondary" />
                                        <div className="h-1 w-12 rounded bg-secondary" />
                                    </div>
                                </div>
                            </div>

                            {/* Template info */}
                            <div className="p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="font-semibold text-primary">{template.name}</h3>
                                    <Badge
                                        color={getCategoryBadgeColor(template.category)}
                                        size="sm"
                                    >
                                        {getCategoryLabel(template.category)}
                                    </Badge>
                                </div>
                                <p className="text-xs text-tertiary">{template.description}</p>

                                {/* Action buttons on hover */}
                                <div className="mt-4 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    <Button
                                        color={isSelected ? 'primary' : 'secondary'}
                                        size="sm"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            onSelectTemplate(template.id);
                                        }}
                                        className="flex-1"
                                    >
                                        {isSelected ? 'Selected' : 'Use Template'}
                                    </Button>
                                    {onPreviewTemplate && (
                                        <Button
                                            color="link-gray"
                                            size="sm"
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                onPreviewTemplate(template.id);
                                            }}
                                        >
                                            Preview
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Create Custom Template Card */}
                <div
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-secondary bg-secondary/10 p-8 transition-all duration-200 hover:border-brand-600 hover:bg-brand-50"
                    onClick={() => router.push('/resume-builder/templates/new')}
                >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 transition-transform duration-200 group-hover:scale-110">
                        <Plus className="h-8 w-8 text-brand-600" />
                    </div>
                    <h3 className="mb-2 font-semibold text-primary">Create Custom Template</h3>
                    <p className="text-center text-xs text-tertiary">
                        Design your own template with custom colors, fonts, and layout
                    </p>
                </div>
            </div>

            {/* Popular templates badge */}
            <div className="mt-6 rounded-lg bg-secondary/30 p-4">
                <p className="text-sm text-secondary">
                    <span className="font-semibold">💡 Tip:</span> Modern and Classic templates are
                    most popular with hiring managers and pass through ATS systems easily.
                </p>
            </div>
        </div>
    );
}

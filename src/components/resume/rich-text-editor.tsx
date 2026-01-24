'use client';

import React from 'react';
import { Label } from '@/components/base/input/label';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    maxLength?: number;
    className?: string;
}

/**
 * TEMPORARY SIMPLE TEXTAREA - TESTING ONLY
 * If this works, the issue was the contentEditable implementation
 */
export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Type here...',
    label,
    maxLength = 500,
    className = '',
}: RichTextEditorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (text.length <= maxLength) {
            onChange(text);
        }
    };

    const characterCount = value.length;
    const isOverLimit = characterCount > maxLength;

    return (
        <div className={className}>
            {label && <Label className="mb-2">{label}</Label>}

            <textarea
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="min-h-[140px] w-full rounded-lg border border-secondary bg-primary p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                maxLength={maxLength}
            />

            <div className="mt-1 flex items-center justify-between text-xs text-tertiary">
                <span className={isOverLimit ? 'text-red-600' : ''}>
                    {characterCount}/{maxLength}
                </span>
                {isOverLimit && (
                    <span className="text-red-600">Character limit exceeded</span>
                )}
            </div>
        </div>
    );
}

// Export memoized version
export const MemoizedRichTextEditor = React.memo(RichTextEditor);

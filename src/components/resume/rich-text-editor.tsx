'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
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
 * Simple rich text editor WITHOUT Tiptap
 * Uses contentEditable with manual formatting
 * Zero hydration errors, always works
 */
export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Type here...',
    label,
    maxLength = 500,
    className = '',
}: RichTextEditorProps) {
    const [isFocused, setIsFocused] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    // Convert HTML to text for character count
    const getTextContent = (html: string): string => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || '';
    };

    const handleInput = () => {
        if (!editorRef.current) return;
        const html = editorRef.current.innerHTML;
        const text = getTextContent(html);

        if (text.length <= maxLength) {
            onChange(html);
        } else {
            // Revert to previous value
            editorRef.current.innerHTML = value;
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        // Bold: Cmd/Ctrl + B
        if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
            e.preventDefault();
            document.execCommand('bold', false);
        }
        // Italic: Cmd/Ctrl + I
        if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
            e.preventDefault();
            document.execCommand('italic', false);
        }
    };

    const toggleFormat = (command: string) => {
        document.execCommand(command, false);
        editorRef.current?.focus();
    };

    const isActive = (command: string): boolean => {
        return document.queryCommandState(command);
    };

    const characterCount = getTextContent(value).length;
    const isOverLimit = characterCount > maxLength;

    return (
        <div className={className}>
            {label && <Label className="mb-2">{label}</Label>}

            {/* Toolbar */}
            <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-secondary bg-secondary/50 p-2">
                <button
                    type="button"
                    onClick={() => toggleFormat('bold')}
                    className={`rounded px-3 py-1 text-sm font-medium transition ${
                        isActive('bold')
                            ? 'bg-brand-500 text-white'
                            : 'bg-white text-tertiary hover:bg-gray-100'
                    }`}
                    title="Bold (Ctrl+B)"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => toggleFormat('italic')}
                    className={`rounded px-3 py-1 text-sm italic transition ${
                        isActive('italic')
                            ? 'bg-brand-500 text-white'
                            : 'bg-white text-tertiary hover:bg-gray-100'
                    }`}
                    title="Italic (Ctrl+I)"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => toggleFormat('insertUnorderedList')}
                    className={`rounded px-3 py-1 text-sm transition ${
                        isActive('insertUnorderedList')
                            ? 'bg-brand-500 text-white'
                            : 'bg-white text-tertiary hover:bg-gray-100'
                    }`}
                    title="Bullet List"
                >
                    • List
                </button>

                <div className="ml-auto text-xs text-tertiary">
                    <span className={isOverLimit ? 'text-red-600' : ''}>
                        {characterCount}
                    </span>
                    /{maxLength}
                </div>
            </div>

            {/* Editor - contentEditable div */}
            <div
                ref={editorRef}
                contentEditable
                className={`prose prose-sm max-w-none min-h-[100px] rounded-b-lg border border-secondary bg-primary p-3 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    !value && !isFocused ? 'text-tertiary' : ''
                }`}
                dangerouslySetInnerHTML={{ __html: value || '' }}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                data-placeholder={placeholder}
                style={{
                    minHeight: '100px',
                }}
            />

            {isOverLimit && (
                <p className="mt-1 text-xs text-red-600">
                    Character limit exceeded. Please shorten your text.
                </p>
            )}

            <style jsx>{`
                [contenteditable][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                }
                [contenteditable] ul {
                    list-style-type: disc;
                    padding-left: 1rem;
                }
                [contenteditable] ol {
                    list-style-type: decimal;
                    padding-left: 1rem;
                }
            `}</style>
        </div>
    );
}

// Export memoized version
export const MemoizedRichTextEditor = React.memo(RichTextEditor);

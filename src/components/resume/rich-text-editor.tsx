'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Label } from '@/components/base/input/label';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    maxLength?: number;
    className?: string;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Type here...',
    label,
    maxLength = 500,
    className = '',
}: RichTextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Disable features that aren't ATS-compatible
                heading: false,
                codeBlock: false,
                horizontalRule: false,
                blockquote: false,
                // Enable bullet lists
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc pl-4',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal pl-4',
                    },
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px] p-3',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const text = editor.getText();

            // Enforce max length
            if (text.length <= maxLength) {
                onChange(html);
            } else {
                // Revert to previous content if max length exceeded
                editor.commands.setContent(value);
            }
        },
    });

    const characterCount = editor?.getText().length || 0;
    const isOverLimit = characterCount > maxLength;

    // Don't render editor content until mounted to avoid hydration issues
    if (!isMounted) {
        return (
            <div className={className}>
                {label && <Label className="mb-2">{label}</Label>}
                <div className="min-h-[140px] rounded-lg border border-secondary bg-primary p-3">
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 w-3/4 rounded bg-secondary"></div>
                        <div className="h-4 w-1/2 rounded bg-secondary"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            {label && <Label className="mb-2">{label}</Label>}

            {/* Toolbar */}
            <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-secondary bg-secondary/50 p-2">
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    disabled={!editor}
                    className={`rounded px-3 py-1 text-sm font-medium transition ${
                        editor?.isActive('bold')
                            ? 'bg-brand-500 text-white'
                            : 'bg-white text-tertiary hover:bg-gray-100'
                    }`}
                    title="Bold (Ctrl+B)"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    disabled={!editor}
                    className={`rounded px-3 py-1 text-sm italic transition ${
                        editor?.isActive('italic')
                            ? 'bg-brand-500 text-white'
                            : 'bg-white text-tertiary hover:bg-gray-100'
                    }`}
                    title="Italic (Ctrl+I)"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    disabled={!editor}
                    className={`rounded px-3 py-1 text-sm transition ${
                        editor?.isActive('bulletList')
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

            {/* Editor */}
            <div className="rounded-b-lg border border-secondary bg-primary">
                <EditorContent editor={editor} />
            </div>

            {isOverLimit && (
                <p className="mt-1 text-xs text-red-600">
                    Character limit exceeded. Please shorten your text.
                </p>
            )}
        </div>
    );
}

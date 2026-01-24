'use client';

import React, { useState } from 'react';
import { Modal, ModalOverlay, Dialog } from '@/components/application/modals/modal';
import { Button } from '@/components/base/buttons/button';
import { Upload04, X, CheckCircle, AlertCircle } from '@untitledui/icons';
import { importResume } from '@/lib/import/import-resume';
import type { ResumeData } from '@/types/resume';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportComplete: (data: Partial<ResumeData>) => void;
}

export function ImportModal({ isOpen, onClose, onImportComplete }: ImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (selectedFile: File | null) => {
        setFile(selectedFile);
        setError(null);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleImport = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            const data = await importResume(file);
            onImportComplete(data);
            setFile(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import resume. Please try again.');
            console.error('Import error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
            <Modal className="max-w-lg">
                <Dialog>
                    <div className="rounded-2xl bg-primary shadow-2xl ring-1 ring-secondary">
                        {/* Header */}
                        <div className="border-b border-secondary p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Upload04 className="h-6 w-6 text-brand-600" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-primary">
                                            Import Resume
                                        </h2>
                                        <p className="text-sm text-tertiary">
                                            Upload your existing resume to auto-populate fields
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="rounded-lg p-2 text-tertiary transition hover:bg-secondary hover:text-primary"
                                    aria-label="Close"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* File Upload Area */}
                            <div
                                className={`relative cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition ${
                                    dragActive
                                        ? 'border-brand-600 bg-brand-50'
                                        : 'border-secondary bg-secondary/10 hover:border-brand-300'
                                }`}
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                    className="hidden"
                                />

                                <Upload04 className="mx-auto h-12 w-12 text-tertiary" />
                                <p className="mt-4 text-sm font-medium text-primary">
                                    {file ? file.name : 'Drag & drop your resume or click to browse'}
                                </p>
                                <p className="mt-2 text-xs text-tertiary">
                                    Supports PDF, DOCX, and TXT files
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            {/* Processing State */}
                            {isProcessing && (
                                <div className="mt-4 flex items-center gap-3 rounded-lg bg-brand-50 p-3">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                                    <p className="text-sm font-medium text-brand-700">
                                        Analyzing your resume...
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 border-t border-secondary p-6">
                            <Button color="secondary" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onClick={handleImport}
                                isDisabled={!file || isProcessing}
                                iconLeading={Upload04}
                            >
                                {isProcessing ? 'Importing...' : 'Import Resume'}
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}

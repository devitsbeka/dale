'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Upload01, FileCheck02, AlertCircle } from '@untitledui/icons';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import type { ResumeData } from '@/types/resume';

interface ResumeImportDialogProps {
    onImport: (data: Partial<ResumeData>) => void;
    onClose: () => void;
}

export function ResumeImportDialog({ onImport, onClose }: ResumeImportDialogProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dialogRef = useFocusTrap<HTMLDivElement>(true);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('/api/resumes/import', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to import resume');
            }

            onImport(result.data);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to import resume');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true" aria-labelledby="import-dialog-title">
            <div ref={dialogRef} className="w-full max-w-md rounded-lg bg-primary p-6 shadow-xl">
                <div className="mb-4">
                    <h2 id="import-dialog-title" className="text-xl font-semibold text-primary">Import Resume</h2>
                    <p className="mt-1 text-sm text-tertiary">
                        Upload a resume in JSON format (PDF/DOCX coming soon)
                    </p>
                </div>

                {/* File upload area */}
                <div
                    className="mb-4 cursor-pointer rounded-lg border-2 border-dashed border-secondary bg-secondary/10 p-8 text-center transition hover:border-brand-500 hover:bg-secondary/20"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <Upload01 className="mx-auto h-12 w-12 text-tertiary" />

                    {selectedFile ? (
                        <div className="mt-2">
                            <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
                                <FileCheck02 className="h-4 w-4 text-emerald-600" />
                                {selectedFile.name}
                            </div>
                            <p className="mt-1 text-xs text-tertiary">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    ) : (
                        <p className="mt-2 text-sm text-tertiary">
                            Click to select a file or drag and drop
                        </p>
                    )}

                    <p className="mt-2 text-xs text-tertiary">
                        JSON format (max 10MB)
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div role="alert" aria-live="assertive" className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" aria-hidden="true" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <Button color="secondary" onClick={onClose} isDisabled={isUploading}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onClick={handleUpload}
                        isDisabled={!selectedFile || isUploading}
                        iconLeading={Upload01}
                    >
                        {isUploading ? 'Importing...' : 'Import'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Modal, ModalOverlay, Dialog } from '@/components/application/modals/modal';
import {
    Clock,
    Download03,
    RefreshCcw01,
    FileCheck02,
    Edit05,
    Share07,
    X,
} from '@untitledui/icons';

interface ResumeSnapshot {
    id: string;
    resumeId: string;
    data: string;
    changeType: string;
    createdAt: string;
}

interface VersionHistoryModalProps {
    resumeId: string;
    isOpen: boolean;
    onClose: () => void;
    onRestore?: (snapshotId: string) => void;
}

export function VersionHistoryModal({
    resumeId,
    isOpen,
    onClose,
    onRestore,
}: VersionHistoryModalProps) {
    const [snapshots, setSnapshots] = useState<ResumeSnapshot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRestoring, setIsRestoring] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchSnapshots();
        }
    }, [isOpen, resumeId]);

    const fetchSnapshots = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/resumes/${resumeId}/versions`);
            if (response.ok) {
                const data = await response.json();
                setSnapshots(data.snapshots || []);
            }
        } catch (error) {
            console.error('Failed to fetch version history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async (snapshotId: string) => {
        if (!confirm('Are you sure you want to restore this version? This will replace your current resume.')) {
            return;
        }

        try {
            setIsRestoring(snapshotId);
            const response = await fetch(
                `/api/resumes/${resumeId}/snapshots/${snapshotId}/restore`,
                {
                    method: 'POST',
                }
            );

            if (response.ok) {
                if (onRestore) {
                    onRestore(snapshotId);
                }
                // Refresh the page to show updated resume
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to restore snapshot:', error);
            alert('Failed to restore version. Please try again.');
        } finally {
            setIsRestoring(null);
        }
    };

    const handleDownload = async (snapshotId: string) => {
        try {
            const response = await fetch(`/api/resumes/${resumeId}/export`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    format: 'pdf',
                    snapshotId,
                }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `resume-version-${new Date().toISOString().split('T')[0]}.pdf`;
                link.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Failed to download snapshot:', error);
        }
    };

    const getChangeTypeIcon = (changeType: string) => {
        switch (changeType) {
            case 'create':
                return <FileCheck02 className="h-4 w-4 text-brand-600" />;
            case 'update':
                return <Edit05 className="h-4 w-4 text-blue-600" />;
            case 'export':
                return <Download03 className="h-4 w-4 text-emerald-600" />;
            case 'share':
                return <Share07 className="h-4 w-4 text-purple-600" />;
            default:
                return <Clock className="h-4 w-4 text-secondary" />;
        }
    };

    const getChangeTypeLabel = (changeType: string) => {
        switch (changeType) {
            case 'create':
                return 'Created';
            case 'update':
                return 'Updated';
            case 'export':
                return 'Exported';
            case 'share':
                return 'Shared';
            case 'auto-save':
                return 'Auto-saved';
            default:
                return 'Modified';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onClose}>
            <Modal className="max-w-3xl">
                <Dialog>
                    <div className="rounded-2xl bg-primary shadow-2xl ring-1 ring-secondary">
                        {/* Header */}
                        <div className="border-b border-secondary p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-6 w-6 text-brand-600" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-primary">
                                            Version History
                                        </h2>
                                        <p className="text-sm text-tertiary">
                                            View and restore previous versions of your resume
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
                        <div className="max-h-[600px] overflow-y-auto p-6">
                            {isLoading ? (
                                <div className="py-12 text-center">
                                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-brand-600" />
                                    <p className="text-sm text-tertiary">Loading version history...</p>
                                </div>
                            ) : snapshots.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-secondary bg-secondary/10 p-12 text-center">
                                    <Clock className="mx-auto mb-3 h-12 w-12 text-tertiary" />
                                    <p className="text-sm text-tertiary">
                                        No version history available yet
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-[15px] top-0 bottom-0 w-px bg-secondary" />

                                    {/* Timeline items */}
                                    <div className="space-y-6">
                                        {snapshots.map((snapshot, index) => (
                                            <div key={snapshot.id} className="relative pl-10">
                                                {/* Timeline dot */}
                                                <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-secondary bg-primary">
                                                    {getChangeTypeIcon(snapshot.changeType)}
                                                </div>

                                                {/* Content */}
                                                <div className="rounded-lg border border-secondary bg-primary p-4 transition hover:border-brand-300 hover:shadow-md">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-primary">
                                                                    {getChangeTypeLabel(snapshot.changeType)}
                                                                </span>
                                                                {index === 0 && (
                                                                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                                                                        Current
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="mt-1 text-sm text-tertiary">
                                                                {formatDate(snapshot.createdAt)}
                                                            </p>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            {index !== 0 && (
                                                                <>
                                                                    <Button
                                                                        color="secondary"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleRestore(snapshot.id)
                                                                        }
                                                                        isDisabled={
                                                                            isRestoring === snapshot.id
                                                                        }
                                                                        iconLeading={RefreshCcw01}
                                                                    >
                                                                        {isRestoring === snapshot.id
                                                                            ? 'Restoring...'
                                                                            : 'Restore'}
                                                                    </Button>
                                                                    <Button
                                                                        color="link-gray"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleDownload(snapshot.id)
                                                                        }
                                                                        iconLeading={Download03}
                                                                        aria-label="Download"
                                                                    />
                                                                </>
                                                            )}
                                                            {index === 0 && (
                                                                <Button
                                                                    color="link-gray"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleDownload(snapshot.id)
                                                                    }
                                                                    iconLeading={Download03}
                                                                >
                                                                    Download
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-secondary p-6">
                            <div className="flex justify-end">
                                <Button color="primary" onClick={onClose}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}

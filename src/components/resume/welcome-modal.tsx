'use client';

import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, Dialog } from '@/components/application/modals/modal';
import { Button } from '@/components/base/buttons/button';
import { FilePlus02, Upload01, Stars01 } from '@untitledui/icons';

interface WelcomeModalProps {
    onStartFromScratch: () => void;
    onImportResume: () => void;
}

const ONBOARDING_KEY = 'dale_onboarding_completed';

export function WelcomeModal({ onStartFromScratch, onImportResume }: WelcomeModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has completed onboarding
        const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);

        if (!hasCompletedOnboarding) {
            // Show modal after a short delay for better UX
            setTimeout(() => setIsOpen(true), 500);
        }
    }, []);

    const handleClose = (skipTour: boolean = false) => {
        if (skipTour) {
            localStorage.setItem(ONBOARDING_KEY, 'true');
        }
        setIsOpen(false);
    };

    const handleStartFromScratch = () => {
        handleClose();
        onStartFromScratch();
    };

    const handleImport = () => {
        handleClose();
        onImportResume();
    };

    // Only render when open to avoid blocking clicks
    if (!isOpen) return null;

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={() => handleClose(false)}>
            <Modal className="max-w-2xl">
                <Dialog>
                    <div className="rounded-2xl bg-primary p-8 shadow-2xl ring-1 ring-secondary">
                <div className="text-center">
                    {/* Icon */}
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
                        <Stars01 className="h-8 w-8 text-brand-600" />
                    </div>

                    {/* Title */}
                    <h2 className="text-center text-2xl font-semibold text-primary">
                        Welcome to Resume Builder
                    </h2>
                    <p className="mt-3 text-center text-base text-secondary">
                        Create ATS-optimized resumes in minutes with professional templates and
                        AI-powered suggestions
                    </p>

                    {/* Action Cards */}
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Start from Scratch */}
                        <button
                            onClick={handleStartFromScratch}
                            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-secondary bg-primary p-6 transition-all hover:border-brand-200 hover:bg-brand-50/50 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 transition-colors group-hover:bg-brand-100">
                                <FilePlus02 className="h-6 w-6 text-brand-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-primary">Start from Scratch</h3>
                                <p className="mt-1 text-sm text-tertiary">
                                    Build your resume step by step
                                </p>
                            </div>
                        </button>

                        {/* Import Resume */}
                        <button
                            onClick={handleImport}
                            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-secondary bg-primary p-6 transition-all hover:border-purple-200 hover:bg-purple-50/50 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 transition-colors group-hover:bg-purple-100">
                                <Upload01 className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-primary">Import Resume</h3>
                                <p className="mt-1 text-sm text-tertiary">
                                    Upload existing PDF or DOCX
                                </p>
                            </div>
                        </button>
                    </div>

                    {/* Skip Tour */}
                    <div className="mt-6">
                        <Button
                            color="link-gray"
                            size="sm"
                            onClick={() => handleClose(true)}
                        >
                            Don&apos;t show this again
                        </Button>
                    </div>
                </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}

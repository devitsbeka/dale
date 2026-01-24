'use client';

import { useState, useEffect } from 'react';
import {
  X,
  ArrowUpRight,
  FileCheck02,
  CheckCircle,
  AlertCircle,
  Loading01,
  LinkExternal01,
} from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import type { Job, ApplyFormData } from '@/types/job';

interface Resume {
  id: string;
  name: string;
  updatedAt: string;
  status: string;
}

interface ApplyModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: ApplyFormData) => Promise<{ success: boolean; error?: string }>;
}

export function ApplyModal({ job, isOpen, onClose, onApply }: ApplyModalProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchResumes();
      setSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  const fetchResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const response = await fetch('/api/resumes');
      if (response.ok) {
        const data = await response.json();
        const fetchedResumes = data.resumes || data || [];
        setResumes(fetchedResumes);
        // Auto-select the first resume if available
        if (fetchedResumes.length > 0 && !selectedResumeId) {
          setSelectedResumeId(fetchedResumes[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedResumeId) {
      setError('Please select a resume');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // First, open the external application URL
      window.open(job.applyUrl, '_blank');

      // Then track the application
      const result = await onApply({
        resumeId: selectedResumeId,
        coverLetter: coverLetter || undefined,
        notes: notes || undefined,
        appliedVia: 'direct',
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to track application');
      }
    } catch (err) {
      setError('An error occurred while tracking your application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickApply = () => {
    window.open(job.applyUrl, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-primary shadow-xl">
        {/* Success State */}
        {success ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success-100">
              <CheckCircle className="size-8 text-success-600" />
            </div>
            <h3 className="text-xl font-semibold text-primary">Application Tracked!</h3>
            <p className="mt-2 text-sm text-secondary">
              We&apos;ve opened the application page and saved this to your applications.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-secondary p-6">
              <div className="flex gap-4">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="size-12 rounded-lg border border-secondary object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-lg bg-gray-100 text-lg font-bold text-gray-600">
                    {job.company.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-primary">Apply to {job.title}</h3>
                  <p className="text-sm text-secondary">{job.company}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {/* Resume Selection */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-primary">
                  Select Resume <span className="text-red-500">*</span>
                </label>

                {isLoadingResumes ? (
                  <div className="flex items-center justify-center py-8">
                    <Loading01 className="size-6 animate-spin text-brand-600" />
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-secondary bg-gray-50 p-6 text-center">
                    <FileCheck02 className="mx-auto size-8 text-gray-400" />
                    <p className="mt-2 text-sm text-secondary">No resumes found</p>
                    <Button
                      color="primary"
                      size="sm"
                      className="mt-3"
                      onClick={() => window.open('/resumes/new', '_blank')}
                    >
                      Create Resume
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resumes.map((resume) => (
                      <label
                        key={resume.id}
                        className={cx(
                          'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
                          selectedResumeId === resume.id
                            ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                            : 'border-secondary hover:border-brand-300 hover:bg-gray-50'
                        )}
                      >
                        <input
                          type="radio"
                          name="resume"
                          value={resume.id}
                          checked={selectedResumeId === resume.id}
                          onChange={() => setSelectedResumeId(resume.id)}
                          className="size-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-primary">{resume.name}</p>
                          <p className="text-xs text-tertiary">
                            Updated {new Date(resume.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {resume.status === 'draft' ? (
                          <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
                            Draft
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                            Complete
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-primary">
                  Cover Letter <span className="text-tertiary">(optional)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write a brief cover letter to introduce yourself..."
                  rows={4}
                  className="w-full rounded-lg border border-secondary bg-primary p-3 text-sm text-primary placeholder:text-tertiary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-primary">
                  Personal Notes <span className="text-tertiary">(private)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes for yourself about this application..."
                  rows={2}
                  className="w-full rounded-lg border border-secondary bg-primary p-3 text-sm text-primary placeholder:text-tertiary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="size-5 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-secondary bg-gray-50 p-4">
              <Button color="link-gray" size="md" onClick={handleQuickApply} iconTrailing={LinkExternal01}>
                Quick Apply (Skip tracking)
              </Button>

              <div className="flex gap-2">
                <Button color="secondary" size="md" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  size="md"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  isDisabled={!selectedResumeId || isLoadingResumes}
                  iconTrailing={ArrowUpRight}
                >
                  Apply & Track
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ApplyModal;

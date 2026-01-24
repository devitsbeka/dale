'use client';

import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Select } from '@/components/base/select/select';
import {
    Plus,
    FilePlus02,
    FileCheck02,
    Calendar,
    Upload01,
    Share07,
    SearchLg,
    FilterLines,
    Trash01,
    Download03,
    DotsVertical,
    Clock,
} from '@untitledui/icons';
import { ResumeImportDialog } from '@/components/resume/resume-import-dialog';
import { ShareDialog } from '@/components/resume/share-dialog';
import { WelcomeModal } from '@/components/resume/welcome-modal';
import { VersionHistoryModal } from '@/components/resume/version-history-modal';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ResumeData } from '@/types/resume';

interface Resume {
    id: string;
    name: string;
    updatedAt: string;
    status: string;
}

export default function ResumesPage() {
    const router = useRouter();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [filteredResumes, setFilteredResumes] = useState<Resume[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
    const [selectedResumes, setSelectedResumes] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        fetchResumes();
    }, []);

    useEffect(() => {
        // Filter resumes based on search and status
        let filtered = resumes;

        if (searchQuery) {
            filtered = filtered.filter((resume) =>
                resume.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((resume) => resume.status === statusFilter);
        }

        setFilteredResumes(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [resumes, searchQuery, statusFilter]);

    const fetchResumes = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/resumes');
            if (response.ok) {
                const data = await response.json();
                // API returns { resumes, pagination }
                setResumes(data.resumes || data);
            }
        } catch (error) {
            console.error('Failed to fetch resumes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNew = () => {
        router.push('/resumes/new');
    };

    const handleOpenResume = (id: string) => {
        router.push(`/resumes/new?id=${id}`);
    };

    const handleImport = (data: Partial<ResumeData>) => {
        // Store imported data in localStorage temporarily
        localStorage.setItem('dale_imported_resume', JSON.stringify(data));
        // Navigate to resume builder with imported data
        router.push('/resumes/new?import=true');
    };

    const handleToggleSelect = (resumeId: string) => {
        const newSelected = new Set(selectedResumes);
        if (newSelected.has(resumeId)) {
            newSelected.delete(resumeId);
        } else {
            newSelected.add(resumeId);
        }
        setSelectedResumes(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedResumes.size === paginatedResumes.length) {
            setSelectedResumes(new Set());
        } else {
            setSelectedResumes(new Set(paginatedResumes.map((r) => r.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (
            !confirm(
                `Are you sure you want to delete ${selectedResumes.size} resume(s)? This cannot be undone.`
            )
        ) {
            return;
        }

        try {
            await Promise.all(
                Array.from(selectedResumes).map((id) =>
                    fetch(`/api/resumes/${id}`, { method: 'DELETE' })
                )
            );
            await fetchResumes();
            setSelectedResumes(new Set());
        } catch (error) {
            console.error('Failed to delete resumes:', error);
            alert('Failed to delete some resumes. Please try again.');
        }
    };

    const handleBulkExport = async () => {
        try {
            for (const id of Array.from(selectedResumes)) {
                const response = await fetch(`/api/resumes/${id}/export`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ format: 'pdf' }),
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `resume-${id}.pdf`;
                    link.click();
                    window.URL.revokeObjectURL(url);
                }
            }
        } catch (error) {
            console.error('Failed to export resumes:', error);
        }
    };

    const handleDuplicate = async (resumeId: string) => {
        try {
            const response = await fetch(`/api/resumes/${resumeId}/duplicate`, {
                method: 'POST',
            });
            if (response.ok) {
                await fetchResumes();
            }
        } catch (error) {
            console.error('Failed to duplicate resume:', error);
        }
    };

    const handleDelete = async (resumeId: string) => {
        if (!confirm('Are you sure you want to delete this resume? This cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/resumes/${resumeId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                await fetchResumes();
            }
        } catch (error) {
            console.error('Failed to delete resume:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Pagination
    const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);
    const paginatedResumes = filteredResumes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex min-h-screen flex-col bg-primary">
            {/* Header */}
            <div className="border-b border-secondary bg-primary">
                <div className="mx-auto max-w-7xl px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-primary">My Resumes</h1>
                            <p className="mt-2 text-sm text-tertiary">
                                Create and manage your professional resumes
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                color="secondary"
                                size="lg"
                                onClick={() => setShowImportDialog(true)}
                                iconLeading={Upload01}
                            >
                                Import Resume
                            </Button>
                            <Button
                                color="primary"
                                size="lg"
                                onClick={handleCreateNew}
                                iconLeading={Plus}
                            >
                                Create New Resume
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="border-b border-secondary bg-primary">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="flex-1 min-w-[250px]">
                            <div className="relative">
                                <SearchLg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-tertiary" />
                                <Input
                                    type="text"
                                    placeholder="Search resumes..."
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="w-48">
                            <Select
                                value={statusFilter}
                                onChange={(value) => setStatusFilter(value as string)}
                            >
                                <option value="all">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="complete">Complete</option>
                                <option value="archived">Archived</option>
                            </Select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex gap-1 rounded-lg border border-secondary p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded px-3 py-1.5 text-sm transition ${
                                    viewMode === 'grid'
                                        ? 'bg-brand-600 text-white'
                                        : 'text-secondary hover:bg-secondary'
                                }`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`rounded px-3 py-1.5 text-sm transition ${
                                    viewMode === 'table'
                                        ? 'bg-brand-600 text-white'
                                        : 'text-secondary hover:bg-secondary'
                                }`}
                            >
                                Table
                            </button>
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedResumes.size > 0 && (
                        <div className="mt-4 flex items-center gap-3 rounded-lg bg-brand-50 p-3">
                            <span className="text-sm font-medium text-brand-700">
                                {selectedResumes.size} selected
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    color="secondary"
                                    size="sm"
                                    onClick={handleBulkExport}
                                    iconLeading={Download03}
                                >
                                    Export All
                                </Button>
                                <Button
                                    color="tertiary-destructive"
                                    size="sm"
                                    onClick={handleBulkDelete}
                                    iconLeading={Trash01}
                                >
                                    Delete All
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse rounded-xl border border-secondary bg-primary p-6"
                            >
                                <div className="h-6 w-3/4 rounded bg-secondary"></div>
                                <div className="mt-4 h-4 w-1/2 rounded bg-secondary"></div>
                                <div className="mt-6 h-10 rounded bg-secondary"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredResumes.length === 0 ? (
                    <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-secondary bg-primary">
                        <div className="text-center">
                            <SearchLg className="mx-auto h-12 w-12 text-tertiary" />
                            <h3 className="mt-4 text-lg font-semibold text-primary">
                                No resumes found
                            </h3>
                            <p className="mt-2 text-sm text-tertiary">
                                {searchQuery
                                    ? `No resumes match "${searchQuery}"`
                                    : 'Try adjusting your filters'}
                            </p>
                        </div>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-secondary bg-primary">
                        <div className="text-center">
                            <FilePlus02 className="mx-auto h-12 w-12 text-tertiary" />
                            <h3 className="mt-4 text-lg font-semibold text-primary">
                                No resumes yet
                            </h3>
                            <p className="mt-2 text-sm text-tertiary">
                                Get started by creating your first resume
                            </p>
                            <Button
                                color="primary"
                                size="lg"
                                onClick={handleCreateNew}
                                iconLeading={Plus}
                                className="mt-6"
                            >
                                Create New Resume
                            </Button>
                        </div>
                    </div>
                ) : viewMode === 'table' ? (
                    <>
                        <div className="overflow-x-auto rounded-lg border border-secondary">
                            <table className="w-full">
                                <thead className="bg-secondary/30">
                                    <tr>
                                        <th className="p-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedResumes.size === paginatedResumes.length &&
                                                    paginatedResumes.length > 0
                                                }
                                                onChange={handleSelectAll}
                                                className="h-4 w-4 rounded border-secondary"
                                            />
                                        </th>
                                        <th className="p-3 text-left text-sm font-semibold text-primary">
                                            Name
                                        </th>
                                        <th className="p-3 text-left text-sm font-semibold text-primary">
                                            Status
                                        </th>
                                        <th className="p-3 text-left text-sm font-semibold text-primary">
                                            Updated
                                        </th>
                                        <th className="p-3 text-right text-sm font-semibold text-primary">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedResumes.map((resume) => (
                                        <tr
                                            key={resume.id}
                                            className="border-t border-secondary hover:bg-secondary/10"
                                        >
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedResumes.has(resume.id)}
                                                    onChange={() => handleToggleSelect(resume.id)}
                                                    className="h-4 w-4 rounded border-secondary"
                                                />
                                            </td>
                                            <td
                                                className="cursor-pointer p-3 text-sm font-medium text-primary"
                                                onClick={() => handleOpenResume(resume.id)}
                                            >
                                                {resume.name}
                                            </td>
                                            <td className="p-3">
                                                {resume.status === 'draft' ? (
                                                    <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                                                        Draft
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                        Complete
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3 text-sm text-tertiary">
                                                {formatDate(resume.updatedAt)}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        color="secondary"
                                                        size="sm"
                                                        onClick={(e: React.MouseEvent) => {
                                                            e.stopPropagation();
                                                            handleOpenResume(resume.id);
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <div className="relative">
                                                        <Button
                                                            color="link-gray"
                                                            size="sm"
                                                            onClick={(e: React.MouseEvent) => {
                                                                e.stopPropagation();
                                                                setOpenDropdown(
                                                                    openDropdown === resume.id
                                                                        ? null
                                                                        : resume.id
                                                                );
                                                            }}
                                                            iconLeading={DotsVertical}
                                                            aria-label="More actions"
                                                        />
                                                        {openDropdown === resume.id && (
                                                            <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-secondary bg-primary py-1 shadow-lg">
                                                                <button
                                                                    className="w-full px-4 py-2 text-left text-sm text-secondary hover:bg-secondary"
                                                                    onClick={() => {
                                                                        setSelectedResumeId(resume.id);
                                                                        setShowShareDialog(true);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                >
                                                                    <Share07 className="mr-2 inline h-4 w-4" />
                                                                    Share
                                                                </button>
                                                                <button
                                                                    className="w-full px-4 py-2 text-left text-sm text-secondary hover:bg-secondary"
                                                                    onClick={() => {
                                                                        setSelectedResumeId(resume.id);
                                                                        setShowVersionHistory(true);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                >
                                                                    <Clock className="mr-2 inline h-4 w-4" />
                                                                    Version History
                                                                </button>
                                                                <button
                                                                    className="w-full px-4 py-2 text-left text-sm text-secondary hover:bg-secondary"
                                                                    onClick={() => {
                                                                        handleDuplicate(resume.id);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                >
                                                                    <FilePlus02 className="mr-2 inline h-4 w-4" />
                                                                    Duplicate
                                                                </button>
                                                                <hr className="my-1 border-secondary" />
                                                                <button
                                                                    className="w-full px-4 py-2 text-left text-sm text-error-600 hover:bg-error-50"
                                                                    onClick={() => {
                                                                        handleDelete(resume.id);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                >
                                                                    <Trash01 className="mr-2 inline h-4 w-4" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm text-tertiary">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                    {Math.min(currentPage * itemsPerPage, filteredResumes.length)} of{' '}
                                    {filteredResumes.length} resumes
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        isDisabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (page) => (
                                            <Button
                                                key={page}
                                                color={page === currentPage ? 'primary' : 'secondary'}
                                                size="sm"
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </Button>
                                        )
                                    )}
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        isDisabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {paginatedResumes.map((resume) => (
                            <div
                                key={resume.id}
                                className="group cursor-pointer rounded-xl border border-secondary bg-primary p-6 transition-all hover:border-brand-500 hover:shadow-md"
                                onClick={() => handleOpenResume(resume.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-lg font-semibold text-primary">
                                            {resume.name}
                                        </h3>
                                        <div className="mt-2 flex items-center gap-2 text-sm text-tertiary">
                                            <Calendar className="h-4 w-4" />
                                            <span>Updated {formatDate(resume.updatedAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {resume.status === 'draft' ? (
                                            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                                                Draft
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                                Complete
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-2">
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            handleOpenResume(resume.id);
                                        }}
                                        iconLeading={FileCheck02}
                                        className="flex-1"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        color="link-gray"
                                        size="sm"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            setSelectedResumeId(resume.id);
                                            setShowShareDialog(true);
                                        }}
                                        iconLeading={Share07}
                                        className="flex-1"
                                    >
                                        Share
                                    </Button>
                                </div>
                            </div>
                        ))}
                        </div>

                        {/* Pagination for Grid View */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm text-tertiary">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                    {Math.min(currentPage * itemsPerPage, filteredResumes.length)} of{' '}
                                    {filteredResumes.length} resumes
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        isDisabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (page) => (
                                            <Button
                                                key={page}
                                                color={page === currentPage ? 'primary' : 'secondary'}
                                                size="sm"
                                                onClick={() => setCurrentPage(page)}
                                            >
                                                {page}
                                            </Button>
                                        )
                                    )}
                                    <Button
                                        color="secondary"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        isDisabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Import Dialog */}
            {showImportDialog && (
                <ResumeImportDialog
                    onImport={handleImport}
                    onClose={() => setShowImportDialog(false)}
                />
            )}

            {/* Share Dialog */}
            {showShareDialog && selectedResumeId && (
                <ShareDialog
                    resumeId={selectedResumeId}
                    onClose={() => {
                        setShowShareDialog(false);
                        setSelectedResumeId(null);
                    }}
                />
            )}

            {/* Welcome Modal - shows on first visit */}
            <WelcomeModal
                onStartFromScratch={handleCreateNew}
                onImportResume={() => setShowImportDialog(true)}
            />

            {/* Version History Modal */}
            {showVersionHistory && selectedResumeId && (
                <VersionHistoryModal
                    resumeId={selectedResumeId}
                    isOpen={showVersionHistory}
                    onClose={() => {
                        setShowVersionHistory(false);
                        setSelectedResumeId(null);
                    }}
                />
            )}
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Label } from '@/components/base/input/label';
import { Select } from '@/components/base/select/select';
import { Checkbox } from '@/components/base/checkbox/checkbox';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { generateQRCode } from '@/lib/qr-code/generator';
import {
    Share07,
    Copy01,
    Trash01,
    Lock01,
    Calendar,
    Eye,
    CheckCircle,
    QrCode01,
    Download03,
    Mail01,
    Link01,
    MessageChatSquare,
} from '@untitledui/icons';

interface ShareLink {
    id: string;
    token: string;
    password: string | null;
    expiresAt: Date | null;
    viewCount: number;
    maxViews: number | null;
    allowComments: boolean;
    createdAt: Date;
}

interface ShareDialogProps {
    resumeId: string;
    onClose: () => void;
}

export function ShareDialog({ resumeId, onClose }: ShareDialogProps) {
    const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [copiedToken, setCopiedToken] = useState<string | null>(null);
    const [qrCodeDataURL, setQrCodeDataURL] = useState<string | null>(null);
    const [showQRCode, setShowQRCode] = useState<string | null>(null);

    // Form state
    const [password, setPassword] = useState('');
    const [usePassword, setUsePassword] = useState(false);
    const [expiresIn, setExpiresIn] = useState<string>('never');
    const [maxViews, setMaxViews] = useState<string>('');
    const [useMaxViews, setUseMaxViews] = useState(false);

    // Focus trap for accessibility
    const dialogRef = useFocusTrap<HTMLDivElement>(true);

    useEffect(() => {
        fetchShareLinks();
    }, [resumeId]);

    const fetchShareLinks = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/resumes/${resumeId}/share`);
            if (response.ok) {
                const data = await response.json();
                setShareLinks(data.shareLinks);
            }
        } catch (error) {
            console.error('Failed to fetch share links:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateLink = async () => {
        setIsCreating(true);

        try {
            const response = await fetch(`/api/resumes/${resumeId}/share`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: usePassword ? password : undefined,
                    expiresInDays: expiresIn === 'never' ? null : parseInt(expiresIn),
                    maxViews: useMaxViews && maxViews ? parseInt(maxViews) : null,
                    allowComments: false,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setShareLinks([data.shareLink, ...shareLinks]);

                // Copy URL to clipboard
                await navigator.clipboard.writeText(data.shareUrl);
                setCopiedToken(data.shareLink.token);

                // Reset form
                setPassword('');
                setUsePassword(false);
                setExpiresIn('never');
                setMaxViews('');
                setUseMaxViews(false);
            }
        } catch (error) {
            console.error('Failed to create share link:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleCopyLink = async (token: string) => {
        const url = `${window.location.origin}/share/${token}`;
        await navigator.clipboard.writeText(url);
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    const handleDeleteLink = async (linkId: string) => {
        try {
            const response = await fetch(`/api/resumes/${resumeId}/share/${linkId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setShareLinks(shareLinks.filter((link) => link.id !== linkId));
            }
        } catch (error) {
            console.error('Failed to delete share link:', error);
        }
    };

    const handleGenerateQRCode = async (token: string) => {
        const url = `${window.location.origin}/share/${token}`;
        const qrCode = await generateQRCode(url);
        setQrCodeDataURL(qrCode);
        setShowQRCode(token);
    };

    const handleDownloadQRCode = () => {
        if (!qrCodeDataURL) return;

        const link = document.createElement('a');
        link.href = qrCodeDataURL;
        link.download = 'resume-qr-code.png';
        link.click();
    };

    const handleShareViaEmail = (token: string) => {
        const url = `${window.location.origin}/share/${token}`;
        const subject = encodeURIComponent('Check out my resume');
        const body = encodeURIComponent(`I'd like to share my resume with you:\n\n${url}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };

    const handleShareViaLinkedIn = (token: string) => {
        const url = `${window.location.origin}/share/${token}`;
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            '_blank'
        );
    };

    const handleShareViaTwitter = (token: string) => {
        const url = `${window.location.origin}/share/${token}`;
        const text = encodeURIComponent('Check out my resume');
        window.open(
            `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
            '_blank'
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="share-dialog-title">
            <div ref={dialogRef} className="w-full max-w-2xl rounded-lg bg-primary shadow-xl">
                {/* Header */}
                <div className="border-b border-secondary p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Share07 className="h-6 w-6 text-brand-500" />
                            <div>
                                <h2 id="share-dialog-title" className="text-xl font-semibold text-primary">Share Resume</h2>
                                <p className="text-sm text-tertiary">
                                    Create secure links to share your resume
                                </p>
                            </div>
                        </div>
                        <Button color="link-gray" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[600px] overflow-y-auto p-6">
                    {/* Create new link form */}
                    <div className="mb-6 rounded-lg border border-secondary bg-secondary/10 p-4">
                        <h3 className="mb-4 font-semibold text-primary">Create New Share Link</h3>

                        <div className="space-y-4">
                            {/* Password protection */}
                            <div>
                                <Checkbox
                                    isSelected={usePassword}
                                    onChange={setUsePassword}
                                >
                                    Password protect this link
                                </Checkbox>
                                {usePassword && (
                                    <div className="mt-2">
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={setPassword}
                                            placeholder="Enter password"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Expiration */}
                            <div>
                                <Label>Link expiration</Label>
                                <Select
                                    value={expiresIn}
                                    onChange={(value) => setExpiresIn(value as string)}
                                >
                                    <option value="never">Never expires</option>
                                    <option value="7">7 days</option>
                                    <option value="30">30 days</option>
                                    <option value="90">90 days</option>
                                </Select>
                            </div>

                            {/* Max views */}
                            <div>
                                <Checkbox
                                    isSelected={useMaxViews}
                                    onChange={setUseMaxViews}
                                >
                                    Limit number of views
                                </Checkbox>
                                {useMaxViews && (
                                    <div className="mt-2">
                                        <Input
                                            type="number"
                                            value={maxViews}
                                            onChange={setMaxViews}
                                            placeholder="Max views (e.g., 100)"
                                        />
                                    </div>
                                )}
                            </div>

                            <Button
                                color="primary"
                                onClick={handleCreateLink}
                                isDisabled={isCreating || (usePassword && !password)}
                                iconLeading={Share07}
                                className="w-full"
                            >
                                {isCreating ? 'Creating...' : 'Create Share Link'}
                            </Button>
                        </div>
                    </div>

                    {/* Existing share links */}
                    <div>
                        <h3 className="mb-3 font-semibold text-primary">Active Share Links</h3>

                        {isLoading ? (
                            <div className="py-8 text-center text-sm text-tertiary">
                                Loading share links...
                            </div>
                        ) : shareLinks.length === 0 ? (
                            <div className="rounded-lg border border-secondary bg-secondary/10 p-8 text-center">
                                <p className="text-sm text-tertiary">
                                    No share links yet. Create one above to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {shareLinks.map((link) => (
                                    <div
                                        key={link.id}
                                        className="rounded-lg border border-secondary bg-primary p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <code className="rounded bg-secondary/50 px-2 py-1 text-xs">
                                                        /share/{link.token}
                                                    </code>
                                                    {link.password && (
                                                        <Lock01 className="h-4 w-4 text-yellow-600" />
                                                    )}
                                                </div>

                                                <div className="mt-2 flex flex-wrap gap-3 text-xs text-tertiary">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {link.viewCount} {link.maxViews ? `/ ${link.maxViews}` : ''} views
                                                    </span>
                                                    {link.expiresAt && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Expires {new Date(link.expiresAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    <span>
                                                        Created {new Date(link.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {/* Social sharing buttons */}
                                                <div className="mt-3 flex gap-2">
                                                    <p className="text-xs text-tertiary">Share via:</p>
                                                    <button
                                                        onClick={() => handleShareViaEmail(link.token)}
                                                        className="text-secondary hover:text-brand-600"
                                                        aria-label="Share via Email"
                                                    >
                                                        <Mail01 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleShareViaLinkedIn(link.token)}
                                                        className="text-secondary hover:text-brand-600"
                                                        aria-label="Share on LinkedIn"
                                                    >
                                                        <Link01 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleShareViaTwitter(link.token)}
                                                        className="text-secondary hover:text-brand-600"
                                                        aria-label="Share on Twitter"
                                                    >
                                                        <MessageChatSquare className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    color="secondary"
                                                    size="sm"
                                                    onClick={() => handleCopyLink(link.token)}
                                                    iconLeading={copiedToken === link.token ? CheckCircle : Copy01}
                                                >
                                                    {copiedToken === link.token ? 'Copied!' : 'Copy'}
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    size="sm"
                                                    onClick={() => handleGenerateQRCode(link.token)}
                                                    iconLeading={QrCode01}
                                                    aria-label="QR Code"
                                                />
                                                <Button
                                                    color="tertiary-destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteLink(link.id)}
                                                    iconLeading={Trash01}
                                                    aria-label="Delete"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* QR Code Modal */}
                {showQRCode && qrCodeDataURL && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-sm rounded-lg bg-primary p-6 shadow-xl">
                            <h3 className="mb-4 text-center text-lg font-semibold text-primary">
                                QR Code
                            </h3>
                            <div className="flex justify-center">
                                <img
                                    src={qrCodeDataURL}
                                    alt="QR Code"
                                    className="rounded-lg border-2 border-secondary"
                                />
                            </div>
                            <p className="mt-4 text-center text-sm text-tertiary">
                                Scan this code to view the resume
                            </p>
                            <div className="mt-6 flex gap-2">
                                <Button
                                    color="secondary"
                                    onClick={handleDownloadQRCode}
                                    iconLeading={Download03}
                                    className="flex-1"
                                >
                                    Download
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={() => setShowQRCode(null)}
                                    className="flex-1"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

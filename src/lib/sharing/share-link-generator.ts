import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

export interface ShareLinkOptions {
    password?: string;
    expiresInDays?: number | null; // null = never expires
    maxViews?: number | null; // null = unlimited
    allowComments?: boolean;
}

export interface ShareLinkData {
    token: string;
    passwordHash?: string;
    expiresAt?: Date;
    maxViews?: number;
    allowComments: boolean;
}

/**
 * Generate a unique share token
 */
export function generateShareToken(): string {
    return nanoid(16); // 16 character URL-safe token
}

/**
 * Hash password for storage
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Calculate expiration date from days
 */
export function calculateExpirationDate(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

/**
 * Create share link data from options
 */
export async function createShareLinkData(
    options: ShareLinkOptions
): Promise<ShareLinkData> {
    const token = generateShareToken();

    const data: ShareLinkData = {
        token,
        allowComments: options.allowComments || false,
    };

    // Hash password if provided
    if (options.password) {
        data.passwordHash = await hashPassword(options.password);
    }

    // Calculate expiration if provided
    if (options.expiresInDays !== null && options.expiresInDays !== undefined) {
        data.expiresAt = calculateExpirationDate(options.expiresInDays);
    }

    // Set max views if provided
    if (options.maxViews !== null && options.maxViews !== undefined) {
        data.maxViews = options.maxViews;
    }

    return data;
}

/**
 * Check if share link is still valid
 */
export function isShareLinkValid(shareLink: {
    expiresAt?: Date | null;
    viewCount: number;
    maxViews?: number | null;
}): boolean {
    // Check expiration
    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
        return false;
    }

    // Check max views
    if (shareLink.maxViews && shareLink.viewCount >= shareLink.maxViews) {
        return false;
    }

    return true;
}

/**
 * Generate full share URL
 */
export function generateShareUrl(token: string, baseUrl?: string): string {
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${base}/share/${token}`;
}

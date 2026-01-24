import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { createShareLinkData, generateShareUrl } from '@/lib/sharing/share-link-generator';

// GET /api/resumes/:id/share - List all share links for a resume
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const shareLinks = await prisma.shareLink.findMany({
            where: { resumeId: id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ shareLinks });
    } catch (error) {
        console.error('Error fetching share links:', error);
        return NextResponse.json(
            { error: 'Failed to fetch share links' },
            { status: 500 }
        );
    }
}

// POST /api/resumes/:id/share - Create a new share link
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const {
            password,
            expiresInDays,
            maxViews,
            allowComments = false,
        } = body;

        // Create share link data
        const shareLinkData = await createShareLinkData({
            password,
            expiresInDays: expiresInDays || null,
            maxViews: maxViews || null,
            allowComments,
        });

        // Save to database
        const shareLink = await prisma.shareLink.create({
            data: {
                resumeId: id,
                token: shareLinkData.token,
                password: shareLinkData.passwordHash,
                expiresAt: shareLinkData.expiresAt,
                maxViews: shareLinkData.maxViews,
                allowComments: shareLinkData.allowComments,
            },
        });

        // Generate full URL
        const baseUrl = request.nextUrl.origin;
        const shareUrl = generateShareUrl(shareLink.token, baseUrl);

        return NextResponse.json({
            shareLink,
            shareUrl,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating share link:', error);
        return NextResponse.json(
            { error: 'Failed to create share link' },
            { status: 500 }
        );
    }
}

// DELETE /api/resumes/:id/share/:shareLinkId - Delete a share link
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const url = new URL(request.url);
        const shareLinkId = url.pathname.split('/').pop();

        if (!shareLinkId) {
            return NextResponse.json(
                { error: 'Share link ID is required' },
                { status: 400 }
            );
        }

        await prisma.shareLink.delete({
            where: {
                id: shareLinkId,
                resumeId: id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting share link:', error);
        return NextResponse.json(
            { error: 'Failed to delete share link' },
            { status: 500 }
        );
    }
}

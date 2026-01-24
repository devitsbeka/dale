import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/templates/custom - List custom templates for user
export async function GET(request: NextRequest) {
    try {
        // In a real app, you'd get userId from session/auth
        // For now, we'll just return all public templates or create a demo user
        const templates = await prisma.customTemplate.findMany({
            where: {
                OR: [
                    { isPublic: true },
                    // Add userId filter when auth is implemented
                ],
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ templates });
    } catch (error) {
        console.error('Error fetching custom templates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch templates' },
            { status: 500 }
        );
    }
}

// POST /api/templates/custom - Create a new custom template
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, config } = body;

        if (!name || !config) {
            return NextResponse.json(
                { error: 'Name and config are required' },
                { status: 400 }
            );
        }

        // For now, create a demo user if none exists
        // In production, you'd use the authenticated user's ID
        let user = await prisma.user.findFirst();

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: 'demo@example.com',
                    name: 'Demo User',
                },
            });
        }

        const template = await prisma.customTemplate.create({
            data: {
                userId: user.id,
                name,
                config: JSON.stringify(config),
                isPublic: false,
            },
        });

        return NextResponse.json({
            success: true,
            templateId: template.id,
            template,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating custom template:', error);
        return NextResponse.json(
            { error: 'Failed to create template' },
            { status: 500 }
        );
    }
}

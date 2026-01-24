import { NextRequest, NextResponse } from 'next/server';
import { importResume, validateFileSize } from '@/lib/import/import-resume';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file size (10MB max)
        if (!validateFileSize(file, 10)) {
            return NextResponse.json(
                { error: 'File size exceeds 10MB limit' },
                { status: 400 }
            );
        }

        // Parse the resume file
        const resumeData = await importResume(file);

        return NextResponse.json({
            success: true,
            data: resumeData,
        });
    } catch (error) {
        console.error('Error importing resume:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to import resume',
            },
            { status: 500 }
        );
    }
}

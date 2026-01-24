// import { parsePDF } from './parsers/pdf-parser';
// import { parseDOCX } from './parsers/docx-parser';
import { parseJSON } from './parsers/json-parser';
import type { ResumeData } from '@/types/resume';

export type SupportedFileType = 'json'; // | 'pdf' | 'docx' - Coming soon

export async function importResume(
    file: File
): Promise<Partial<ResumeData>> {
    const fileType = detectFileType(file);

    if (!fileType) {
        throw new Error('Unsupported file type. Please upload a JSON file.');
    }

    switch (fileType) {
        // TODO: Add PDF and DOCX parsing once ESM compatibility is resolved
        // case 'pdf':
        //     const pdfBuffer = Buffer.from(await file.arrayBuffer());
        //     return await parsePDF(pdfBuffer);

        // case 'docx':
        //     const docxBuffer = Buffer.from(await file.arrayBuffer());
        //     return await parseDOCX(docxBuffer);

        case 'json':
            const jsonText = await file.text();
            return parseJSON(jsonText);

        default:
            throw new Error('Unsupported file type');
    }
}

function detectFileType(file: File): SupportedFileType | null {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
        // case 'pdf':
        //     return 'pdf';
        // case 'docx':
        // case 'doc':
        //     return 'docx';
        case 'json':
            return 'json';
        default:
            return null;
    }
}

export function getSupportedFileTypes(): string {
    return '.json'; // '.pdf,.docx,.doc,.json' - PDF/DOCX coming soon
}

export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}

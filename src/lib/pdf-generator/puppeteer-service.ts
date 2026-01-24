import puppeteer from 'puppeteer';

export interface PDFGenerationOptions {
    resumeId: string;
    baseUrl?: string;
}

/**
 * Generate PDF from resume by navigating to render URL
 * This avoids React server rendering issues
 */
export async function generateResumePDF(
    options: PDFGenerationOptions
): Promise<Buffer> {
    const { resumeId, baseUrl = 'http://localhost:3000' } = options;

    const renderUrl = `${baseUrl}/api/resumes/${resumeId}/pdf-render`;

    // Launch headless browser
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
        ],
    });

    try {
        const page = await browser.newPage();

        // Navigate to render URL
        await page.goto(renderUrl, {
            waitUntil: 'networkidle0',
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'letter',
            printBackground: true,
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in',
            },
        });

        return Buffer.from(pdfBuffer);
    } finally {
        await browser.close();
    }
}

/**
 * Generate PDF and return as downloadable response
 */
export async function generatePDFResponse(
    resumeId: string,
    filename: string,
    baseUrl?: string
) {
    const pdfBuffer = await generateResumePDF({
        resumeId,
        baseUrl,
    });

    return {
        buffer: pdfBuffer,
        filename: filename.replace(/\s+/g, '_').toLowerCase() + '.pdf',
        contentType: 'application/pdf',
    };
}

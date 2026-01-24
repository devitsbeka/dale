import QRCode from 'qrcode';

export interface QRCodeOptions {
    width?: number;
    margin?: number;
    color?: {
        dark?: string;
        light?: string;
    };
}

export async function generateQRCode(
    text: string,
    options: QRCodeOptions = {}
): Promise<string> {
    try {
        const qrCodeDataURL = await QRCode.toDataURL(text, {
            width: options.width || 256,
            margin: options.margin || 2,
            color: {
                dark: options.color?.dark || '#000000',
                light: options.color?.light || '#ffffff',
            },
        });

        return qrCodeDataURL;
    } catch (error) {
        console.error('QR code generation error:', error);
        throw new Error('Failed to generate QR code');
    }
}

export async function generateQRCodeBuffer(
    text: string,
    options: QRCodeOptions = {}
): Promise<Buffer> {
    try {
        const buffer = await QRCode.toBuffer(text, {
            width: options.width || 256,
            margin: options.margin || 2,
            color: {
                dark: options.color?.dark || '#000000',
                light: options.color?.light || '#ffffff',
            },
        });

        return buffer;
    } catch (error) {
        console.error('QR code buffer generation error:', error);
        throw new Error('Failed to generate QR code buffer');
    }
}

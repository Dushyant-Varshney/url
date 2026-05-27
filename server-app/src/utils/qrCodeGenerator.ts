import QRCode from 'qrcode';

/**
 * Generate QR code as data URL
 * @param text - The text/URL to encode in the QR code
 * @returns Promise<string> - Base64 encoded data URL
 */
export const generateQRCodeDataUrl = async (text: string): Promise<string> => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(text);
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

/**
 * Generate QR code as PNG buffer
 * @param text - The text/URL to encode in the QR code
 * @returns Promise<Buffer> - PNG buffer
 */
export const generateQRCodeBuffer = async (text: string): Promise<Buffer> => {
    try {
        const buffer = await QRCode.toBuffer(text);
        return buffer;
    } catch (error) {
        console.error('Error generating QR code buffer:', error);
        throw error;
    }
};

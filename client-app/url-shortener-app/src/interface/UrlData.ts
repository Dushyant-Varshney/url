export interface UrlData {
    _id: string;
    fullUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: Date;
    updatedAt: Date;
    qrCode?: string; // Base64 data URL for QR code
}
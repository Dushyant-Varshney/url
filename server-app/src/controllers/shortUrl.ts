import express from "express";
import { urlModel } from "../model/shortUrl";
import { getFromCache, setInCache, deleteFromCache } from "../utils/cacheManager";
import { generateQRCodeDataUrl } from "../utils/qrCodeGenerator";

interface AuthRequest extends express.Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Create a new shortened URL for authenticated user
 */
export const createUrl = async (
  req: AuthRequest,
  res: express.Response
): Promise<void> => {
  try {
    const { fullUrl } = req.body;
    const userId = req.userId;

    // Verify user is authenticated
    if (!userId) {
      res.status(401).json({ message: "Unauthorized. Please login first." });
      return;
    }

    // Validate URL format
    if (!fullUrl || typeof fullUrl !== "string") {
      res.status(400).json({ message: "Invalid URL provided" });
      return;
    }

    // Check if user already has this URL
    const urlFound = await urlModel.findOne({ fullUrl, user: userId });

    if (urlFound) {
      // URL already exists for this user, generate QR code and return
      try {
        const qrCode = await generateQRCodeDataUrl(
          `http://localhost:5001/r/${urlFound.shortUrl}`
        );
        const response = {
          ...urlFound.toObject(),
          qrCode,
        };
        res.status(200).json(response);
        return;
      } catch (qrError) {
        console.warn(
          "QR code generation failed, returning URL without QR:",
          qrError
        );
        res.status(200).json(urlFound);
        return;
      }
    }

    // Create new shortened URL with user reference
    const shortUrl = await urlModel.create({
      fullUrl,
      user: userId,
    });

    // Cache the short URL mapping
    await setInCache(shortUrl.shortUrl, shortUrl.fullUrl);

    // Generate QR code
    try {
      const qrCode = await generateQRCodeDataUrl(
        `http://localhost:5001/r/${shortUrl.shortUrl}`
      );
      const response = {
        ...shortUrl.toObject(),
        qrCode,
      };
      res.status(201).json(response);
      return;
    } catch (qrError) {
      console.warn(
        "QR code generation failed, returning URL without QR:",
        qrError
      );
      res.status(201).json(shortUrl);
      return;
    }
  } catch (error) {
    console.error("Error creating URL:", error);
    res.status(500).json({ message: "Failed to create shortened URL" });
  }
};

/**
 * Get all shortened URLs for authenticated user
 */
export const getAllUrl = async (
  req: AuthRequest,
  res: express.Response
): Promise<void> => {
  try {
    const userId = req.userId;

    // Verify user is authenticated
    if (!userId) {
      res.status(401).json({ message: "Unauthorized. Please login first." });
      return;
    }

    // Find all URLs for this user only
    const shortUrls = await urlModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    if (shortUrls.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Generate QR codes for all URLs
    const urlsWithQR = await Promise.all(
      shortUrls.map(async (item) => {
        try {
          const qrCode = await generateQRCodeDataUrl(
            `http://localhost:5001/r/${item.shortUrl}`
          );
          return {
            ...item.toObject(),
            qrCode,
          };
        } catch (qrError) {
          console.warn(
            `QR generation failed for ${item.shortUrl}:`,
            qrError
          );
          return item.toObject();
        }
      })
    );

    res.status(200).json(urlsWithQR);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ message: "Failed to fetch your URLs" });
  }
};

/**
 * Get a specific shortened URL details
 * User must own the URL
 */
export const getUrl = async (
  req: AuthRequest,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify user is authenticated
    if (!userId) {
      res.status(401).json({ message: "Unauthorized. Please login first." });
      return;
    }

    // Find URL and verify it belongs to user
    const shortUrl = await urlModel.findOne({ _id: id, user: userId });

    if (!shortUrl) {
      res.status(404).json({ message: "Short URL not found or unauthorized" });
      return;
    }

    // Update click count
    shortUrl.clicks++;
    await shortUrl.save();

    // Generate QR code
    try {
      const qrCode = await generateQRCodeDataUrl(
        `http://localhost:5001/r/${shortUrl.shortUrl}`
      );
      const response = {
        ...shortUrl.toObject(),
        qrCode,
      };
      res.status(200).json(response);
      return;
    } catch (qrError) {
      console.warn("QR code generation failed:", qrError);
      res.status(200).json(shortUrl);
      return;
    }
  } catch (error) {
    console.error("Error fetching URL:", error);
    res.status(500).json({ message: "Failed to fetch URL details" });
  }
};

/**
 * Delete a shortened URL
 * User must own the URL
 */
export const deleteUrl = async (
  req: AuthRequest,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify user is authenticated
    if (!userId) {
      res.status(401).json({ message: "Unauthorized. Please login first." });
      return;
    }

    // Find and verify ownership
    const shortUrl = await urlModel.findOne({ _id: id, user: userId });

    if (!shortUrl) {
      res.status(404).json({ message: "URL not found or unauthorized" });
      return;
    }

    // Delete the URL
    await urlModel.findByIdAndDelete(id);

    // Remove from cache
    await deleteFromCache(shortUrl.shortUrl);

    res.status(200).json({ message: "URL successfully deleted" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ message: "Failed to delete URL" });
  }
};

/**
 * Get QR code for a shortened URL
 * User must own the URL
 */
export const getQRCode = async (
  req: AuthRequest,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verify user is authenticated
    if (!userId) {
      res.status(401).json({ message: "Unauthorized. Please login first." });
      return;
    }

    // Find URL and verify ownership
    const urlDoc = await urlModel.findOne({ _id: id, user: userId });

    if (!urlDoc) {
      res
        .status(404)
        .json({ message: "Short URL not found or unauthorized" });
      return;
    }

    const qrCode = await generateQRCodeDataUrl(
      `http://localhost:5001/r/${urlDoc.shortUrl}`
    );

    res.status(200).json({ qrCode, shortUrl: urlDoc.shortUrl });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ message: "Failed to generate QR code" });
  }
};
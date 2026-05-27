import express from "express";
import { createUrl, deleteUrl, getAllUrl, getUrl, getQRCode } from "../controllers/shortUrl";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Protected routes - require authentication
router.post("/shortUrl", authMiddleware, createUrl);
router.get("/shortUrl", authMiddleware, getAllUrl);
router.get("/shortUrl/:id/qr", authMiddleware, getQRCode);
router.get("/shortUrl/:id", authMiddleware, getUrl);
router.delete("/shortUrl/:id", authMiddleware, deleteUrl);

export default router;
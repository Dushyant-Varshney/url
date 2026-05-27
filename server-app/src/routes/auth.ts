import express from "express";
import { register, login, getMe } from "../controllers/auth";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { name, email, password, confirmPassword }
 * Returns: { message, token, user }
 */
router.post("/register", register);

/**
 * POST /api/auth/login
 * Login user
 * Body: { email, password }
 * Returns: { message, token, user }
 */
router.post("/login", login);

/**
 * GET /api/auth/me
 * Get current logged-in user info (protected route)
 * Headers: Authorization: Bearer <token>
 * Returns: { user }
 */
router.get("/me", authMiddleware, getMe);

export default router;

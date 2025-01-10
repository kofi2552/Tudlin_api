import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  signup,
  login,
  logout,
  getLoggedInUser,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getLoggedInUser);
router.post("/update-password", verifyToken, updatePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;

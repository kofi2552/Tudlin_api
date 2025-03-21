// routes/userRoutes.js
import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  getAllTutorsBySchool,
} from "../controllers/userController.js";

const router = express.Router();

// Create user
router.post("/add", createUser);

// Get all users
router.get("/all", getAllUsers);

// Get a single user by ID
router.get("/:id", getUserById);

// Update a user
router.put("/edit/:id", updateUser);

// Delete a user
router.delete("/del/:id", deleteUser);

router.get("/all/:schoolId", getAllTutorsBySchool);

// router.post("/add", verifyToken, createUser);

// // Get all users

// // Get a single user by ID
// router.get("/:id", verifyToken, getUserById);

// // Update a user
// router.put("/edit/:id", verifyToken, updateUser);

// // Delete a user
// router.delete("/del/:id", verifyToken, deleteUser);

export default router;

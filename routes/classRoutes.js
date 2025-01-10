import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createClass,
  getClasses,
  updateClass,
  deleteClass,
} from "../controllers/classController.js";

const router = express.Router();

// POST route to create a new class
router.post("/add", verifyToken, createClass);

// GET route to fetch all classes
router.get("/all", getClasses);

// PUT route to update a class
router.put("/edit/:id", verifyToken, updateClass);

// DELETE route to delete a class
router.delete("/del/:id", verifyToken, deleteClass);

export default router;

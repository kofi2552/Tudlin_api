import express from "express";
import {
  createTaskCategory,
  getAllTaskCategories,
  getTaskCategoryById,
  updateTaskCategory,
  deleteTaskCategory,
} from "../controllers/TaskCatController.js";

const router = express.Router();

// Create a new task category
router.post("/", createTaskCategory);

// Get all task categories
router.get("/", getAllTaskCategories);

// Get a single task category by ID
router.get("/:id", getTaskCategoryById);

// Update a task category
router.put("/:id", updateTaskCategory);

// Delete a task category
router.delete("/:id", deleteTaskCategory);

export default router;

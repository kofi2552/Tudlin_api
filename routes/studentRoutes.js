// /routes/schoolRoutes.js
import express from "express";
import { verifyToken } from "../middleware/jwt.js";

import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
} from "../controllers/studentController.js";

const router = express.Router();

// POST route to create a new school
router.post("/add", verifyToken, createStudent);
router.get("/all", getAllStudents);
router.get("/class/:classId", getStudentsByClass);
router.get("/:id", getStudentById);
router.put("/:id", verifyToken, updateStudent);
router.delete("/del/:id", verifyToken, deleteStudent);

export default router;

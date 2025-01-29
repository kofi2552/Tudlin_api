// /routes/schoolRoutes.js
import express from "express";
import { verifyToken } from "../middleware/jwt.js";

import {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByEmail,
  getAllStudentsBySchool,
  getStudentsByTeacher,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
} from "../controllers/studentController.js";

const router = express.Router();

// POST route to create a new student
router.post("/add/:schoolId", createStudent);
router.post("/verify", getStudentByEmail);
router.get("/all", getAllStudents);
router.get("/tutor/:teacherId", getStudentsByTeacher);
router.get("/all/:schoolId", getAllStudentsBySchool);
router.get("/class/:classId", getStudentsByClass);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/del/:id", deleteStudent);

export default router;

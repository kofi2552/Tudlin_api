// /routes/schoolRoutes.js
import express from "express";
import { verifyToken } from "../middleware/jwt.js";

import {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByEmail,
  StudentLogin,
  getAllStudentsBySchool,
  getStudentsByTeacher,
  updateStudent,
  deleteStudent,
  SetStudentPassword,
  getStudentsByClass,
} from "../controllers/studentController.js";
// import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// POST route to create a new student
router.post("/add/:schoolId", createStudent);
router.post("/verify", StudentLogin);
router.get("/all", getAllStudents);
router.get("/tutor/:teacherId", getStudentsByTeacher);
router.get("/all/:schoolId", getAllStudentsBySchool);
router.get("/class/:classId", getStudentsByClass);
router.get("/:id", getStudentById);
router.put("/update/:id", SetStudentPassword);
router.put("/:id", updateStudent);
router.delete("/del/:id", deleteStudent);

// router.post("/upload", upload.single("file"), uploadStudents);

export default router;

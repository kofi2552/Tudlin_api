// routes/upload.js
import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  processStudents,
  processSubjects,
  processClasses,
  processQuizzes,
} from "../controllers/uploadController.js";

const router = express.Router();

// The upload middleware will use req.baseUrl to determine the correct subfolder
router.post("/students", upload.single("file"), processStudents);
router.post("/subjects", upload.single("file"), processSubjects);
router.post("/classes", upload.single("file"), processClasses);
router.post("/quizzes", upload.single("file"), processQuizzes);

export default router;

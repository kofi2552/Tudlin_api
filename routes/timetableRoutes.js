import express from "express";
import { generateCrashExamTimetable } from "../controllers/timetableController.js";

const router = express.Router();

// Endpoint to generate a crash exam timetable
router.post("/generate", generateCrashExamTimetable);

export default router;

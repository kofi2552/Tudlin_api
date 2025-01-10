// /routes/schoolRoutes.js
import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createSubject,
  getSubject,
  getSubjects,
  deleteSubject,
  updateSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

// POST route to create a new school
router.post("/add", createSubject);
router.get("/all", getSubjects);
router.get("/:id", getSubject);
router.delete("/del/:id", deleteSubject);
router.put("/edit/:id", updateSubject);

export default router;

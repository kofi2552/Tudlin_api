import express from "express";
import {
  getClasses,
  getClassById,
  getSubjectsByClass,
  addSubjectToClass,
  deleteSubjectFromClass,
  updateSubjectInClass,
} from "../controllers/SubClassController.js";

const router = express.Router();

// Route to get all classes
router.get("/all", getClasses);

// Route to get a specific class by its ID, including subjects
router.get("/:id", getClassById);

// Route to get a all classes by its ID for a specific curriculum
router.get("/all/:classId", getSubjectsByClass);

// Route to get all subjects for a specific class
router.get("/:classId/subjects", getSubjectsByClass);

// Route to add a subject to a specific class
router.post("/add/:classId/:curriculumId", addSubjectToClass);

// Route to delete a subject from a specific class
router.delete("/:classId/:subjectId", deleteSubjectFromClass);

// Route to update a subject in a class (e.g., updating subject name)
router.put("/edit/:classId/:subjectId", updateSubjectInClass);

export default router;

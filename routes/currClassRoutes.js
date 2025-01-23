import express from "express";
import {
  getCurriculums,
  getCurriculumById,
  addCurriculum,
  addClassToCurriculum,
  getClassesByCurriculum,
  getSubjectsByClass,
  deleteClassFromCurriculum,
  updateClassInCurriculum,
} from "../controllers/CurrClassController.js";

const router = express.Router();

// Get all curriculums
router.get("/all", getCurriculums);

router.post("/add", addCurriculum);

router.get("/:id", getCurriculumById);

// Get all classes for a specific curriculum
router.get("/classes/:curriculumId", getClassesByCurriculum);

router.get("/:curriculumId/:classId/subjects", getSubjectsByClass);

// Add a subject to a curriculum
router.post("/:curriculumId/class", addClassToCurriculum);

// // Delete a subject
router.delete("/:curriculumId/class/:classId", deleteClassFromCurriculum);

// // Update a subject
router.put("/:curriculumId/class/:classId", updateClassInCurriculum);

export default router;

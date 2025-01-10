import express from "express";
import {
  getCurriculums,
  getCurriculumById,
  addCurriculum,
  addSubjectToCurriculum,
  getSubjectsByCurriculum,
  deleteSubjectFromCurriculum,
  updateSubjectInCurriculum,
} from "../controllers/curriculumController.js";

const router = express.Router();

// Get all curriculums
router.get("/all", getCurriculums);

router.post("/add", addCurriculum);

router.get("/:id", getCurriculumById);

// Get all subjects for a specific curriculum
router.get("/:curriculumId/subjects", getSubjectsByCurriculum);

// Add a subject to a curriculum
router.post("/:curriculumId/subject", addSubjectToCurriculum);

// Delete a subject
router.delete("/:curriculumId/subject/:subjectId", deleteSubjectFromCurriculum);

// Update a subject
router.put("/:curriculumId/subject/:subjectId", updateSubjectInCurriculum);

export default router;

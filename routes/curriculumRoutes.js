import express from "express";
import {
  getCurriculums,
  getAllCurriculumDivisionsBySchool,
  getCurriculumsByDivision,
  getCurriculumById,
  addCurriculum,
  deleteCurriculum,
  updateCurriculum,
  addCurrDivision,
  addSubjectToCurriculum,
  getSubjectsByCurriculum,
  deleteCurriculumSubject,
  editCurriculumSubject,
} from "../controllers/curriculumController.js";

const router = express.Router();

// Get all curriculums under division
router.get("/:divisionId/curr", getCurriculumsByDivision);

// Get all curriculums
router.get("/all", getCurriculums);

router.get("/cd/:schoolId", getAllCurriculumDivisionsBySchool);

router.post("/cd/add/:specialId", addCurrDivision);

router.post("/add/:divisionId", addCurriculum);

router.delete("/del/:divisionId/:curriculumId", deleteCurriculum);
router.put("/edit/:divisionId/:curriculumId", updateCurriculum);

router.get("/:id", getCurriculumById);

// Get all subjects for a specific curriculum
router.get("/:curriculumId/subjects", getSubjectsByCurriculum);

// Add a subject to a curriculum
router.post("/:curriculumId/add-subject", addSubjectToCurriculum);

// Delete a subject
router.delete("/:curriculumId/del-subject/:subjectId", deleteCurriculumSubject);

// Update a subject
router.put("/:curriculumId/edit-subject/:subjectId", editCurriculumSubject);

export default router;

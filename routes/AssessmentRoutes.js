import express from "express";
import {
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  getAllAssessmentByUser,
  getAllAssessmentByStudent,
  getAllAssessmentForStudent,
  updateAssessment,
  deleteAssessment,
  getScoresByAssessment,
  getScoreSheet,
  getFilteredAssessments,
  addScores,
  updateScore,
  deleteScore,
} from "../controllers/AssessmentController.js";

const router = express.Router();

router.post("/add/:userId/:schoolId", createAssessment);
router.get("/:userId", getAllAssessmentByUser);
router.get("/student/:studentId", getAllAssessmentByStudent);
router.get("/student/all/:studentId", getAllAssessmentForStudent);
router.get("/all", getAllAssessments);
router.get("/task/:id", getAssessmentById);
router.put("/edit/:id", updateAssessment);
router.delete("/del/:id", deleteAssessment);

//-------------------------------------------------- score routes

router.get("/scores/:assessmentId", getScoresByAssessment);

router.get("/:taskCategoryId/:curriculumId/scoresheet", getScoreSheet);

router.get("/:taskCategoryId/:curriculumId/all", getFilteredAssessments);

// Add a new score
router.post("/scores/add", addScores);

// Update an existing score
router.patch("/scores/edit", updateScore);

// Delete a score
router.delete("score/del/:scoreId", deleteScore);

export default router;

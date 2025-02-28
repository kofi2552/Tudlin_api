import express from "express";
import {
  createTaskAssessment,
  createQuizAssessment,
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
  getQuizzesByAssessment,
  getQuizAttempts,
  deleteScore,
  recordQuizAttempt,
  completeQuiz,
} from "../controllers/AssessmentController.js";
import { verifyToken } from "../middleware/jwt.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/task/add/:userId/:schoolId", createTaskAssessment);
router.post(
  "/quiz/add/:userId/:schoolId",
  upload.single("file"),
  // verifyToken,
  createQuizAssessment
);
router.get("/quizzes/:assessmentId", getQuizzesByAssessment);
router.get("/quizzes/attempt/:assessmentId", getQuizAttempts);
router.post("/quizzes/checkAttempt/:assessmentId", recordQuizAttempt);
router.post("/quiz/finish/:assessmentId", completeQuiz);
router.get("/:userId", getAllAssessmentByUser);
router.get("/student/:studentId", getAllAssessmentByStudent); //for tracking student progress
router.get("/student/all/:studentId", getAllAssessmentForStudent); //for student dashboard
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

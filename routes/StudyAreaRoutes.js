// /routes/schoolRoutes.js
import express from "express";
import {
  createStudyAreaWithCurriculum,
  getStudyAreas,
  updateStudyArea,
  deleteStudyArea,
  getStudyAreasForCurriculum,
} from "../controllers/StudyAreaCont.js";

const router = express.Router();

// POST route to create a new school
router.post("/add", createStudyAreaWithCurriculum);
router.get("/all", getStudyAreas);
router.get("/:curriculumId/study-area", getStudyAreasForCurriculum);
router.put("/edit/:id", updateStudyArea);
router.delete("/del/:id", deleteStudyArea);

export default router;

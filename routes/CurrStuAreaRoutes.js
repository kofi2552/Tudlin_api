// /routes/schoolRoutes.js
import express from "express";
import {
  createStudyArea,
  getStudyAreas,
  updateStudyArea,
  deleteStudyArea,
} from "../controllers/StudyAreaCont.js";

const router = express.Router();

// POST route to create a new school
router.post("/add", createStudyArea);
router.get("/all", getStudyAreas);
router.put("/study-area/:id", updateStudyArea);
router.delete("/del-study-area/:id", deleteStudyArea);

export default router;

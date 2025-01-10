// /routes/schoolRoutes.js
import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createSubject,
  getSubjectGrps,
} from "../controllers/SubjectGrpController.js";

const router = express.Router();

// POST route to create a new school
router.post("/add", createSubject);
router.get("/all", getSubjectGrps);
router.put("/school/:id");
router.delete("/del-school/:id");

export default router;

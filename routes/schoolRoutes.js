// /routes/schoolRoutes.js
import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createSchool,
  getSchool,
  getAllSchools,
  updateSchool,
  deleteSchool,
} from "../controllers/schoolController.js";

const router = express.Router();

// POST route to create a new school
router.post("/add-school", createSchool);
router.get("/school/:schoolId", getSchool);
router.get("/school", getAllSchools);
router.put("/school/:id", updateSchool);
router.delete("/del-school/:id", deleteSchool);

export default router;

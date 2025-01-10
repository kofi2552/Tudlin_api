import express from "express";
import {
  assignSubjectToGroup,
  getSubjectsByGroup,
  removeSubjectFromGroup,
  assignGroupToStudent,
} from "../controllers/SubjectGroupSubjectsController.js";

const router = express.Router();

// Route to assign a subject to a group
router.post("/assign-subject", assignSubjectToGroup);

// Route to get all subjects for a specific group
router.get("/group/:groupId/subjects", getSubjectsByGroup);

// Route to remove a subject from a group
router.delete("/remove-subject", removeSubjectFromGroup);

router.post("/assign-to-student", assignGroupToStudent);

export default router;

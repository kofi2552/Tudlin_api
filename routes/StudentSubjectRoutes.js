import express from "express";
import {
  addStudentsToSubject,
  removeStudentsFromSubject,
  getStudentSubjects,
  getSubjectStudents,
} from "../controllers/studentSubjectController.js";

const router = express.Router();

// Route to assign student to a subject
router.post("/add/:subjectId", addStudentsToSubject);

// Route to get all subjects for a student
router.get("/all/subjects/:studentId", getStudentSubjects);

// Route to remove a student from a subject group
router.delete("/del/:subjectId", removeStudentsFromSubject);

// Route to get all students for a subject
router.get("/all/students/:subjectId", getSubjectStudents);

export default router;

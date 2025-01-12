// /backend/server.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import authRoute from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import AgentRoutes from "./routes/AgentRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import SubjectGrpRoutes from "./routes/SubjectGrpRoutes.js";
import SubjectGroupSubjectsRoutes from "./routes/SubjectGroupSubjectsRoutes.js";
import curriculumRoutes from "./routes/curriculumRoutes.js";
import subClassRoutes from "./routes/subClassRoutes.js";
import currClassRoutes from "./routes/currClassRoutes.js";
import StudyAreaRoutes from "./routes/StudyAreaRoutes.js";
import TCRoutes from "./routes/TCRoutes.js";
import AssessmentRoutes from "./routes/AssessmentRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import StudentSubjectRoutes from "./routes/StudentSubjectRoutes.js";
import notifyRoutes from "./routes/notifyRoutes.js";

const app = express();
app.use(cookieParser());

dotenv.config();
const port = 5000;

// Middleware setup
app.use(
  cors({
    origin: ["https://tudlin-client.onrender.com", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoutes);
app.use("/api", AgentRoutes);
app.use("/api", schoolRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/class", classRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/subjectgrp", SubjectGrpRoutes);
app.use("/api/subject-group", SubjectGroupSubjectsRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/classes", subClassRoutes);
app.use("/api/currclass", currClassRoutes);
app.use("/api/studyareas", StudyAreaRoutes);
app.use("/api/task-categories", TCRoutes);
app.use("/api/assessments", AssessmentRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/stu-subj", StudentSubjectRoutes);
app.use("/api", notifyRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

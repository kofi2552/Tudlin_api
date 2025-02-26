// /backend/server.js
import express from "express";
import http from "http"; // Import HTTP module
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";
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
import blogRoutes from "./routes/blogRoutes.js";

const app = express();

dotenv.config();
const port = 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://tudlin-client.onrender.com", "http://localhost:5173"],
    credentials: true,
  },
});

app.use(cookieParser());
// Middleware setup
app.use(
  cors({
    origin: [
      "https://tudlin-client.onrender.com",
      "https://api.openweathermap.org",
      "https://www.tudlin.com",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoutes);
app.use("/api", AgentRoutes);
app.use("/api", schoolRoutes);
app.use("/api/chats", chatRoutes);
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
app.use("/api/blog", blogRoutes);

// WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("send-message", (message) => {
    //console.log("Message received:", message);
    io.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
// app.listen(port, () => {
//   console.log(`Backend server is running on http://localhost:${port}`);
// });

server.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});

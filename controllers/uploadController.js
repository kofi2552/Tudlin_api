import multer from "multer";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import Student from "../models/Student.js";
import Subjects from "../models/Subjects.js";
import Class from "../models/Class.js";
import Quiz from "../models/Quiz.js";

export const processStudents = async (req, res) => {
  console.log("uploading students....", req.file);
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    const students = worksheet
      .getSheetValues()
      .slice(2)
      .map((row) => ({
        name: row[1],
        email: row[2],
        class_id: row[3],
        curriculum_id: row[4],
        schoolId: row[5],
      }));

    console.log("saving students....");

    // Save students to DB (pseudo code)
    await Student.bulkCreate(students);

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log("File deleted successfully:", req.file.path);
    });
    res.json({ message: "Students uploaded successfully" });
  } catch (error) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
      else console.log("File deleted successfully:", req.file.path);
    });
    res.status(500).json({ message: "Error processing file", error });
  }
};

// Process Subjects Upload
export const processSubjects = async (req, res) => {
  console.log("uploading subjects....", req.file);

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    const subjects = worksheet
      .getSheetValues()
      .slice(2)
      .map((row) => ({
        name: row[1],
        content: row[2],
        studyareaid: row[3],
        class_id: row[4],
        curriculumId: row[5],
      }));

    await Subjects.bulkCreate(subjects);
    fs.unlinkSync(req.file.path);
    res.json({ message: "Subjects uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error processing file", error });
  }
};

// Process Classes Upload
export const processClasses = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    const classes = worksheet
      .getSheetValues()
      .slice(2)
      .map((row) => ({
        name: row[1],
        years: row[2],
      }));

    await Class.bulkCreate(classes);
    fs.unlinkSync(req.file.path);
    res.json({ message: "Classes uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error processing file", error });
  }
};

// Process Quizzes Upload
export const processQuizzes = async (req, res) => {
  console.log("uploading quizzess....", req.file);

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    const quizzes = worksheet
      .getSheetValues()
      .slice(2)
      .map((row) => ({
        question: row[1],
        options: JSON.parse(row[2]), // Assuming options are stored as JSON string
        correctAnswer: row[3],
      }));

    await Quiz.bulkCreate(quizzes);
    fs.unlinkSync(req.file.path);
    res.json({ message: "Quizzes uploaded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error processing file", error });
  }
};

import multer from "multer";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import Student from "../models/Student.js";
import Subjects from "../models/Subjects.js";
import Class from "../models/Class.js";
import Quiz from "../models/Quiz.js";
import Curriculum from "../models/Curriculum.js";
import StudyAreas from "../models/StudyAreas.js";
import sequelize from "../database.js";
import CurriculumSubject from "../models/CurriculumSubject.js";

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

export const processCurrSubjects = async (req, res) => {
  console.log("Uploading curr subjects....", req.file);

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const { curriculumId } = req.params; // Get curriculum ID from request params

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    // Validate curriculum exists
    const curriculum = await Curriculum.findByPk(curriculumId);
    if (!curriculum) {
      return res.status(404).json({ message: "Curriculum not found" });
    }

    const subjects = worksheet
      .getSheetValues()
      .slice(2)
      .map((row) => ({
        name: row[1]?.trim() || null,
        content: row[2]?.trim() || null,
        studyareaid: row[3] || null,
        class_id: row[4]?.trim() || null,
        curriculumId, // Assign curriculum ID to all subjects
      }))
      .filter((subject) => subject.name); // Remove empty subjects

    if (subjects.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid subjects found in file" });
    }

    const transaction = await sequelize.transaction(); // Start a transaction

    try {
      for (let subject of subjects) {
        let studyarea = null;

        // Validate study area if provided
        if (subject.studyareaid) {
          studyarea = await StudyAreas.findByPk(subject.studyareaid, {
            transaction,
          });
          if (!studyarea) {
            await transaction.rollback();
            return res
              .status(400)
              .json({ message: `Study area ${subject.studyareaid} not found` });
          }
        }

        // Create subject in Subjects table
        const newSubject = await Subjects.create(subject, { transaction });

        // Add subject to CurriculumSubjects table
        await CurriculumSubject.create(
          {
            name: newSubject.name,
            content: newSubject.content,
            subjectId: newSubject.id,
            studyArea: studyarea ? studyarea.name : null, // Assign name properly
            studyAreaId: studyarea ? studyarea.id : null, // Ensure valid ID
            curriculumId: curriculumId,
          },
          { transaction }
        );
      }

      await transaction.commit();
      fs.unlinkSync(req.file.path); // Delete the file after processing
      res.json({ message: "Subjects uploaded successfully" });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.log("Error processing file", error);
    res.status(500).json({ message: "Error processing file", error });
  }
};

// Process Subjects Upload
export const processSubjects = async (req, res) => {
  //console.log("uploading subjects....", req.file);

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
        content: row[2] || null,
        studyareaid: row[3],
        class_id: row[4] || null,
        curriculumId: row[5],
      }))
      .filter((subject) => subject.name !== null);
    // console.log("Parsed subjects:", subjects);
    await Subjects.bulkCreate(subjects);
    fs.unlinkSync(req.file.path);
    res.json({ message: "Subjects uploaded successfully" });
  } catch (error) {
    console.log("BCK error processing file", error);
    res.status(500).json({ message: "BCK Error processing file", error });
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

import { Assessment, StudentAssessmentScore } from "../models/Assessment.js";
import TaskCategory from "../models/TaskCategory.js";
import Student from "../models/Student.js";
import Subject from "../models/Subjects.js";
import Class from "../models/Class.js";
import School from "../models/School.js";
import User from "../models/User.js";
import { Op } from "sequelize";
import sequelize from "../database.js";
import Quiz from "../models/Quiz.js";
import AssessmentQuiz from "../models/AssessmentQuiz.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

// Create Assessment
export const createTaskAssessment = async (req, res) => {
  const { userId, schoolId } = req.params;
  const { values, content, class_id, curriculum_id } = req.body;
  const {
    name,
    tscore,
    task_category_id,
    taskLink,
    subject_id,
    deadlineDateTime,
    timedQuizId,
  } = values;

  //console.log("create task details recived: ", req.body, values, req.params);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const school = await School.findOne({ where: { specialId: schoolId } });

    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    // Determine if the assessment has a deadline and handle it
    const isDeadline = deadlineDateTime ? true : false;
    const formattedDeadlineDate = isDeadline
      ? new Date(deadlineDateTime)
      : null;
    const duration = 0;
    const newAssessment = await Assessment.create({
      name,
      tscore,
      task_category_id,
      class_id,
      subject_id,
      content,
      taskLink,
      curriculum_id,
      schoolId: school.specialId,
      userId: user.id || userId,
      duration,
      isDeadline, // Set the deadline flag
      deadlineDateTime: formattedDeadlineDate, // Set the deadline date if available
      timedQuizId: timedQuizId || null,
    });

    if (newAssessment) {
      console.log("assessment created");
    }
    res.status(201).json({
      message: "Assessment created successfully",
      assessment: newAssessment,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create assessment", details: err.message });
  }
};

// export const createQuizAssessment = async (req, res) => {
//   const { userId, schoolId } = req.params;
//   const { values, content, class_id, curriculum_id } = req.body;
//   const {
//     name,
//     tscore,
//     task_category_id,
//     subject_id,
//     deadlineDateTime,
//     duration,
//   } = values;

//   console.log("Received Task Details:", req.body, values, req.params);

//   try {
//     const user = await User.findByPk(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const school = await School.findOne({ where: { specialId: schoolId } });
//     if (!school) return res.status(404).json({ error: "School not found" });

//     // Set deadline if provided
//     const isDeadline = !!deadlineDateTime;
//     const formattedDeadlineDate = isDeadline
//       ? new Date(deadlineDateTime)
//       : null;

//     // Cap quiz duration at 30 minutes
//     const finalDuration = Math.min(duration, 30);

//     // Start a database transaction
//     const transaction = await sequelize.transaction();

//     try {
//       // Create the quiz questions in the Quiz table
//       const quizEntries = await Promise.all(
//         content.map(async (q) => {
//           return await Quiz.create(
//             {
//               question: q.question,
//               options: q.options,
//               correctAnswer: q.correctAnswer,
//             },
//             { transaction }
//           );
//         })
//       );

//       // Extract quiz IDs
//       const quizIds = quizEntries.map((quiz) => quiz.id);

//       // Create the assessment and link quizzes
//       const newAssessment = await Assessment.create(
//         {
//           name,
//           tscore,
//           task_category_id,
//           class_id,
//           subject_id,
//           curriculum_id,
//           schoolId: school.specialId,
//           userId: user.id || userId,
//           duration: finalDuration,
//           isDeadline,
//           deadlineDateTime: formattedDeadlineDate,
//           timedQuizId: quizIds, // Store quiz IDs in assessment
//         },
//         { transaction }
//       );

//       await Promise.all(
//         quizEntries.map(async (quiz) => {
//           return await AssessmentQuiz.create({
//             assessmentId: newAssessment.id,
//             quizId: quiz.id,
//           });
//         })
//       );

//       // Commit the transaction
//       await transaction.commit();

//       console.log("Assessment and quizzes created successfully");

//       res.status(201).json({
//         message: "Assessment created successfully",
//         assessment: newAssessment,
//         quizzes: quizEntries,
//       });
//     } catch (err) {
//       await transaction.rollback();
//       throw err;
//     }
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Failed to create assessment", details: err.message });
//   }
// };

// Get All Assessments

// export const createQuizAssessment = async (req, res) => {
//   const { userId, schoolId } = req.params;
//   const currentUserId = req.userId;
//   const { values, content, class_id, curriculum_id } = req.body;
//   const {
//     name,
//     tscore,
//     desc,
//     task_category_id,
//     subject_id,
//     deadlineDateTime,
//     quizAttempts,
//     duration,
//   } = values;

//   console.log("Received Quiz Details:", req.body, values, req.params);

//   try {
//     const user = await User.findByPk(userId || currentUserId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     const school = await School.findOne({ where: { specialId: schoolId } });
//     if (!school) return res.status(404).json({ error: "School not found" });

//     // Set deadline if provided
//     const isDeadline = !!deadlineDateTime;
//     const formattedDeadlineDate = isDeadline
//       ? new Date(deadlineDateTime)
//       : null;

//     // Cap quiz duration at 30 minutes
//     const finalDuration = Math.min(duration, 30);

//     // Start a database transaction
//     const transaction = await sequelize.transaction();

//     try {
//       // Create the quiz questions in the Quiz table
//       const quizEntries = await Promise.all(
//         content.map(async (q) => {
//           return await Quiz.create(
//             {
//               question: q.question,
//               options: q.options,
//               correctAnswer: q.correctAnswer,
//             },
//             { transaction }
//           );
//         })
//       );
//       if (quizEntries.length === 0) {
//         return res.status(401).json({ error: "No questions found" });
//       }
//       // Extract quiz IDs
//       const quizIds = quizEntries.map((quiz) => quiz.id);

//       // Create the assessment and store quiz IDs in `timedQuizId`
//       const newAssessment = await Assessment.create(
//         {
//           name,
//           tscore,
//           desc,
//           task_category_id,
//           class_id,
//           subject_id,
//           curriculum_id,
//           schoolId: school.specialId,
//           userId: user.id || currentUserId || userId,
//           duration: finalDuration,
//           isDeadline,
//           quizAttempts,
//           isQuiz: true,
//           deadlineDateTime: formattedDeadlineDate,
//           timedQuizId: JSON.stringify(quizIds), // Store quiz IDs as a JSON array
//         },
//         { transaction }
//       );

//       // Link quizzes to the assessment using the AssessmentQuiz association table
//       await Promise.all(
//         quizIds.map(async (quizId) => {
//           return await AssessmentQuiz.create(
//             {
//               assessmentId: newAssessment.id,
//               quizId: quizId,
//             },
//             { transaction }
//           );
//         })
//       );

//       // Commit the transaction
//       await transaction.commit();

//       console.log("Assessment and quizzes created successfully");

//       res.status(201).json({
//         message: "Assessment created successfully",
//         assessment: newAssessment,
//         quizzes: quizEntries,
//       });
//     } catch (err) {
//       await transaction.rollback();
//       throw err;
//     }
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Failed to create assessment", details: err.message });
//   }
// };

export const getQuizzesByAssessment = async (req, res) => {
  const { assessmentId } = req.params;
  console.log("fetching quiz under assessmentId: ", assessmentId);
  try {
    const assessment = await Assessment.findOne({
      where: { id: assessmentId },
    });
    // Find all quizzes associated with the given assessmentId
    const quizzes = await AssessmentQuiz.findAll({
      where: { assessmentId },
      include: [{ model: Quiz }],
    });

    if (!quizzes.length) {
      return res
        .status(404)
        .json({ message: "No quizzes found for this assessment." });
    }

    // Extract and return only the quiz data
    const quizData = quizzes.map((q) => q.Quiz);

    res.status(200).json({ quizData, assessment });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch quizzes",
      error: error.message,
    });
  }
};

// export const getQuizAttempts = async (req, res) => {
//   try {
//     const { assessmentId } = req.params;

//     // Find the user's assessment quiz record
//     const Attempts = await Assessment.findOne({
//       where: { id: assessmentId },
//     });
//     res.json({ attempts: Attempts.quizAttempts });
//   } catch (error) {
//     console.error("Error fetching attempts:", error);
//     res.status(500).json({ message: "Server error, couldn't fetch attempts" });
//   }
// };

// export const completeQuiz = async (req, res) => {
//   const { assessmentId } = req.params;
//   console.log("completing quiz with id: ", assessmentId);

//   try {
//     // Find the user's assessment quiz record
//     const QuizToComplete = await Assessment.findOne({
//       where: { id: assessmentId },
//     });

//     if (!QuizToComplete) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     const CompletedQuiz = await QuizToComplete.update({
//       quizAttempts: 0,
//     });

//     if (CompletedQuiz) {
//       res.json({ message: "You have exhausted all your allowed attempts" });
//     }
//   } catch (error) {
//     console.error("Error occured with your attempts:", error);
//     res.status(500).json({ message: "Server error, couldn't access attempts" });
//   }
// };

export const getQuizAttempts = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    // Assuming studentId is passed as a query parameter, e.g. ?studentId=123
    const { studentId } = req.query;

    console.log(
      "Getting quiz attempts for student:",
      studentId,
      "assessment:",
      assessmentId
    );

    // Fetch the assessment to get the allowed attempts
    const assessment = await Assessment.findByPk(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    const allowedAttempts = assessment.quizAttempts; // e.g., 3 attempts allowed

    // Find the student's record for this assessment
    const scoreRecord = await StudentAssessmentScore.findOne({
      where: { assessment_id: assessmentId, student_id: studentId },
    });
    const currentAttempts = scoreRecord ? scoreRecord.attempts : 0;

    res.json({ allowedAttempts, currentAttempts });
  } catch (error) {
    console.error("Error fetching attempts:", error);
    res.status(500).json({
      message: "Server error, couldn't fetch attempts",
      details: error.message,
    });
  }
};

export const recordQuizAttempt = async (req, res) => {
  const { assessmentId } = req.params;
  const { studentId } = req.body; // Expect studentId in the request body
  console.log(
    "Recording quiz attempts for student:",
    studentId,
    "assessment:",
    assessmentId
  );

  try {
    // Fetch the assessment (to get any additional info if needed)
    const assessment = await Assessment.findByPk(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Find the StudentAssessmentScore record for this student and assessment
    let scoreRecord = await StudentAssessmentScore.findOne({
      where: { assessment_id: assessmentId, student_id: studentId },
    });

    if (scoreRecord) {
      // Increment the attempt count
      scoreRecord.attempts = scoreRecord.attempts + 1;
      await scoreRecord.save();
    } else {
      // If no record exists, create one with attempts set to 1.
      scoreRecord = await StudentAssessmentScore.create({
        assessment_id: assessmentId,
        student_id: studentId,
        score: 0, // Default score; adjust as needed
        max_score: assessment.tscore, // or set a default like 100
        attempts: 1,
      });
    }

    res.json({
      message: "Quiz attempt recorded",
      currentAttempts: scoreRecord.attempts,
    });
  } catch (error) {
    console.error("Error recording quiz attempt:", error);
    res.status(500).json({
      message: "Server error, couldn't record quiz attempt",
      details: error.message,
    });
  }
};

export const completeQuiz = async (req, res) => {
  // Expect both assessmentId and studentId (e.g. from params or body)
  const { assessmentId } = req.params;
  const { studentId } = req.body;
  console.log(
    "Completing quiz for student:",
    studentId,
    "assessment:",
    assessmentId
  );

  try {
    // First, fetch the Assessment to know the allowed attempts
    const assessment = await Assessment.findByPk(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Quiz (Assessment) not found" });
    }

    // Assume that the allowed number of attempts is stored in assessment.quizAttempts
    const allowedAttempts = assessment.quizAttempts; // e.g. 3 attempts allowed

    // Then, try to find the StudentAssessmentScore record for this student and assessment.
    // This record will track the score (if any) and the number of attempts made.
    let scoreRecord = await StudentAssessmentScore.findOne({
      where: { assessment_id: assessmentId, student_id: studentId },
    });

    if (scoreRecord) {
      // Increment the attempt count
      scoreRecord.attempts = scoreRecord.attempts + 1;
      await scoreRecord.save();
    } else {
      // If no record exists (first attempt), create one with attempt count 1.
      scoreRecord = await StudentAssessmentScore.create({
        assessment_id: assessmentId,
        student_id: studentId,
        score: 0, // or null, depending on your design
        max_score: assessment.tscore, // or any default maximum score
        attempts: 1,
      });
    }

    // Check if the student has now exhausted their allowed attempts.
    if (scoreRecord.attempts >= allowedAttempts) {
      try {
        // Mark the quiz as complete for the student
        const CompleteQuiz = await StudentAssessmentScore.update(
          { isComplete: true },
          { where: { assessment_id: assessmentId, student_id: studentId } }
        );

        // Check if the update was successful
        if (CompleteQuiz[0] > 0) {
          console.log("Quiz marked as complete for student");
        } else {
          console.log("Failed to mark quiz as complete for student");
        }
      } catch (error) {
        console.error("Error updating quiz status:", error);
      }

      return res.json({
        message: "You have exhausted all your allowed attempts for this quiz",
        attempts: scoreRecord.attempts,
        completed: true,
      });
    } else {
      // If not yet exhausted, simply return the current attempt count.
      return res.json({
        message: "Quiz attempt recorded",
        attempts: scoreRecord.attempts,
      });
    }
  } catch (error) {
    console.error("Error completing quiz for student:", error);
    return res.status(500).json({
      message: "Server error, couldn't record quiz attempt",
      details: error.message,
    });
  }
};

export const getAllAssessmentByUser = async (req, res) => {
  const { userId } = req.params;
  console.log("user assesment to fetch: ", userId);
  try {
    const assessments = await Assessment.findAll({
      where: { userId },
      include: [
        {
          model: TaskCategory,
          attributes: ["name"],
        },
        {
          model: Subject, // Include the subject here
          attributes: ["name"], // Get the subject name
        },
      ],
    });

    res.status(200).json(assessments);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch assessments", details: err.message });
  }
};

// Get All Assessments for a student
export const getAllAssessmentByStudent = async (req, res) => {
  const { studentId } = req.params;
  console.log("fetch assesments for student id: ", studentId);
  try {
    // Check if the student exists
    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: Class,
          as: "class", // Include class information
          attributes: ["name"], // Fetch class name
        },
      ],
    });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Fetch assessments and their scores for the student
    const assessments = await Assessment.findAll({
      include: [
        {
          model: StudentAssessmentScore,
          where: { student_id: studentId },
          attributes: ["score", "max_score"],
        },
        {
          model: TaskCategory,
          attributes: ["name", "desc"],
        },
        {
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
      ],
    });

    res.status(200).json({ assessments, class: student });
  } catch (error) {
    console.error("Error fetching assessments for student:", error);
    res.status(500).json({
      error: "Failed to fetch student assessments",
      details: error.message,
    });
  }
};

// export const getAllAssessmentForStudent = async (req, res) => {
//   const { studentId } = req.params;
//   console.log("fetch assesments for student id: ", studentId);
//   try {
//     // Check if the student exists
//     const student = await Student.findByPk(studentId);
//     if (!student) {
//       return res.status(404).json({ error: "Student not found" });
//     }

//     // Fetch assessments and their scores for the student
//     const assessments = await Assessment.findAll({
//       include: [
//         {
//           model: StudentAssessmentScore,
//           required: false,
//           attributes: ["score", "max_score"],
//           where: { student_id: studentId },
//         },
//         {
//           model: TaskCategory,
//           attributes: ["name", "desc"],
//         },
//         {
//           model: Subject,
//           attributes: ["name"],
//         },
//         {
//           model: Class,
//           attributes: ["name"],
//         },
//       ],
//     });

//     res.status(200).json({ assessments });
//   } catch (error) {
//     console.error("Error fetching assessments for student:", error);
//     res.status(500).json({
//       error: "Failed to fetch student assessments",
//       details: error.message,
//     });
//   }
// };

export const getAllAssessmentForStudent = async (req, res) => {
  const { studentId } = req.params;
  console.log("Fetching assessments for student id:", studentId);
  try {
    // 1. Find the student along with the subjects they offer
    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: Subject,
          as: "Subjects",
          attributes: ["id"],
          through: { attributes: [] }, // exclude data from join table
        },
      ],
    });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // 2. Extract the subject IDs associated with this student
    const subjectIds = student.Subjects.map((subject) => subject.id);

    // 3. Fetch assessments that match the student's class and have a subject in the student's subjects list
    const assessments = await Assessment.findAll({
      where: {
        class_id: student.class_id,
        subject_id: subjectIds, // Sequelize will automatically interpret this as "subject_id IN ( ... )"
      },
      include: [
        {
          model: StudentAssessmentScore,
          required: false, // Include score info if available; otherwise, it'll be null
          attributes: ["score", "max_score", "isComplete"],
          where: { student_id: studentId },
        },
        {
          model: TaskCategory,
          attributes: ["name", "desc"],
        },
        {
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
      ],
    });

    res.status(200).json({ assessments });
  } catch (error) {
    console.error("Error fetching assessments for student:", error);
    res.status(500).json({
      error: "Failed to fetch student assessments",
      details: error.message,
    });
  }
};

export const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.findAll({
      include: [{ model: TaskCategory, attributes: ["name", "desc"] }],
    });

    res.status(200).json(assessments);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch assessments", details: err.message });
  }
};

export const getAllAssessmentsBySchool = async (req, res) => {
  const { schoolId } = req.params; // Extract school ID from request

  try {
    const assessments = await Assessment.findAll({
      where: { school_id: schoolId }, // Filter by school
      include: [
        { model: TaskCategory, attributes: ["name", "desc"] },
        {
          model: StudentAssessmentScore,
          attributes: ["student_id", "score", "max_score", "isComplete"],
          required: false, // Allow assessments with no scores yet
        },
      ],
    });

    res.status(200).json({ assessments });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch assessments",
      details: err.message,
    });
  }
};

export const getGrandAveragePerformance = async (req, res) => {
  const { schoolId } = req.params;

  try {
    // Fetch all students in the school
    const students = await Student.findAll({
      where: { schoolId: schoolId },
      attributes: ["id", "class_id"],
    });

    if (!students.length) {
      return res
        .status(404)
        .json({ error: "No students found for this school." });
    }

    // Fetch all assessments for the school
    const assessments = await Assessment.findAll({
      where: { schoolId: schoolId },
      include: [
        {
          model: StudentAssessmentScore,
          attributes: ["student_id", "score", "max_score"],
        },
      ],
    });

    if (!assessments.length) {
      return res
        .status(404)
        .json({ error: "No assessments found for this school." });
    }

    // Initialize class-based data storage
    let classScores = {};
    let classAssessments = {};

    students.forEach((student) => {
      classScores[student.class_id] = 0;
      classAssessments[student.class_id] = 0;
    });

    // Compute scores per class
    assessments.forEach((assessment) => {
      assessment.StudentAssessmentScores.forEach((scoreEntry) => {
        const student = students.find((s) => s.id === scoreEntry.student_id);
        if (student) {
          classScores[student.class_id] += scoreEntry.score;
          classAssessments[student.class_id]++;
        }
      });
    });

    // Compute class averages
    let classAverages = {};
    Object.keys(classScores).forEach((classId) => {
      classAverages[classId] =
        classAssessments[classId] > 0
          ? classScores[classId] / classAssessments[classId]
          : 0;
    });

    // Compute GRAND AVERAGE (Average of class averages)
    const classValues = Object.values(classAverages);
    const grandAverage =
      classValues.length > 0
        ? classValues.reduce((sum, avg) => sum + avg, 0) / classValues.length
        : 0;

    res.status(200).json({ grandAverage: grandAverage.toFixed(2) });
  } catch (err) {
    console.error("Error fetching grand average performance:", err);
    res.status(500).json({
      error: "Failed to calculate grand average performance",
      details: err.message,
    });
  }
};

export const getTopPerformers = async (req, res) => {
  const { schoolId } = req.params;

  try {
    // Fetch all students in the school
    const students = await Student.findAll({
      where: { schoolId },
      attributes: ["id", "class_id", "name"], // Include names for better display
    });

    if (!students.length) {
      return res
        .status(404)
        .json({ error: "No students found for this school." });
    }

    // Fetch all student assessment scores for this school
    const assessments = await Assessment.findAll({
      where: { schoolId },
      include: [
        {
          model: StudentAssessmentScore,
          attributes: ["student_id", "score", "max_score"],
        },
      ],
    });

    if (!assessments.length) {
      return res
        .status(404)
        .json({ error: "No assessments found for this school." });
    }

    // Initialize student-based data storage
    let studentScores = {}; // Store total scores per student
    let studentAssessments = {}; // Store number of assessments per student

    students.forEach((student) => {
      studentScores[student.id] = 0;
      studentAssessments[student.id] = 0;
    });

    // Compute scores per student
    assessments.forEach((assessment) => {
      assessment.StudentAssessmentScores.forEach((scoreEntry) => {
        if (studentScores[scoreEntry.student_id] !== undefined) {
          studentScores[scoreEntry.student_id] += scoreEntry.score;
          studentAssessments[scoreEntry.student_id]++;
        }
      });
    });

    // Compute student averages and store them
    let studentAverages = students.map((student) => ({
      id: student.id,
      name: `${student.name}`,
      classId: student.class_id,
      average:
        studentAssessments[student.id] > 0
          ? studentScores[student.id] / studentAssessments[student.id]
          : 0,
    }));

    // Sort students by their average score (descending order)
    studentAverages.sort((a, b) => b.average - a.average);

    // Get the top 3 performers
    const topPerformers = studentAverages.slice(0, 3);

    res.status(200).json({ topPerformers });
  } catch (err) {
    console.error("Error fetching top performers:", err);
    res.status(500).json({
      error: "Failed to calculate top performers",
      details: err.message,
    });
  }
};

export const getMostImprovedStudents = async (req, res) => {
  const { schoolId } = req.params;

  console.log("most imp sch ID: ", schoolId);

  if (!schoolId) {
    return res.status(404).json({ error: "No  school ID prvided!" });
  }
  try {
    // 1. Fetch all students in the school
    const students = await Student.findAll({
      where: { schoolId },
      attributes: ["id", "name", "class_id"],
    });

    if (!students.length || !students) {
      return res
        .status(404)
        .json({ error: "No students found for this school." });
    }

    // 2. Fetch all student scores, ordered by date
    const scores = await StudentAssessmentScore.findAll({
      include: [
        {
          model: Assessment,
          where: { schoolId },
          attributes: ["id", "createdAt"],
        },
      ],
      order: [["Assessment", "createdAt", "ASC"]], // Ensure assessments are sorted by date
    });

    if (!scores.length) {
      return res.status(404).json({ error: "No assessment scores found." });
    }

    // 3. Compute improvement for each student
    let studentProgress = {};

    scores.forEach((entry) => {
      const studentId = entry.student_id;
      const score = entry.score;

      if (!studentProgress[studentId]) {
        studentProgress[studentId] = {
          first: score,
          last: score,
          improvement: 0,
        };
      } else {
        studentProgress[studentId].last = score;
      }
    });

    // 4. Calculate improvement
    Object.keys(studentProgress).forEach((studentId) => {
      studentProgress[studentId].improvement =
        studentProgress[studentId].last - studentProgress[studentId].first;
    });

    // 5. Get top 3 most improved students
    const topImprovedStudents = Object.entries(studentProgress)
      .sort((a, b) => b[1].improvement - a[1].improvement)
      .slice(0, 3)
      .map(([studentId, data]) => ({
        studentId,
        name: students.find((s) => s.id == studentId)?.name || "Unknown",
        improvement: data.improvement.toFixed(2),
      }));

    res.status(200).json({ topImprovedStudents });
  } catch (err) {
    console.error("Error fetching most improved students:", err);
    res.status(500).json({
      error: "Failed to fetch most improved students",
      details: err.message,
    });
  }
};

export const SubjectAverage = async (req, res) => {
  const { currId } = req.params;

  try {
    const subjects = await Subject.findAll({
      where: { curriculumId: currId }, // ✅ Fixed where clause
      include: [
        {
          model: Assessment,
          include: [
            {
              model: StudentAssessmentScore,
              attributes: ["score"],
            },
          ],
        },
      ],
    });

    const subjectData = subjects.map((subject) => {
      // Extract all scores for this subject
      const scores = subject.Assessments.flatMap((assessment) =>
        assessment.StudentAssessmentScores.map((s) => s.score)
      );

      // Calculate average score
      const average =
        scores.length > 0
          ? scores.reduce((sum, score) => sum + score, 0) / scores.length
          : 0;

      return {
        name: subject.name,
        average: parseFloat(average.toFixed(2)), // Rounded to 2 decimals
      };
    });

    // console.log("Subject Data: ", subjectData);
    res.json(subjectData);
  } catch (error) {
    console.error("Error fetching subject performance:", error);
    res.status(500).json({ error: "Failed to fetch subject performance" });
  }
};

// Get Assessment by ID
export const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Assessment id recieved: ", id);
    const assessment = await Assessment.findOne({
      where: { id },
      include: [
        {
          model: StudentAssessmentScore,
          required: false, // Include score info if available; otherwise, it'll be null
          attributes: ["score"],
          where: { assessment_id: id },
        },
        {
          model: TaskCategory,
          attributes: ["name", "desc"],
        },
        {
          model: Subject,
          attributes: ["name"],
        },
        {
          model: Class,
          attributes: ["name"],
        },
      ],
    });

    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    res.status(200).json(assessment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch assessment", details: err.message });
  }
};

// Update Assessment
export const updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, class_id, subject_id, curriculum_id } = req.body;

    const assessment = await Assessment.findByPk(id);

    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    await assessment.update({
      name,
      type,
      class_id,
      subject_id,
      curriculum_id,
    });

    res
      .status(200)
      .json({ message: "Assessment updated successfully", data: assessment });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update assessment", details: err.message });
  }
};

// Delete Assessment
export const deleteAssessment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the assessment
    const assessment = await Assessment.findByPk(id);
    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    // Start a transaction to ensure consistency
    const transaction = await sequelize.transaction();

    try {
      // Check if there are any associated AssessmentQuiz entries
      const assessmentQuizzes = await AssessmentQuiz.findAll({
        where: { assessmentId: id },
        transaction,
      });

      if (assessmentQuizzes.length > 0) {
        // Get quiz IDs linked to this assessment
        const quizIds = assessmentQuizzes.map((aq) => aq.quizId);

        // Delete associated AssessmentQuiz entries
        await AssessmentQuiz.destroy({
          where: { assessmentId: id },
          transaction,
        });

        // Delete quizzes associated with these quiz IDs (if any)
        await Quiz.destroy({
          where: { id: quizIds },
          transaction,
        });
      }

      // Delete the assessment itself
      await assessment.destroy({ transaction });

      // Commit the transaction
      await transaction.commit();

      res.status(200).json({
        message: "Assessment and related quizzes deleted successfully",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete assessment",
      details: err.message,
    });
  }
};

// =----------------------------------------------------------------------------------------------------------------score controller

export const getScoresByAssessment = async (req, res) => {
  const { assessmentId } = req.params;
  console.log("assessment id: ", assessmentId);

  try {
    const scores = await StudentAssessmentScore.findAll({
      where: { assessment_id: assessmentId },
      include: [
        { model: Assessment }, // Include the assessment details
        { model: Student, attributes: ["id", "name", "class_id"] }, // Include student details
      ],
    });

    res.json({ scores });
  } catch (error) {
    res.status(500).json({ message: "Error fetching scores", error });
  }
};

export const updateScore = async (req, res) => {
  const { assessmentId, scores, max_score } = req.body;

  console.log("Updating scores info received:", assessmentId, scores);

  try {
    // Fetch all existing scores for this assessment and student combination
    const existingScores = await StudentAssessmentScore.findAll({
      where: {
        assessment_id: assessmentId, // Match the assessment ID
        student_id: { [Op.in]: scores.map((s) => s.student_id) }, // Match student IDs
      },
    });

    // Create a map for quick lookup (double-check with both assessmentId and studentId)
    const scoreMap = {};
    existingScores.forEach((s) => {
      const key = `${s.assessment_id}-${s.student_id}`; // Map based on both IDs
      scoreMap[key] = s; // Store the score object
    });

    // Process scores (update if exists, create if not)
    const processedScores = await Promise.all(
      scores.map(async (scoreData) => {
        const key = `${assessmentId}-${scoreData.student_id}`; // Generate lookup key
        const existingScore = scoreMap[key]; // Check if score exists

        if (existingScore) {
          // Update the existing score
          existingScore.score = scoreData.score; // Replace score with the new one
          return existingScore.save(); // Save the updated score
        } else {
          // Create a new score entry if it doesn't exist
          console.log(
            `Creating new score for assessment_id: ${assessmentId} and student_id: ${scoreData.student_id}`
          );

          return StudentAssessmentScore.create({
            assessment_id: assessmentId,
            student_id: scoreData.student_id,
            score: scoreData.score, // Add score
            max_score: max_score || existingScore.max_score, // Default max_score if not provided
          });
        }
      })
    );

    // Send response with all processed scores
    res.status(200).json(processedScores);
  } catch (error) {
    console.error("Error updating or creating scores:", error);
    res
      .status(500)
      .json({ message: "Error updating or creating scores", error });
  }
};

export const deleteScore = async (req, res) => {
  const { scoreId } = req.params;
  try {
    await StudentAssessmentScore.destroy({ where: { id: scoreId } });
    res.json({ message: "Score deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting score", error });
  }
};

export const addScores = async (req, res) => {
  const { assessmentId, scores, max_score } = req.body;

  console.log(
    "Adding or Updating scores info received:",
    assessmentId,
    scores,
    max_score
  );

  try {
    // Fetch all existing scores for this assessment and student pairs
    const existingScores = await StudentAssessmentScore.findAll({
      where: {
        [Op.or]: scores.map((s) => ({
          assessment_id: assessmentId, // Match assessment
          student_id: s.student_id, // Match student
        })),
      },
    });

    // Create a map with composite keys: "assessmentId_studentId"
    const scoreMap = {};
    existingScores.forEach((s) => {
      const key = `${s.assessment_id}_${s.student_id}`; // Composite key
      scoreMap[key] = s;
    });

    // Process scores (update existing or create new entries)
    const updatedScores = await Promise.all(
      scores.map(async (scoreData) => {
        const key = `${assessmentId}_${scoreData.student_id}`; // Create lookup key
        const existingScore = scoreMap[key]; // Check if score exists

        if (existingScore) {
          // Update existing score
          existingScore.score =
            scoreData.score !== "" ? scoreData.score : existingScore.score; // Preserve score if empty
          existingScore.max_score = max_score || existingScore.max_score; // Retain existing max_score if not provided
          return existingScore.save();
        } else {
          // Create a new score entry
          return StudentAssessmentScore.create({
            assessment_id: assessmentId,
            student_id: scoreData.student_id,
            score: scoreData.score !== "" ? scoreData.score : "0", // Default to 0 if empty
            max_score: max_score, // Default max_score if not provided
          });
        }
      })
    );

    // Send response with updated scores
    res.status(200).json(updatedScores);
  } catch (error) {
    console.error("Error adding or updating scores:", error);
    res.status(500).json({ message: "Error adding or updating scores", error });
  }
};

export const getScoreSheet = async (req, res) => {
  const { curriculumId, taskCategoryId } = req.params; // Path parameters
  const { startDate, endDate } = req.query; // Query parameters

  console.log(
    "Filtering scores by curriculum, task category, and date range:",
    {
      curriculumId,
      taskCategoryId,
      startDate,
      endDate,
    }
  );

  // Validate input
  if (!curriculumId || !taskCategoryId || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing required parameters." });
  }

  try {
    // Fetch assessments with related data
    const assessments = await Assessment.findAll({
      where: {
        curriculum_id: curriculumId,
        task_category_id: taskCategoryId,
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
      include: [
        {
          model: StudentAssessmentScore,
          required: true, // Optional: set to `false` to include assessments without scores
          include: [
            { model: Student, attributes: ["id", "name", "class_id"] }, // Include student details
          ],
        },
        { model: TaskCategory, attributes: ["id", "name"] }, // Include task category details
        { model: Subject, attributes: ["id", "name"] }, // Include subject details
        { model: Class, attributes: ["id", "name"] }, // Include subject details
      ],
    });

    // Respond with the filtered data
    if (assessments.length === 0) {
      return res.status(404).json({
        message: "No assessments with scores found for the given criteria.",
      });
    }

    res.status(200).json({ assessments });
  } catch (error) {
    console.error("Error fetching filtered scores:", error);
    res.status(500).json({ message: "Error fetching filtered scores", error });
  }
};

export const getFilteredAssessments = async (req, res) => {
  const { curriculumId, taskCategoryId } = req.params; // Get curriculum and task category IDs as path parameters

  console.log("Filtering assessments by curriculum and task category:", {
    curriculumId,
    taskCategoryId,
  });

  // Validate input
  if (!curriculumId && !taskCategoryId) {
    return res.status(400).json({
      message: "At least one of curriculumId or taskCategoryId is required.",
    });
  }

  // Prepare the where conditions dynamically based on provided parameters
  const whereConditions = {};

  // Add curriculum_id filter if provided
  if (curriculumId) {
    whereConditions.curriculum_id = curriculumId;
  }

  // Add task_category_id filter if provided
  if (taskCategoryId) {
    whereConditions.task_category_id = taskCategoryId;
  }

  try {
    // Fetch assessments based on dynamic conditions
    const assessments = await Assessment.findAll({
      where: whereConditions, // Apply dynamic filters
      include: [
        {
          model: StudentAssessmentScore, // Include scores even if not required
          include: [
            { model: Student, attributes: ["id", "name", "class_id"] }, // Include student details
          ],
        },
        { model: TaskCategory, attributes: ["id", "name"] }, // Include task category details
      ],
    });

    // Respond with the filtered data
    if (assessments.length === 0) {
      return res
        .status(404)
        .json({ message: "No assessments found for the given criteria." });
    }

    res.status(200).json({ assessments });
  } catch (error) {
    console.error("Error fetching filtered assessments:", error);
    res
      .status(500)
      .json({ message: "Error fetching filtered assessments", error });
  }
};

export const createQuizAssessment = async (req, res) => {
  const { userId, schoolId } = req.params;
  //const currentUserId = req.userId;
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "Missing required data" });
  }

  const parsedData = JSON.parse(data); // Parse the JSON string

  const {
    name,
    desc,
    task_category_id,
    subject_id,
    deadlineDateTime,
    quizAttempts,
    duration,
  } = parsedData.values;

  const {
    content: formQuestions,
    totalScore,
    class_id,
    curriculum_id,
  } = parsedData;

  //console.log("Received Quiz Details:", parsedData, req.params);

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const school = await School.findOne({ where: { specialId: schoolId } });
    if (!school) return res.status(404).json({ error: "School not found" });

    // Set deadline if provided
    const isDeadline = !!deadlineDateTime;
    const formattedDeadlineDate = isDeadline
      ? new Date(deadlineDateTime)
      : null;

    // Cap quiz duration at 30 minutes
    const finalDuration = Math.min(duration, 30);

    // Start a database transaction
    const transaction = await sequelize.transaction();

    try {
      // Determine the source of quiz questions
      let questions = [];
      if (req.file) {
        try {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.readFile(req.file.path);
          const worksheet = workbook.worksheets[0];
          // Assuming the first row is a header; adjust slice() if needed.
          questions = worksheet
            .getSheetValues()
            .slice(2)
            .map((row) => ({
              question: row[1],
              options: JSON.parse(row[2]), // Options must be a valid JSON string in the Excel cell.
              correctAnswer: row[3],
            }));
          fs.unlinkSync(req.file.path); // Delete file after processing
        } catch (error) {
          await transaction.rollback();
          return res.status(500).json({
            error: "Error processing uploaded file",
            details: error.message,
          });
        }
      } else {
        // Use questions from the form if no file was uploaded
        questions = formQuestions;
      }

      // Validate that we have at least one question
      if (!questions || questions.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ error: "No quiz questions provided" });
      }

      // Create quiz entries in the Quiz table
      const quizEntries = await Promise.all(
        questions.map(async (q) => {
          return await Quiz.create(
            {
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
            },
            { transaction }
          );
        })
      );

      if (quizEntries.length === 0) {
        await transaction.rollback();
        return res.status(401).json({ error: "No quiz entries created" });
      }
      const quizIds = quizEntries.map((quiz) => quiz.id);

      // Create the assessment record and store quiz IDs as a JSON array in timedQuizId
      const newAssessment = await Assessment.create(
        {
          name,
          tscore: totalScore,
          desc,
          task_category_id,
          class_id,
          subject_id,
          curriculum_id,
          schoolId: school.specialId,
          userId: user.id || userId,
          duration: finalDuration,
          isDeadline,
          quizAttempts,
          isQuiz: true,
          deadlineDateTime: formattedDeadlineDate,
          timedQuizId: JSON.stringify(quizIds),
        },
        { transaction }
      );

      // Link quizzes to the assessment using the AssessmentQuiz association table
      await Promise.all(
        quizIds.map(async (quizId) => {
          return await AssessmentQuiz.create(
            {
              assessmentId: newAssessment.id,
              quizId: quizId,
            },
            { transaction }
          );
        })
      );

      await transaction.commit();

      console.log("Assessment and quizzes created successfully");

      res.status(201).json({
        message: "Assessment created successfully",
        assessment: newAssessment,
        quizzes: quizEntries,
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create assessment", details: err.message });
  }
};

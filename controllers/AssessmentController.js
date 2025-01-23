import { Assessment, StudentAssessmentScore } from "../models/Assessment.js";
import TaskCategory from "../models/TaskCategory.js";
import Student from "../models/Student.js";
import Subject from "../models/Subjects.js";
import Class from "../models/Class.js";
import School from "../models/School.js";
import User from "../models/User.js";
import { Op } from "sequelize";

// Create Assessment
export const createAssessment = async (req, res) => {
  const { userId, schoolId } = req.params;
  const { values, class_id, curriculum_id } = req.body;
  const { name, tscore, task_category_id, subject_id } = values;

  console.log("create task details recived: ", req.body, values, req.params);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const school = await School.findOne({ where: { specialId: schoolId } });

    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    const newAssessment = await Assessment.create({
      name,
      tscore,
      task_category_id,
      class_id,
      subject_id,
      curriculum_id,
      schoolId: school.specialId,
      userId: user.id || userId,
    });

    if (newAssessment) {
      console.log("assessment created");
    }
    res.status(201).json({
      message: "Assessment created successfully",
      data: newAssessment,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create assessment", details: err.message });
  }
};

// Get All Assessments
export const getAllAssessmentByUser = async (req, res) => {
  const { userId } = req.params;
  console.log("user assesment to fetch: ", userId);
  try {
    const assessments = await Assessment.findAll({
      where: { userId },
      include: [{ model: TaskCategory, attributes: ["name", "desc"] }],
    });

    res.status(200).json(assessments);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch assessments", details: err.message });
  }
};

// Get All Assessments
export const getAllAssessmentByStudent = async (req, res) => {
  const { studentId } = req.params;
  console.log("stduent assesment to fetch: ", studentId);
  try {
    // Check if the student exists
    const student = await Student.findByPk(studentId);
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

// Get Assessment by ID
export const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Assessment id recieved: ", id);
    const assessment = await Assessment.findByPk(id);

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

    const assessment = await Assessment.findByPk(id);

    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    await assessment.destroy();
    res.status(200).json({ message: "Assessment deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete assessment", details: err.message });
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

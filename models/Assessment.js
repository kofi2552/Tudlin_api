import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import TaskCategory from "./TaskCategory.js";
import Student from "./Student.js";
import Subject from "./Subjects.js";
import Class from "./Class.js";
import Quiz from "./Quiz.js";

const Assessment = sequelize.define(
  "Assessment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    desc: { type: DataTypes.STRING, allowNull: true },
    tscore: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: true },
    duration: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }, // Time limit in minutes
    timedQuizId: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    task_category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: TaskCategory,
        key: "id",
      },
    },
    class_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: "CASCADE",
    },
    curriculum_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    schoolId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taskLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isDeadline: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // False means no deadline
    },
    isQuiz: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // False means no deadline
    },
    quizAttempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0, // Tracks how many times a user has attempted this quiz
    },
    deadlineDateTime: {
      type: DataTypes.DATE,
      allowNull: true, // If null, no deadline is set
      validate: {
        isDate: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const StudentAssessmentScore = sequelize.define(
  "StudentAssessmentScore",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    assessment_id: {
      type: DataTypes.UUID,
      references: { model: "Assessments", key: "id" },
      allowNull: false,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    max_score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 100,
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0, // Tracks how many times a user has attempted this quiz
    },
    isComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Tracks how many times a user has attempted this quiz
    },
  },
  {
    timestamps: true,
  }
);

// Setting relationships
Assessment.hasMany(StudentAssessmentScore, { foreignKey: "assessment_id" });
StudentAssessmentScore.belongsTo(Assessment, { foreignKey: "assessment_id" });

// Establish relationships
TaskCategory.hasMany(Assessment, { foreignKey: "task_category_id" });
Assessment.belongsTo(TaskCategory, { foreignKey: "task_category_id" });

// Define the relationship
Student.hasMany(StudentAssessmentScore, { foreignKey: "student_id" });
StudentAssessmentScore.belongsTo(Student, { foreignKey: "student_id" });

Assessment.belongsTo(Subject, {
  foreignKey: "subject_id",
  onDelete: "CASCADE",
});

Subject.hasMany(Assessment, { foreignKey: "subject_id" });

Assessment.belongsTo(Class, { foreignKey: "class_id" });

Assessment.belongsToMany(Quiz, { through: "AssessmentQuiz" });
Quiz.belongsToMany(Assessment, { through: "AssessmentQuiz" });

export { Assessment, StudentAssessmentScore };

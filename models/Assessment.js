import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import TaskCategory from "./TaskCategory.js";
import Student from "./Student.js";
import Subject from "./Subjects.js";
import Class from "./Class.js";

const Assessment = sequelize.define(
  "Assessment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }, // Name of the assessment (e.g., "Midterm Exam")
    tscore: { type: DataTypes.INTEGER, allowNull: false },
    task_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TaskCategory,
        key: "id",
      },
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
    },
    curriculum_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    schoolId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

const StudentAssessmentScore = sequelize.define(
  "StudentAssessmentScore",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    assessment_id: {
      type: DataTypes.INTEGER,
      references: { model: "Assessments", key: "id" },
      allowNull: false,
    }, // Foreign key to Assessment
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, // Foreign key to Student
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }, // Score of the student for the assessment
    max_score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 100,
    }, // Maximum possible score for this assessment
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

Assessment.belongsTo(Class, { foreignKey: "class_id" });

export { Assessment, StudentAssessmentScore };

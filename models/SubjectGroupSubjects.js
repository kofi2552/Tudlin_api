import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Subject from "./Subjects.js"; // Import the Subjects model
import SubjectGroup from "./SubjectGroups.js"; // Import the SubjectGroup model

// Define the through table
const SubjectGroupSubjects = sequelize.define("SubjectGroupSubjects", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Set up the associations
Subject.belongsToMany(SubjectGroup, {
  through: SubjectGroupSubjects,
  foreignKey: "subjectId",
  as: "subjectGroups",
});

SubjectGroup.belongsToMany(Subject, {
  through: SubjectGroupSubjects,
  foreignKey: "subjectGroupId",
  as: "subjects",
});

export default SubjectGroupSubjects;

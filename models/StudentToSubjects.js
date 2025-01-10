import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Student from "./Student.js";
import Subject from "./Subjects.js";

// Define the through table for Student-Subject association
const StudentToSubjects = sequelize.define("StudentToSubjects", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Set up Student-Subject associations
Student.belongsToMany(Subject, {
  through: StudentToSubjects,
  foreignKey: "studentId",
  as: "Subjects",
});

Subject.belongsToMany(Student, {
  through: StudentToSubjects,
  foreignKey: "subjectId",
  as: "Students",
});

export default StudentToSubjects;

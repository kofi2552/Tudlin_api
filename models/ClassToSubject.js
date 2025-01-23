// models/associations.js
import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Subject from "./Subjects.js"; // Import the Subjects model
import Class from "./Class.js"; // Import the SubjectGroup model

// Define the through table
const ClassToSubjects = sequelize.define("ClassToSubjects", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Set up the associations
Subject.belongsToMany(Class, {
  through: ClassToSubjects,
  foreignKey: "subjectId",
  as: "Classes",
});

Class.belongsToMany(Subject, {
  through: ClassToSubjects,
  foreignKey: "classId",
  as: "Subjects",
});

ClassToSubjects.belongsTo(Subject, { foreignKey: "subjectId" });
Subject.hasMany(ClassToSubjects, { foreignKey: "subjectId" });

export default ClassToSubjects;

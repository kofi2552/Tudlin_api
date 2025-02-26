import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Curriculum from "./Curriculum.js";
import Class from "./Class.js";

// Define the through table
const CurriculumToClasses = sequelize.define("CurriculumToClasses", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Set up the associations
Class.belongsToMany(Curriculum, {
  through: CurriculumToClasses,
  foreignKey: "classId",
  as: "Curriculum",
  onDelete: "CASCADE",
});

Curriculum.belongsToMany(Class, {
  through: CurriculumToClasses,
  foreignKey: "curriculumId",
  as: "Classes",
  onDelete: "CASCADE",
});

export default CurriculumToClasses;

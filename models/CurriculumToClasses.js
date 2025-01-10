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
  as: "Curriculum", // Alias for the associated curriculums
});

Curriculum.belongsToMany(Class, {
  through: CurriculumToClasses,
  foreignKey: "curriculumId",
  as: "Classes", // Alias for the associated classes
});

export default CurriculumToClasses;

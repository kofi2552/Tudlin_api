import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import StudyAreas from "./StudyAreas.js"; // Import the StudyAreas model
import Curriculum from "./Curriculum.js"; // Import the Curriculum model

// Define the through table
const CurriculumStudyAreas = sequelize.define("CurriculumStudyAreas", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Set up the associations
StudyAreas.belongsToMany(Curriculum, {
  through: CurriculumStudyAreas,
  foreignKey: "studyAreaId",
  as: "curriculums",
});

Curriculum.belongsToMany(StudyAreas, {
  through: CurriculumStudyAreas,
  foreignKey: "curriculumId",
  as: "studyAreas",
});

export default CurriculumStudyAreas;

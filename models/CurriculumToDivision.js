import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Curriculum from "./Curriculum.js";
import CurrDivision from "./CurrDivision.js";

const CurriculumToDivision = sequelize.define("CurriculumToDivision", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  curriculumId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Curriculum,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  divisionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CurrDivision,
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

// Define relationships
Curriculum.belongsToMany(CurrDivision, {
  through: CurriculumToDivision,
  foreignKey: "curriculumId",
});

CurrDivision.belongsToMany(Curriculum, {
  through: CurriculumToDivision,
  foreignKey: "divisionId",
});

export default CurriculumToDivision;

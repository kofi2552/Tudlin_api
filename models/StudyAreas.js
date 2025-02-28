import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const StudyAreas = sequelize.define(
  "StudyAreas",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    curriculumId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default StudyAreas;

import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const StudyAreas = sequelize.define(
  "StudyAreas",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

export default StudyAreas;

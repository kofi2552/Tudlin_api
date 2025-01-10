// models/Curriculum.js
import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Subject from "./Subjects.js";

const Curriculum = sequelize.define(
  "Curriculum",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
  }
);

Curriculum.hasMany(Subject, {
  foreignKey: "curriculumId",
  onDelete: "CASCADE",
});
Subject.belongsTo(Curriculum, { foreignKey: "curriculumId" });

export default Curriculum;

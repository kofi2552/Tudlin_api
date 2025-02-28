// models/CurriculumSubject.js
import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Curriculum from "./Curriculum.js";
import Subject from "./Subjects.js";

const CurriculumSubject = sequelize.define(
  "CurriculumSubject",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    studyArea: { type: DataTypes.STRING, allowNull: false },
    studyAreaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    curriculumId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Curriculums",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
  }
);

// Associate with Curriculum
Curriculum.hasMany(CurriculumSubject, {
  foreignKey: "curriculumId",
  onDelete: "CASCADE",
});
CurriculumSubject.belongsTo(Curriculum, { foreignKey: "curriculumId" });

CurriculumSubject.belongsTo(Subject, {
  foreignKey: "subjectId",
  as: "subject",
  onDelete: "CASCADE",
});
Subject.hasMany(CurriculumSubject, {
  foreignKey: "subjectId",
  as: "curriculumSubjects",
  onDelete: "CASCADE",
});

export default CurriculumSubject;

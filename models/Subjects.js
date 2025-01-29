import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Subject = sequelize.define(
  "Subject",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: true },
    studyareaid: {
      type: DataTypes.INTEGER, // Changed from STRING to INTEGER
      allowNull: true,
      references: {
        model: "StudyAreas", // Matches the table name
        key: "id",
      },
      onUpdate: "CASCADE", // Optional for cascading updates
      onDelete: "SET NULL", // Optional for handling deletions
    },
    class_id: { type: DataTypes.INTEGER, allowNull: true },
    isArchive: { type: DataTypes.BOOLEAN, defaultValue: false },
    curriculumId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Curriculums",
        key: "id",
      },
    },
  },

  {
    timestamps: true,
  }
);

export default Subject;

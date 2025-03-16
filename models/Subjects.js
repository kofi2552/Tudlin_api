import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Subject = sequelize.define(
  "Subject",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT("long"), allowNull: true },
    studyareaid: {
      type: DataTypes.UUID, // Changed from STRING to INTEGER
      allowNull: true,
      references: {
        model: "StudyAreas", // Matches the table name
        key: "id",
      },
      onUpdate: "CASCADE", // Optional for cascading updates
      onDelete: "SET NULL", // Optional for handling deletions
    },
    class_id: { type: DataTypes.UUID, allowNull: true },
    isArchive: { type: DataTypes.BOOLEAN, defaultValue: false },
    curriculumId: {
      type: DataTypes.UUID,
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

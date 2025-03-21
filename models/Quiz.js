import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Quiz = sequelize.define("Quiz", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  question: { type: DataTypes.STRING, allowNull: false }, // The question text
  options: { type: DataTypes.JSON, allowNull: false }, // Multiple-choice options (JSON array)
  correctAnswer: { type: DataTypes.STRING, allowNull: false }, // The correct answer
});

export default Quiz;

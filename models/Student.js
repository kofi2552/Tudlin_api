import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Student = sequelize.define(
  "Student",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    class_id: { type: DataTypes.INTEGER, allowNull: true },
    curriculum_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    timestamps: true,
  }
);

export default Student;

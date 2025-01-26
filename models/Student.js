import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import School from "./School.js";
import Class from "./Class.js";

const Student = sequelize.define(
  "Student",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    class_id: { type: DataTypes.INTEGER, allowNull: false },
    curriculum_id: { type: DataTypes.INTEGER, allowNull: false },
    schoolId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Schools",
        key: "specialId",
      },
      onDelete: "SET NULL",
    },
  },
  {
    timestamps: true,
  }
);

// Define associations
School.hasMany(Student, { foreignKey: "schoolId", onDelete: "SET NULL" });
// Establish relationship with School
Student.belongsTo(School, { foreignKey: "schoolId", targetKey: "specialId" });

export default Student;

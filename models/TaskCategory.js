import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const TaskCategory = sequelize.define(
  "TaskCategory",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    desc: { type: DataTypes.STRING, allowNull: true },
    schoolId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default TaskCategory;

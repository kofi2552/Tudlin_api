import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Class = sequelize.define(
  "Class",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    years: {
      type: DataTypes.ENUM,
      values: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      allowNull: true,
      defaultValue: "1",
    },
  },
  {
    timestamps: true,
  }
);

export default Class;

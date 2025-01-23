// models/Curriculum.js
import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const CurrDivision = sequelize.define(
  "CurrDivision",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    specialId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default CurrDivision;

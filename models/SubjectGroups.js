import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const SubjectGroups = sequelize.define(
  "SubjectGroup",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default SubjectGroups;

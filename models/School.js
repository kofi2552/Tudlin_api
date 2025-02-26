import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const School = sequelize.define(
  "School",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    specialId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // New field for school type
  },
  {
    timestamps: true,
  }
);

export default School;

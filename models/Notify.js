import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const Notify = sequelize.define(
  "Notify",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    subtitle: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    buttonUrl: { type: DataTypes.STRING, allowNull: false },
    buttonText: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Go",
    },
  },
  {
    timestamps: true,
  }
);

export default Notify;

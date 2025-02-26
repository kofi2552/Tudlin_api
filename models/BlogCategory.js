import { DataTypes } from "sequelize";
import sequelize from "../database.js";

const BlogCategory = sequelize.define(
  "BlogCategory",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    desc: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    timestamps: false,
  }
);

export default BlogCategory;

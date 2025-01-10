// /backend/models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import bcrypt from "bcryptjs";
import Class from "./Class.js";

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Unique key for username
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Unique key for email
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    class_id: { type: DataTypes.INTEGER, allowNull: true },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM("tutor", "student", "parent"),
      allowNull: false,
      defaultValue: "tutor",
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["username", "email"], // Consolidate unique constraint
      },
    ],
  }
);

User.belongsTo(Class, { foreignKey: "class_id" });

export default User;

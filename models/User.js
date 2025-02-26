import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import bcrypt from "bcryptjs";
import School from "./School.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM("tutor", "student", "parent", "user"),
      allowNull: false,
      defaultValue: "tutor",
    },
    schoolId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Schools",
        key: "specialId",
      },
      onDelete: "SET NULL",
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
        fields: ["username", "email"],
      },
    ],
  }
);

// Define associations
School.hasMany(User, { foreignKey: "schoolId", onDelete: "SET NULL" });
// Establish relationship with School
User.belongsTo(School, { foreignKey: "schoolId", targetKey: "specialId" });

export default User;

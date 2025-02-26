import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import User from "./User.js";
import Student from "./Student.js";

const ChatUsers = sequelize.define(
  "ChatUsers",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    chatId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Chat",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isRep: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastReadAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["chatId", "userId"],
      },
    ],
  }
);

ChatUsers.belongsTo(User, { foreignKey: "userId", as: "User" });
ChatUsers.belongsTo(Student, { foreignKey: "studentId", as: "Student" });

export default ChatUsers;

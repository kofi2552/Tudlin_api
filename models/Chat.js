// models/Chat.js
import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import User from "./User.js";
import Student from "./Student.js";
import ChatUsers from "./ChatUsers.js";

const Chat = sequelize.define("Chat", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: true },
  isGroupChat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  schoolId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false, // User who created the chat
  },
  recievedBy: {
    type: DataTypes.UUID,
    allowNull: true, // User who recieved the chat
  },
});

Chat.belongsToMany(User, {
  through: ChatUsers,
  foreignKey: "chatId",
  otherKey: "userId",
});
Chat.belongsToMany(Student, {
  through: ChatUsers,
  foreignKey: "chatId",
  otherKey: "studentId",
});

Chat.hasMany(ChatUsers, {
  foreignKey: "chatId",
  as: "ChatParticipants", // Use a unique alias
  onDelete: "CASCADE",
});
ChatUsers.belongsTo(Chat, { foreignKey: "chatId", onDelete: "CASCADE" });

export default Chat;

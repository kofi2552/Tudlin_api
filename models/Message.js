// models/Message.js
import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import ChatUsers from "./ChatUsers.js";
import User from "./User.js";
import Student from "./Student.js";
import Chat from "./Chat.js";

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  chatId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Chats",
      key: "id",
    },
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  senderType: {
    type: DataTypes.ENUM("user", "student"),
    allowNull: false,
  },
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  recipientType: {
    type: DataTypes.ENUM("user", "student", "chatUser"),
    allowNull: false,
  },
});

// Relationships
Message.belongsTo(Chat, { foreignKey: "chatId", onDelete: "CASCADE" });

Message.belongsTo(User, {
  as: "SenderUser",
  foreignKey: "senderId",
  constraints: false,
});
Message.belongsTo(Student, {
  as: "SenderStudent",
  foreignKey: "senderId",
  constraints: false,
});

Message.belongsTo(User, {
  as: "RecipientUser",
  foreignKey: "recipientId",
  constraints: false,
});
Message.belongsTo(Student, {
  as: "RecipientStudent",
  foreignKey: "recipientId",
  constraints: false,
});
Message.belongsTo(ChatUsers, {
  as: "RecipientChatUser",
  foreignKey: "recipientId",
  constraints: false,
});

export default Message;

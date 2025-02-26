import sequelize from "../database.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Message from "../models/Message.js";
import ChatUsers from "../models/ChatUsers.js";
import { Op } from "sequelize";

export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const senderId = req.userId; // Authenticated sender
  const senderType = req.isStudent ? "student" : "user"; // Determine sender type

  if (!chatId || !content) {
    return res.status(400).json({ error: "Chat ID and content are required" });
  }

  try {
    // Fetch the chat and check if it exists
    const chat = await Chat.findByPk(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // ✅ GROUP CHAT LOGIC
    if (chat.isGroupChat) {
      // Fetch the student rep for this group chat
      const studentRep = await ChatUsers.findOne({
        where: { chatId, isRep: true },
        attributes: ["studentId"],
      });

      // Check if the sender is either:
      // - The creator of the group chat (a user)
      // - The student rep
      const isCreator = chat.createdBy === senderId && senderType === "user";
      const isStudentRep = studentRep && studentRep.studentId === senderId;

      if (!isCreator && !isStudentRep) {
        return res.status(403).json({
          error:
            "Only the group creator or student representative can send messages in this group chat",
        });
      }

      // Fetch all recipients (excluding sender)
      const recipients = await ChatUsers.findAll({
        where: { chatId, studentId: { [Op.ne]: senderId } }, // Exclude sender
        attributes: ["studentId", "userId"],
      });

      if (!recipients.length) {
        return res
          .status(400)
          .json({ error: "No valid recipients in this group chat" });
      }

      // Save messages for each recipient
      const messages = await Promise.all(
        recipients.map(async (recipient) => {
          return Message.create({
            content,
            chatId,
            senderId,
            senderType,
            recipientId: recipient.studentId || recipient.userId,
            //recipientId: recipient.id,
            recipientType: "chatUser",
          });
        })
      );

      // Fetch sender details
      let sender = null;
      if (senderType === "user") {
        sender = await User.findByPk(senderId, {
          attributes: ["id", "username"],
        });
      } else {
        sender = await Student.findByPk(senderId, {
          attributes: ["id", "name"],
        });
      }

      // Return only the last sent message (to match frontend structure)
      const lastMessage = messages[messages.length - 1];

      return res.status(201).json({
        id: lastMessage.id,
        content: lastMessage.content,
        chatId: lastMessage.chatId,
        senderId: lastMessage.senderId,
        senderType: lastMessage.senderType,
        recipientId: lastMessage.recipientId,
        createdAt: lastMessage.createdAt,
        updatedAt: lastMessage.updatedAt,
        senderName: sender?.name || sender?.username || "Unknown Sender",
        recipientName: "Group Chat", // Placeholder since multiple recipients exist
      });
    }

    // ✅ ONE-TO-ONE CHAT LOGIC (UNCHANGED)
    if (chat.createdBy !== senderId && chat.recievedBy !== senderId) {
      return res.status(403).json({ error: "You are not part of this chat" });
    }

    // Identify recipient for one-to-one chat
    const recipientId =
      chat.createdBy === senderId ? chat.recievedBy : chat.createdBy;

    let recipientType;
    if (recipientId) {
      const userRecipient = await User.findByPk(recipientId);
      recipientType = userRecipient ? "user" : "student";
    }
    // Save the message
    const message = await Message.create({
      content,
      chatId,
      senderId,
      senderType,
      recipientId,
      recipientType,
    });

    // Fetch sender and recipient details
    let sender = null;
    let recipient = null;

    if (senderType === "user") {
      sender = await User.findByPk(senderId, {
        attributes: ["id", "username"],
      });
    } else {
      sender = await Student.findByPk(senderId, { attributes: ["id", "name"] });
    }

    recipient =
      (await User.findByPk(recipientId, { attributes: ["id", "username"] })) ||
      (await Student.findByPk(recipientId, { attributes: ["id", "name"] }));

    // Return the formatted message response
    return res.status(201).json({
      id: message.id,
      content: message.content,
      chatId: message.chatId,
      senderId: message.senderId,
      senderType: message.senderType,
      recipientId: message.recipientId,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      senderName: sender?.name || sender?.username,
      recipientName: recipient?.name || recipient?.username,
    });
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findByPk(chatId, {
      attributes: ["isGroupChat", "createdBy"],
    });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    let messagesQuery = {
      where: { chatId },
      order: [["createdAt", "ASC"]],
      include: [
        { model: Chat, attributes: ["id", "isGroupChat"] },
        { model: User, as: "SenderUser", attributes: ["id", "username"] },
        { model: Student, as: "SenderStudent", attributes: ["id", "name"] },
        { model: User, as: "RecipientUser", attributes: ["id", "username"] },
        { model: Student, as: "RecipientStudent", attributes: ["id", "name"] },
      ],
    };

    // ✅ If it's a group chat, fetch messages from both the student rep & creator
    if (chat.isGroupChat) {
      const studentRep = await ChatUsers.findOne({
        where: { chatId, isRep: true },
        attributes: ["studentId"],
      });

      if (!studentRep) {
        return res
          .status(400)
          .json({ error: "No student rep found for this group chat" });
      }

      messagesQuery.where.senderId = {
        [Op.or]: [studentRep.studentId, chat.createdBy], // ✅ Fetch messages from rep & creator
      };
    }

    const messages = await Message.findAll(messagesQuery);

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      chatId: msg.chatId,
      senderId: msg.senderId,
      senderType: msg.senderType,
      recipientId: msg.recipientId,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      isGroupChat: msg.Chat?.isGroupChat || false,

      senderName:
        msg.senderType === "user"
          ? msg.SenderUser?.username || "Unknown User"
          : msg.SenderStudent?.name || "Unknown Student",

      recipientName: chat.isGroupChat
        ? "Group Chat"
        : msg.RecipientUser?.username || msg.RecipientStudent?.name,
    }));

    res.status(200).json(formattedMessages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

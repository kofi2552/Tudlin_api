// controllers/chatController.js
import sequelize from "../database.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import { ChatUsers } from "../models/associations.js";
import Class from "../models/Class.js";
import Subject from "../models/Subjects.js";
import Message from "../models/Message.js";
import { Op, TableHints } from "sequelize";

// Access or Create a One-to-One Chat
export const CreateChat = async (req, res) => {
  const { schoolId } = req.params;
  const { name, userId } = req.body; // userId is the recipient (user or student)
  const currentUserId = req.userId; // Authenticated user ID

  console.log(
    "recieved details to create chat: ",
    schoolId,
    name,
    userId,
    currentUserId
  );

  if (!userId) {
    return res.status(400).json({ error: "Recipient ID (userId) is required" });
  }

  try {
    // Step 1: Ensure both participants exist (User or Student)
    const currentUser =
      (await User.findByPk(currentUserId)) ||
      (await Student.findByPk(currentUserId));
    const recipient =
      (await User.findByPk(userId)) || (await Student.findByPk(userId));

    if (!currentUser)
      return res.status(404).json({ error: "Current user not found" });
    if (!recipient)
      return res.status(404).json({ error: "Recipient not found" });

    // Step 2: Check if a chat already exists between these two participants
    let existingChat = await Chat.findOne({
      where: {
        isGroupChat: false,
        [Op.or]: [
          { createdBy: currentUserId, recievedBy: userId },
          { createdBy: userId, recievedBy: currentUserId },
        ],
      },
    });

    if (existingChat) {
      // Fetch the full updated chat list
      const foundChats = await Chat.findAll({
        where: {
          schoolId,
          [Op.or]: [
            { createdBy: currentUserId },
            { recievedBy: currentUserId },
          ],
        },
        order: [["createdAt", "DESC"]],
      });

      return res
        .status(200)
        .json({ foundChats, message: "Chat already exits!" });
    }

    // Step 3: Create a new chat
    const newChat = await Chat.create({
      isGroupChat: false,
      schoolId,
      createdBy: currentUserId,
      recievedBy: userId,
      name: name || "One-on-One Chat",
    });

    //console.log("new chat created: ", newChat);

    const updatedChats = await Chat.findAll({
      where: {
        schoolId,
        [Op.or]: [{ createdBy: currentUserId }, { recievedBy: currentUserId }], // User must be part of the chat
      },
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
        {
          model: Student,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(updatedChats);
  } catch (err) {
    console.error("Error creating chat:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const fetchAllChats = async (req, res) => {
  const { schoolId } = req.params;
  const currentUserId = req.userId;

  console.log("Received details to fetch chat:", schoolId, currentUserId);

  try {
    // Ensure user exists in either Users or Students
    const currentUserAsUser = await User.findByPk(currentUserId);
    const currentUserAsStudent = await Student.findByPk(currentUserId);

    if (!currentUserAsUser && !currentUserAsStudent) {
      return res.status(404).json({
        error: "Current user not found in Users or Students table",
      });
    }

    // **FETCH GROUP CHATS**
    const groupChats = await Chat.findAll({
      where: { schoolId, isGroupChat: true },
      include: [
        {
          model: ChatUsers,
          as: "ChatParticipants", // Use alias from associations
          where: {
            [Op.or]: [{ userId: currentUserId }, { studentId: currentUserId }],
          },
          attributes: ["userId", "studentId"],
          required: true, // Ensures only chats with participants are retrieved
        },
      ],
    });

    // **FETCH ONE-ON-ONE CHATS**
    const oneOnOneChats = await Chat.findAll({
      where: {
        schoolId,
        isGroupChat: false,
        [Op.or]: [
          { createdBy: currentUserId }, // Chats initiated by user
          { recievedBy: currentUserId }, // Chats received by user
        ],
      },
      include: [
        {
          model: User,
          as: "Users",
          attributes: ["id", "username", "email"],
        },
        {
          model: Student,
          as: "Students",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // **FORMAT GROUP CHATS**
    const formattedGroupChats = groupChats.map((chat) => ({
      id: chat.id,
      name: chat.name,
      isGroupChat: true,
      participants: chat.ChatParticipants.map((cu) => ({
        id: cu.studentId || cu.userId,
      })),
    }));

    // **FORMAT ONE-ON-ONE CHATS**
    const formattedOneOnOneChats = oneOnOneChats.map((chat) => {
      return {
        id: chat.id,
        name: chat.name,
        isGroupChat: false,
        sender: {
          id: chat.createdBy,
          name: chat.Users?.[0]?.username || chat.Students?.[0]?.name,
        },
        recipient: {
          id: chat.recievedBy,
          name: chat.Users?.[0]?.username || chat.Students?.[0]?.name,
        },
      };
    });

    // **COMBINE RESULTS**
    const allChats = [...formattedGroupChats, ...formattedOneOnOneChats];

    return res.status(200).json(allChats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    return res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const CreateGroupChat = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { schoolId } = req.params;
    const { name, type, referenceId, repId } = req.body;
    const currentUserId = req.userId;

    console.log(
      "Received details to create group chat:",
      schoolId,
      name,
      type,
      referenceId,
      currentUserId,
      repId
    );

    // Ensure the creator is a User (not a Student)
    const currentUser = await User.findByPk(currentUserId, { transaction });
    if (!currentUser) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ error: "Only users can create group chats" });
    }

    // Validate type and get students
    let students = [];
    if (type === "class") {
      const classExists = await Class.findByPk(referenceId, { transaction });
      if (!classExists) {
        await transaction.rollback();
        return res.status(404).json({ error: "Class not found" });
      }

      students = await Student.findAll({
        where: { class_id: referenceId },
        transaction,
      });
    } else if (type === "subject") {
      const subjectExists = await Subject.findByPk(referenceId, {
        transaction,
      });
      if (!subjectExists) {
        await transaction.rollback();
        return res.status(404).json({ error: "Subject not found" });
      }

      // Fetch students who are enrolled in the subject
      students = await Student.findAll({
        include: {
          model: Subject,
          as: "Subjects",
          where: { id: referenceId },
          through: { attributes: [] },
        },
        transaction,
      });
    } else {
      await transaction.rollback();
      return res.status(400).json({ error: "Invalid group type" });
    }

    // Log the students found
    console.log(
      `Found ${students.length} students for ${type} with ID ${referenceId}`
    );

    // If no students found, prevent chat creation
    if (students.length === 0) {
      await transaction.rollback();
      return res.status(404).json({
        error: `No students found for the selected ${type}. Group chat cannot be created.`,
      });
    }

    // Check if the chat already exists for this class/subject
    const existingChat = await Chat.findOne({
      where: { schoolId, name, isGroupChat: true },
      transaction,
    });

    if (existingChat) {
      await transaction.rollback();
      return res
        .status(200)
        .json({ message: "Group chat already exists!", chat: existingChat });
    }

    // Create the group chat
    const newChat = await Chat.create(
      {
        isGroupChat: true,
        schoolId,
        createdBy: currentUserId,
        name,
      },
      { transaction }
    );

    // Add the creator to the group chat
    await ChatUsers.create(
      {
        chatId: newChat.id,
        userId: currentUserId,
      },
      { transaction }
    );

    // Add students to the group chat
    const chatParticipants = students.map((student) => ({
      chatId: newChat.id,
      userId: currentUserId, // Ensure userId is repeated for all
      studentId: student.id, // No null entries, each row has a studentId
      isRep: student.id === repId, // Only the selected rep has isRep = true
    }));

    if (chatParticipants.length > 0) {
      await ChatUsers.bulkCreate(chatParticipants, { transaction });
    }

    await transaction.commit(); // Commit the transaction

    const allGroupChats = await Chat.findAll({
      where: {
        schoolId,
        [Op.or]: [{ createdBy: currentUserId }], // User must be part of the chat
      },
    });

    return res.status(201).json(allGroupChats);
  } catch (err) {
    console.error("Error creating group chat:", err);

    // Check if the transaction has already been committed
    console.log("Transaction state:", transaction.finished);

    if (transaction.finished !== "commit") {
      await transaction.rollback();
      console.log("Transaction rolled back successfully.");
    } else {
      console.log("Transaction already committed, skipping rollback.");
    }

    return res.status(500).json({ error: err.message });
  }
};

export const updateChat = async (req, res) => {
  const { chatId } = req.params;
  const { name } = req.body;

  console.log("Updating chat with ID:", chatId);

  try {
    if (!name) {
      return res.status(400).json({ message: "Chat name is required" });
    }

    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Update chat name
    chat.name = name;
    await chat.save();

    // Fetch updated chat list (assuming you want to return all chats)
    const updatedChats = await Chat.findAll();

    return res.status(200).json(updatedChats);
  } catch (error) {
    console.error("Error updating chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const deleteChat = async (req, res) => {
//   const { chatId } = req.params;
//   const userId = req.userId; // Authenticated user

//   console.log("deleting chat with id: ", chatId);

//   try {
//     // Step 1: Fetch the chat and check ownership
//     const chat = await Chat.findByPk(chatId);
//     if (!chat) return res.status(404).json({ error: "Chat not found" });

//     if (chat.createdBy !== userId && chat.recievedBy !== userId) {
//       return res
//         .status(403)
//         .json({ error: "You can only delete your own chats" });
//     }

//     // Step 2: Delete all messages in this chat
//     await Message.destroy({ where: { chatId } });

//     // Step 3: Delete the chat itself
//     await Chat.destroy({ where: { id: chatId } });

//     return res.status(200).json({ message: "Chat deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting chat:", err);
//     return res.status(500).json({ error: "Failed to delete chat" });
//   }
// };

export const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.userId; // Authenticated user

  console.log(
    "deleting chat with id: ",
    chatId,
    userId,
    "..........................................................................."
  );

  const transaction = await sequelize.transaction(); // Start transaction

  try {
    // Step 1: Fetch the chat
    const chat = await Chat.findByPk(chatId, { transaction });
    if (!chat) {
      await transaction.rollback();
      return res.status(404).json({ error: "Chat not found" });
    }

    // Step 2: Check if it's a group chat or one-to-one chat
    if (chat.isGroup) {
      // Group Chat Deletion Logic
      if (chat.createdBy !== userId) {
        await transaction.rollback();
        return res
          .status(403)
          .json({ error: "Only the group creator can delete this chat" });
      }

      // Step 3: Delete all messages in the group chat
      await Message.destroy({ where: { chatId }, transaction });

      await Chat.destroy({ where: { id: chatId }, transaction });
      // Step 5: Delete the chat itself

      // Step 4: Delete all participants from ChatUsers (prevents FK issues)
      await ChatUsers.destroy({ where: { chatId }, transaction });

      await transaction.commit(); // Commit transaction
      return res
        .status(200)
        .json({ message: "Group chat deleted successfully" });
    } else {
      // One-to-One Chat Deletion Logic
      if (chat.createdBy !== userId && chat.recievedBy !== userId) {
        await transaction.rollback();
        return res
          .status(403)
          .json({ error: "You can only delete your own chats" });
      }

      // Step 3: Delete all messages in the chat
      await Message.destroy({ where: { chatId }, transaction });

      // Step 4: Delete the chat itself
      await Chat.destroy({ where: { id: chatId }, transaction });

      await transaction.commit(); // Commit transaction
      return res
        .status(200)
        .json({ message: "One-to-one chat deleted successfully" });
    }
  } catch (err) {
    await transaction.rollback(); // Rollback on error
    console.error("Error deleting chat:", err);
    return res.status(500).json({ error: "Failed to delete chat" });
  }
};

// REMOVE CONTRAINTS ON CHATUSER Table

// // ---------FIRST SHOW CONSTRAINTS
// SELECT CONSTRAINT_NAME, TABLE_NAME
// FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
// WHERE TABLE_NAME = 'ChatUsers' AND CONSTRAINT_TYPE = 'UNIQUE';

// ------RUN MIGRATION
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Remove old constraints if they exist
//     await queryInterface.removeConstraint("ChatUsers", "ChatUsers_userId_chatId_unique").catch(() => {});

//     // Ensure userId + chatId is NOT unique (removes old constraints)
//     await queryInterface.removeIndex("ChatUsers", ["chatId", "userId"]).catch(() => {});

//     // Ensure studentId + chatId is UNIQUE
//     await queryInterface.addConstraint("ChatUsers", {
//       fields: ["chatId", "studentId"],
//       type: "unique",
//       name: "ChatUsers_studentId_chatId_unique",
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     // Rollback: Remove unique constraint on studentId + chatId
//     await queryInterface.removeConstraint("ChatUsers", "ChatUsers_studentId_chatId_unique");

//     // Re-add unique constraint on userId + chatId in case of rollback
//     await queryInterface.addConstraint("ChatUsers", {
//       fields: ["chatId", "userId"],
//       type: "unique",
//       name: "ChatUsers_userId_chatId_unique",
//     });
//   }
// };

// ---------------------FIND FOREIGN KEYS TO CHATUSERS:
// SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
// FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
// WHERE TABLE_NAME = 'ChatUsers' AND COLUMN_NAME = 'userId';

// DROP THE FOREIGN KEYS (which shows from the result above):
// ALTER TABLE ChatUsers DROP FOREIGN KEY chatusers_ibfk_2;
// ALTER TABLE ChatUsers DROP FOREIGN KEY chatusers_ibfk_5;

// DROP THE INDEX:
// ALTER TABLE ChatUsers DROP INDEX ChatUsers_userId_chatId_unique;

// RE-ADD THE FOREIGN KEYS WITHOUT UNIQUENESS:
// ALTER TABLE ChatUsers ADD CONSTRAINT chatusers_ibfk_2 FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE;
// ALTER TABLE ChatUsers ADD CONSTRAINT chatusers_ibfk_5 FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE;

// RUN TO CONFIRM CHANGES:
// SELECT CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME
// FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
// WHERE TABLE_NAME = 'ChatUsers';

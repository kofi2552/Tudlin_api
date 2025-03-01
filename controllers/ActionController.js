import ActionLog from "../models/ActionLogs.js";
import User from "../models/User.js";

export const AddAction = async (req, res) => {
  const { type, content, userId, schoolId } = req.body;

  console.log("recieved actions: ", req.body);

  if (!type || !content || !userId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const newLog = await ActionLog.create({
      type,
      content,
      userId,
      schoolId,
    });
    res.status(201).json("Action added");
  } catch (error) {
    console.error("Failed to save action log:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const GetAllActionsByUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const logs = await ActionLog.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.json(logs);
  } catch (error) {
    console.error("Failed to fetch action logs:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const GetAllActions = async (req, res) => {
  try {
    const logs = await ActionLog.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"], // Select specific user fields to return
        },
      ],
      order: [["createdAt", "DESC"]], // Order logs by latest first
    });

    res.json(logs);
  } catch (error) {
    console.error("Failed to fetch action logs:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

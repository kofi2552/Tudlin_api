// routes/chatRoutes.js
import express from "express";
import {
  CreateChat,
  CreateGroupChat,
  deleteChat,
  fetchAllChats,
  updateChat,
} from "../controllers/chatController.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/create/:schoolId", verifyToken, CreateChat);
router.post("/create-group/:schoolId", verifyToken, CreateGroupChat);
router.post("/send-message", verifyToken, sendMessage);
router.get("/messages/:chatId", getMessages);
router.get("/all/:schoolId", verifyToken, fetchAllChats);
router.delete("/del/:chatId", verifyToken, deleteChat);
router.put("/edit/:chatId", verifyToken, updateChat);

export default router;

import express from "express";
import { sendChatMessage } from "../controllers/AgentController.js";

const router = express.Router();

// Route for querying AI
router.post("/chat", sendChatMessage);

export default router;

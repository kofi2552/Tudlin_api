import express from "express";
import {
  AddAction,
  GetAllActions,
  GetAllActionsByUser,
} from "../controllers/ActionController.js";

const router = express.Router();

// Route for querying logs
router.post("/add", AddAction);
router.get("/logs/all/:userId", GetAllActionsByUser);
router.get("/all", GetAllActions);

export default router;

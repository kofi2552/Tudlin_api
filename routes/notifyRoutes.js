import express from "express";
import {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/notifyController.js";

const router = express.Router();

router.post("/event/add", createEvent);
router.get("/events/all", getAllEvents);
router.put("/event/edit/:id", updateEvent);
router.delete("/event/del/:id", deleteEvent);

export default router;

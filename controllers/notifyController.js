import Notify from "../models/Notify.js";
export const createEvent = async (req, res) => {
  try {
    const { title, subtitle, description, imageUrl, buttonText, buttonUrl } =
      req.body;

    console.log("event req.body: ", req.body);
    const newEvent = await Notify.create({
      title,
      subtitle,
      description,
      imageUrl,
      buttonText,
      buttonUrl,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Notify.findAll();

    if (!events || events.length === 0) {
      return res.status(204).json({ message: "No Events yet" });
    }
    res.status(200).json(events);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedEvent = await Notify.update(req.body, {
      where: { id },
    });

    if (!updatedEvent[0])
      return res.status(404).json({ error: "Event not found" });

    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Notify.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Event not found" });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};

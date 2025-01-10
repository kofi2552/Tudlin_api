import Class from "../models/Class.js";

// Create a new class
export const createClass = async (req, res) => {
  const { name, cgroup } = req.body;
  console.log("new class:", req.body);

  try {
    const newClass = await Class.create({
      name,
      cgroup,
    });
    res
      .status(201)
      .json({ message: "Class added successfully!", class: newClass });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Failed to add class. Please try again." });
  }
};

// Get all classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    console.log(classes);
    res.status(200).json({ classes });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch classes. Please try again." });
  }
};

// Update class details
export const updateClass = async (req, res) => {
  const { id } = req.params; // Class ID from the URL
  const { name } = req.body; // Data sent from the client
  console.log("update class with id:", id);

  try {
    const classToUpdate = await Class.findByPk(id);

    if (!classToUpdate) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Update class details
    await classToUpdate.update({
      name: name || classToUpdate.name,
    });

    res
      .status(200)
      .json({ message: "Class updated successfully", class: classToUpdate });
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({ error: "Failed to update class" });
  }
};

// Delete a class
export const deleteClass = async (req, res) => {
  const { id } = req.params; // Class ID from the URL
  console.log("deleted class id:", id);

  try {
    const classToDelete = await Class.findByPk(id);

    if (!classToDelete) {
      return res.status(404).json({ error: "Class not found" });
    }

    await classToDelete.destroy(); // Delete the class
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ error: "Failed to delete class" });
  }
};

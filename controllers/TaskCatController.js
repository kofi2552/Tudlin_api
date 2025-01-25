import TaskCategory from "../models/TaskCategory.js";
import School from "../models/School.js";

// Create a new task category
export const createTaskCategory = async (req, res) => {
  const { schoolId } = req.params;
  const { name, desc } = req.body;

  try {
    const school = await School.findOne({ where: { specialId: schoolId } });
    if (school) {
      const taskCategory = await TaskCategory.create({ name, desc, schoolId });
      res.status(201).json({ taskCategory });
    } else {
      res.status(401).json({ message: "School doesn't exist!" });
    }
  } catch (error) {
    console.error("Error creating task category:", error);
    res.status(500).json({ error: "Failed to create task category." });
  }
};

// Get all task categories
export const getAllTaskCategories = async (req, res) => {
  const { schoolId } = req.params;
  try {
    const taskCategories = await TaskCategory.findAll({ where: { schoolId } });
    res.status(200).json({ taskCategories });
  } catch (error) {
    console.error("Error fetching task categories:", error);
    res.status(500).json({ error: "Failed to fetch task categories." });
  }
};

// Get a single task category by ID
export const getTaskCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const taskCategory = await TaskCategory.findByPk(id);
    if (!taskCategory) {
      return res.status(404).json({ error: "Task category not found." });
    }
    res.status(200).json({ taskCategory });
  } catch (error) {
    console.error("Error fetching task category:", error);
    res.status(500).json({ error: "Failed to fetch task category." });
  }
};

// Update a task category
export const updateTaskCategory = async (req, res) => {
  const { id } = req.params;
  const { name, desc } = req.body;

  try {
    const taskCategory = await TaskCategory.findByPk(id);
    if (!taskCategory) {
      return res.status(404).json({ error: "Task category not found." });
    }

    taskCategory.name = name;
    taskCategory.desc = desc;
    await taskCategory.save();

    res.status(200).json({ taskCategory });
  } catch (error) {
    console.error("Error updating task category:", error);
    res.status(500).json({ error: "Failed to update task category." });
  }
};

// Delete a task category
export const deleteTaskCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const taskCategory = await TaskCategory.findByPk(id);
    if (!taskCategory) {
      return res.status(404).json({ error: "Task category not found." });
    }

    await taskCategory.destroy();
    res.status(200).json({ message: "Task category deleted successfully." });
  } catch (error) {
    console.error("Error deleting task category:", error);
    res.status(500).json({ error: "Failed to delete task category." });
  }
};

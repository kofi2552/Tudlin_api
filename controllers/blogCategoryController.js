import BlogCategory from "../models/BlogCategory.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, desc } = req.body;

    const newCategory = await BlogCategory.create({ name, desc });
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  console.log("fetching blog categories ..................");
  try {
    const categories = await BlogCategory.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await BlogCategory.findByPk(id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

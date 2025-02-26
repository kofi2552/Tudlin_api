import express from "express";
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/blogController.js";

import {
  createCategory,
  getAllCategories,
  deleteCategory,
} from "../controllers/blogCategoryController.js";

const router = express.Router();

// Blog Post Routes
router.post("/posts", createBlogPost);
router.get("/posts", getAllBlogPosts);
router.get("/posts/:id", getBlogPostById);
router.put("/posts/:id", updateBlogPost);
router.delete("/posts/:id", deleteBlogPost);

// Category Routes
router.post("/blog-categories", createCategory);
router.get("/blog-categories", getAllCategories);
router.delete("/blog-categories/:id", deleteCategory);

export default router;

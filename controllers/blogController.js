import BlogPost from "../models/BlogPost.js";
import BlogCategory from "../models/BlogCategory.js";
import slugify from "slugify";

// Create a new blog post
export const createBlogPost = async (req, res) => {
  console.log("creating blog post...");
  try {
    const { title, content, excerpt, categoryId, featuredImage, publishedAt } =
      req.body;

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    const newPost = await BlogPost.create({
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      publishedAt,
      categoryId,
    });

    res
      .status(201)
      .json({ message: "Blog post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all blog posts
export const getAllBlogPosts = async (req, res) => {
  console.log("fetching blog post");
  try {
    const posts = await BlogPost.findAll({
      include: [{ model: BlogCategory, attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single blog post by ID
export const getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findByPk(id, {
      include: [{ model: BlogCategory, attributes: ["id", "name"] }],
    });

    if (!post) return res.status(404).json({ error: "Blog post not found" });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a blog post
export const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, categoryId, featuredImage, publishedAt } =
      req.body;

    const post = await BlogPost.findByPk(id);
    if (!post) return res.status(404).json({ error: "Blog post not found" });

    const updatedSlug = slugify(title, { lower: true, strict: true });

    await post.update({
      title,
      slug: updatedSlug,
      content,
      excerpt,
      featuredImage,
      publishedAt,
      categoryId,
    });

    res.status(200).json({ message: "Blog post updated successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a blog post
export const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await BlogPost.findByPk(id);
    if (!post) return res.status(404).json({ error: "Blog post not found" });

    await post.destroy();
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

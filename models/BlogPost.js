import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import BlogCategory from "./BlogCategory.js";

const BlogPost = sequelize.define(
  "BlogPost",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    excerpt: { type: DataTypes.STRING, allowNull: true },
    featuredImage: { type: DataTypes.STRING, allowNull: true },
    publishedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    timestamps: true, // creates createdAt and updatedAt fields
  }
);

// Association: A blog post belongs to a category.
BlogPost.belongsTo(BlogCategory, { foreignKey: "categoryId" });

export default BlogPost;

// backend/sequelize.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

// Test connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

export default sequelize;

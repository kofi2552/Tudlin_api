// backend/sequelize.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// const sequelize = new Sequelize("stupro", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log,
});

// Test connection

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

export default sequelize;

// sequelize
//   .sync({ alter: true }) // Use { force: true } to drop and recreate tables (use cautiously)
//   .then(() => console.log("Database synced successfully"))
//   .catch((err) => console.error("Database sync error:", err));

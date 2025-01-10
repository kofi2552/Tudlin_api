// backend/sequelize.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("stupro", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// const sequelize = new Sequelize(
//   "wauercfmnzyooavg_tudlin",
//   "wauercfmnzyooavg_tudlin",
//   "Kyde@25!",
//   {
//     host: "localhost",
//     dialect: "mysql",
//   }
// );

// Test connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

export default sequelize;

// sequelize
//   .sync({ alter: true }) // or { force: true } if you're okay with dropping existing tables
//   .then(() => {
//     console.log("Database synced successfully.");
//   })
//   .catch((error) => {
//     console.error("Error syncing database:", error);
//   });

import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import User from "./User.js";

const ActionLog = sequelize.define("ActionLog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  schoolId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

ActionLog.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

export default ActionLog;

// /backend/models/UserClassSubject.js
import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import User from "./User.js";
import Class from "./Class.js";
import Subject from "./Subjects.js";

const UserClassSubject = sequelize.define(
  "UserClassSubject",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Class,
        key: "id",
      },
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "classId", "subjectId"], // Composite key: userId + classId + subjectId
      },
    ],
  }
);

UserClassSubject.belongsTo(User, { foreignKey: "userId" });
UserClassSubject.belongsTo(Class, { foreignKey: "classId" });
UserClassSubject.belongsTo(Subject, { foreignKey: "subjectId" });

export default UserClassSubject;

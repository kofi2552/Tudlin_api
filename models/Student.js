import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import School from "./School.js";
import Class from "./Class.js";

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: true }, // Allow null password
    class_id: { type: DataTypes.UUID, allowNull: false },
    curriculum_id: { type: DataTypes.UUID, allowNull: false },
    schoolId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Schools",
        key: "specialId",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    hooks: {
      beforeCreate: async (student) => {
        if (student.password) {
          const salt = await bcrypt.genSalt(10);
          student.password = await bcrypt.hash(student.password, salt);
        }
      },
      beforeUpdate: async (student) => {
        if (student.password && student.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          student.password = await bcrypt.hash(student.password, salt);
        }
      },
    },
    timestamps: true,
  }
);

// Define associations
School.hasMany(Student, { foreignKey: "schoolId", onDelete: "SET NULL" });
// Establish relationship with School
Student.belongsTo(School, { foreignKey: "schoolId", targetKey: "specialId" });

export default Student;

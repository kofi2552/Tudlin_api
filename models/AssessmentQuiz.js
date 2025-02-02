import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { Assessment } from "./Assessment.js";
import Quiz from "./Quiz.js";

const AssessmentQuiz = sequelize.define("AssessmentQuiz", {
  assessmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Assessment,
      key: "id",
    },
  },
  quizId: {
    type: DataTypes.INTEGER,
    references: {
      model: Quiz,
      key: "id",
    },
  },
});

AssessmentQuiz.belongsTo(Assessment, { foreignKey: "assessmentId" });
AssessmentQuiz.belongsTo(Quiz, { foreignKey: "quizId" });

export default AssessmentQuiz;

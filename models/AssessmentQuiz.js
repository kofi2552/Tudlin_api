import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { Assessment } from "./Assessment.js";
import Quiz from "./Quiz.js";

const AssessmentQuiz = sequelize.define("AssessmentQuiz", {
  assessmentId: {
    type: DataTypes.UUID,
    references: { model: "Assessments", key: "id" },
  },
  quizId: {
    type: DataTypes.UUID,
    references: {
      model: Quiz,
      key: "id",
    },
  },
});

AssessmentQuiz.belongsTo(Assessment, { foreignKey: "assessmentId" });
AssessmentQuiz.belongsTo(Quiz, { foreignKey: "quizId" });

export default AssessmentQuiz;

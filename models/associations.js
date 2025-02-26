import Student from "./Student.js";
import Class from "./Class.js";
import Curriculum from "./Curriculum.js";
import Subject from "./Subjects.js";
import StudyAreas from "./StudyAreas.js";
import User from "./User.js";
import Chat from "./Chat.js";
import ChatUsers from "./ChatUsers.js";

// Define associations
Curriculum.hasMany(Student, { foreignKey: "curriculum_id", as: "students" });
Student.belongsTo(Curriculum, {
  foreignKey: "curriculum_id",
  as: "curriculum",
});

Class.hasMany(Student, { foreignKey: "class_id", as: "students" });
Student.belongsTo(Class, { foreignKey: "class_id", as: "class" });

Curriculum.hasMany(Subject, { foreignKey: "curriculumId", as: "subjects" });
Subject.belongsTo(Curriculum, {
  foreignKey: "curriculumId",
  as: "curriculum",
});

Class.hasMany(Subject, { foreignKey: "class_id", as: "subjects" });
Subject.belongsTo(Class, { foreignKey: "class_id", as: "class" });

Subject.belongsTo(StudyAreas, {
  foreignKey: "studyareaid",
  as: "studyarea",
});

StudyAreas.hasMany(Subject, {
  foreignKey: "studyareaid",
  as: "subjects",
});

// Many-to-Many relationship setup
Chat.belongsToMany(User, {
  through: ChatUsers,
  foreignKey: "chatId",
  as: "ChatUsersList",
});

// Chat to Students (group chats)
Chat.belongsToMany(Student, {
  through: ChatUsers,
  foreignKey: "chatId",
  as: "ChatStudentsList",
});

// User to Chats
User.belongsToMany(Chat, {
  through: ChatUsers,
  foreignKey: "userId",
  as: "UserChatsList",
});

// Student to Chats
Student.belongsToMany(Chat, {
  through: ChatUsers,
  foreignKey: "studentId",
  as: "StudentChatsList",
});

export {
  Student,
  Subject,
  Class,
  ChatUsers,
  Chat,
  User,
  StudyAreas,
  Curriculum,
};

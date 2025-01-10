// /controllers/studentController.js
import sequelize from "../database.js";
import Student from "../models/Student.js";
import Subject from "../models/Subjects.js";
import StudentToSubjects from "../models/StudentToSubjects.js";

export const addStudentsToSubject = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { subjectId } = req.params;
    const { studentIds } = req.body; // Array of student IDs to be added

    console.log(
      "add stu-subj data received from front: ",
      subjectId,
      studentIds
    );

    // Check if the subject exists
    const subject = await Subject.findByPk(subjectId, { transaction });
    if (!subject) {
      await transaction.rollback();
      return res.status(404).json({ error: "Subject not found." });
    }

    // Validate that all student IDs exist
    const validStudents = await Student.findAll({
      where: { id: studentIds },
      attributes: ["id"], // Fetch only IDs for validation
      transaction,
    });

    const validStudentIds = validStudents.map((student) => student.id);
    const invalidStudentIds = studentIds.filter(
      (id) => !validStudentIds.includes(id)
    );

    if (invalidStudentIds.length > 0) {
      await transaction.rollback();
      return res.status(404).json({
        error: `Invalid student IDs: ${invalidStudentIds.join(", ")}`,
      });
    }

    // Bulk insert into the junction table
    const bulkData = validStudentIds.map((studentId) => ({
      studentId,
      subjectId,
    }));

    await StudentToSubjects.bulkCreate(bulkData, {
      transaction,
      ignoreDuplicates: true, // Prevent duplicate associations
    });

    await transaction.commit();
    res
      .status(200)
      .json({ message: "Students added to the subject successfully." });
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding students to subject:", error);
    res.status(500).json({ error: "Failed to add students to the subject." });
  }
};

export const removeStudentsFromSubject = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Extract subjectId from params and studentIds from query
    const { subjectId } = req.params;
    const { studentIds } = req.query; // Extract query parameter
    console.log(
      "REMOVE stu-subj data received from front: ",
      subjectId,
      studentIds
    );

    // Ensure studentIds is properly formatted
    const studentIdArray = studentIds
      ? studentIds.split(",").map(Number) // Convert to array of numbers
      : [];
    console.log("Parsed student IDs: ", studentIdArray);

    if (!studentIdArray.length) {
      await transaction.rollback();
      return res.status(400).json({ error: "No student IDs provided." });
    }

    // Check if the subject exists
    const subject = await Subject.findByPk(subjectId, { transaction });
    if (!subject) {
      await transaction.rollback();
      return res.status(404).json({ error: "Subject not found." });
    }

    console.log("REMOVE subjects found: ", subject);

    // Validate that all student IDs exist
    const validStudents = await Student.findAll({
      where: { id: studentIdArray },
      attributes: ["id"], // Fetch only IDs for validation
      transaction,
    });

    const validStudentIds = validStudents.map((student) => student.id);
    const invalidStudentIds = studentIdArray.filter(
      (id) => !validStudentIds.includes(id)
    );

    if (invalidStudentIds.length > 0) {
      await transaction.rollback();
      return res.status(404).json({
        error: `Invalid student IDs: ${invalidStudentIds.join(", ")}`,
      });
    }

    // Bulk delete from the junction table
    await StudentToSubjects.destroy({
      where: {
        studentId: validStudentIds,
        subjectId,
      },
      transaction,
    });

    await transaction.commit();
    res
      .status(200)
      .json({ message: "Students removed from the subject successfully." });
  } catch (error) {
    await transaction.rollback();
    console.error("Error removing students from subject:", error);
    res
      .status(500)
      .json({ error: "Failed to remove students from the subject." });
  }
};

export const getStudentSubjects = async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log("student id for subjects: ", studentId);

    // Fetch all associated subjects for the given student using the junction table
    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: Subject,
          as: "Subjects", // Use the alias defined in the association
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json(student.Subjects);
  } catch (error) {
    console.error("Error fetching subjects for student:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch subjects for the student." });
  }
};

export const getSubjectStudents = async (req, res) => {
  try {
    const { subjectId } = req.params;
    console.log("get sub-stub data received from front: ", subjectId);

    // Fetch the subject with its associated students
    const subject = await Subject.findByPk(subjectId, {
      include: [
        {
          model: Student,
          as: "Students",
        },
      ],
    });

    // Check if the subject exists
    if (!subject) {
      return res.status(404).json({ error: "Subject not found." });
    }

    // Return the associated students
    res.status(200).json(subject.Students);
  } catch (error) {
    console.error("Error fetching students for subject:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch students for the subject." });
  }
};

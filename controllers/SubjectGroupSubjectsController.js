import SubjectGroupSubjects from "../models/SubjectGroupSubjects.js";
import Subjects from "../models/Subjects.js";
import SubjectGroup from "../models/SubjectGroups.js";
import Student from "../models/Student.js";

// Create a new subject group-subject assignment
export const assignSubjectToGroup = async (req, res) => {
  const { subjectId, groupId } = req.body;

  try {
    // Check if the subject and group exist
    const subject = await Subjects.findByPk(subjectId);
    const group = await SubjectGroup.findByPk(groupId);

    if (!subject || !group) {
      return res
        .status(404)
        .json({ message: "Subject or Subject Group not found." });
    }

    // Create the assignment
    await SubjectGroupSubjects.create({
      subjectId,
      subjectGroupId: groupId,
    });

    res.status(200).json({ message: "Subject assigned to group successfully" });
  } catch (err) {
    console.error("Error assigning subject to group:", err);
    res.status(500).json({ message: "Error assigning subject to group." });
  }
};

// Get all subjects for a specific group
export const getSubjectsByGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await SubjectGroup.findByPk(groupId, {
      include: {
        model: Subjects,
        as: "subjects",
      },
    });

    if (!group) {
      return res.status(404).json({ message: "Subject Group not found" });
    }

    res.status(200).json(group.subjects);
  } catch (err) {
    console.error("Error fetching subjects for group:", err);
    res.status(500).json({ message: "Error fetching subjects for group." });
  }
};

// Remove a subject from a specific group
export const removeSubjectFromGroup = async (req, res) => {
  const { subjectId, groupId } = req.body;

  try {
    const assignment = await SubjectGroupSubjects.findOne({
      where: {
        subjectId,
        subjectGroupId: groupId,
      },
    });

    if (!assignment) {
      return res
        .status(404)
        .json({ message: "Subject-Group assignment not found" });
    }

    // Delete the assignment
    await assignment.destroy();

    res
      .status(200)
      .json({ message: "Subject removed from group successfully" });
  } catch (err) {
    console.error("Error removing subject from group:", err);
    res.status(500).json({ message: "Error removing subject from group." });
  }
};

// Assign a subject group to a student
export const assignGroupToStudent = async (req, res) => {
  try {
    const { studentId, groupId } = req.body;
    const student = await Student.findByPk(studentId);
    const group = await SubjectGroup.findByPk(groupId);

    if (!student || !group) {
      return res
        .status(404)
        .json({ error: "Student or Subject group not found." });
    }

    await student.addSubjectGroup(group); // Assuming Student model has the association
    res.status(200).json({ message: "Subject group assigned to student." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to assign subject group to student." });
  }
};

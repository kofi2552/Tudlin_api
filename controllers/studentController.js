import { Student, Class, Curriculum } from "../models/associations.js";
import School from "../models/School.js";

// Create a new student
export const createStudent = async (req, res) => {
  const { curriculum_id, classG, name, email } = req.body;

  console.log("new student to be added: ", req.body);
  try {
    const newStudent = await Student.create({
      class_id: classG,
      curriculum_id,
      name,
      email,
    });

    res
      .status(201)
      .json({ message: "Student added successfully!", student: newStudent });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Failed to add student. Please try again." });
  }
};

// Fetch all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch students. Please try again." });
  }
};

// Fetch all students in a specific class
export const getStudentsByClass = async (req, res) => {
  const { classId } = req.params; // Get classId from the route parameters
  console.log("student class id: ", classId);
  try {
    // Fetch students where class_id matches the provided classId
    const students = await Student.findAll({
      where: { class_id: classId },
      include: {
        model: Class,
        as: "class",
        attributes: ["id", "name"], // Include only specific fields of the Class model
      },
    });

    if (!students || students.length === 0) {
      return res.status(200).json({
        students: students,
        message: "No students found for this class.",
      });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students for the class:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch students. Please try again." });
  }
};

// STUDENT LOGIN -------------------------------------------------------------
// Fetch a single student by ID
export const getStudentByEmail = async (req, res) => {
  const { email } = req.body;
  console.log("recieved email: ", email, req.body);
  try {
    const student = await Student.findOne({
      where: { email },
      include: [
        {
          model: Class,
          as: "class",
          attributes: ["id", "name"],
        },
        {
          model: Curriculum,
          as: "curriculum",
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const school = await School.findOne({
      where: { specialId: student.schoolId },
    });
    //console.log("school found: ", school);
    if (school) {
      res.status(200).json({ student, school });
    }
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// Fetch a single student by ID
export const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByPk(id, {
      include: [
        {
          model: Class,
          as: "class",
          attributes: ["id", "name"],
        },
        {
          model: Curriculum,
          as: "curriculum",
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};

// Update student details
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { class_id, curriculum_id, name, email } = req.body;

  console.log("parameters recieved: ", req.body);

  try {
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await student.update({
      class_id: class_id || student.class_id,
      name: name || student.name,
      email: email || student.email,
      curriculum_id: curriculum_id || student.curriculum_id,
    });

    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Failed to update student" });
  }
};

// Delete a student
export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await student.destroy();
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

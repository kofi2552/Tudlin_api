import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Student, Class, Curriculum } from "../models/associations.js";
import School from "../models/School.js";
import UserClassSubject from "../models/UserClassSubject.js";
import User from "../models/User.js";

// Create a new student
export const createStudent = async (req, res) => {
  const { schoolId } = req.params;
  const { curriculum_id, classG, name, email } = req.body;

  console.log("new student with sch id: ", schoolId);
  console.log("new student to be added: ", req.body);

  try {
    const student = await Student.findOne({ where: { email } });

    if (student) {
      return res.status(401).json({ message: "Oops! student already exists" });
    }

    const newStudent = await Student.create({
      class_id: classG,
      curriculum_id,
      name,
      email,
      schoolId,
    });

    res
      .status(201)
      .json({ message: "Student added successfully!", student: newStudent });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Failed to add student. Please try again." });
  }
};

// STUDENT LOGIN -------------------------------------------------------------
export const StudentLogin = async (req, res) => {
  const { email } = req.body;

  console.log("Verify received student email: ", email);

  try {
    // Find the student by email
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
      console.log("Student not found!");
      return res.status(404).json({ error: "Student not found." });
    }

    // Validate the password (if password is stored for students)
    // const isPasswordValid = await bcrypt.compare(password, student.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ error: "Invalid credentials." });
    // }

    // Generate a JWT token
    const token = jwt.sign(
      { id: student.id, email: student.email, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    // Set the token in an HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    });

    // Fetch the school information
    const school = await School.findOne({
      where: { specialId: student.schoolId },
    });

    // Return the student details, school info, and token
    res.status(200).json({
      message: "Login successful.",
      student,
      school,
      token,
    });
  } catch (error) {
    console.error("Error during student login:", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

export const SetStudentPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    // Update the password
    student.password = newPassword;
    await student.save();

    res.status(200).json({ message: "Password has been set successfully." });
  } catch (error) {
    console.error("Error setting password:", error);
    res.status(500).json({ error: "Failed to set password." });
  }
};

//Fetch teacher's students
export const getStudentsByTeacher = async (req, res) => {
  const { teacherId } = req.params;
  console.log("Fetching students for tutor with ID:", teacherId);

  try {
    // Find the tutor
    const tutor = await User.findByPk(teacherId);

    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found." });
    }

    // If tutor is an admin, return all students
    if (tutor.isAdmin) {
      const allStudents = await Student.findAll();
      return res.status(200).json({ students: allStudents });
    }

    // Find all class IDs where the teacher is assigned
    const teacherClasses = await UserClassSubject.findAll({
      where: { userId: teacherId },
      attributes: ["classId"],
    });

    // Extract class IDs
    const classIds = teacherClasses.map((tc) => tc.classId);

    if (classIds.length === 0) {
      return res
        .status(404)
        .json({ error: "No classes found for this teacher." });
    }

    // Fetch students who belong to these classes
    const students = await Student.findAll({
      where: { class_id: classIds },
    });

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students for teacher:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch students. Please try again." });
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

export const getAllStudentsBySchool = async (req, res) => {
  const { schoolId } = req.params;
  console.log("fetching all students with sch id: ", schoolId);
  try {
    const students = await Student.findAll({ where: { schoolId } });
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
  const { classId } = req.params;
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

// Fetch a single student by ID
export const getStudentByEmail = async (req, res) => {
  const { email } = req.body;
  console.log("recieved student email: ", email, req.body);
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
      console.log("Student not found!");
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

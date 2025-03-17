// controllers/userController.js
import User from "../models/User.js";
import createError from "../middleware/createError.js";
import School from "../models/School.js";
import UserClassSubjects from "../models/UserClassSubject.js";

// Create a new user
export const createUser = async (req, res, next) => {
  try {
    const { username, email, password, isAdmin, schoolId, role } = req.body;

    console.log("admin creating user: ", req.body);

    const school = await School.findOne({ where: { specialId: schoolId } });

    if (!school) {
      return res.status(404).json({ message: "No such School Exists" });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      isAdmin,
      schoolId,
      role,
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(createError(400, "Failed to create user: " + error.message));
  }
};

// Get a single user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return next(createError(404, "User not found"));
    res.status(200).json(user);
  } catch (error) {
    next(createError(500, "Error retrieving user: " + error.message));
  }
};

// Update a user
export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });

    if (!updatedUser[0]) return next(createError(404, "User not found"));
    res.status(200).json(updatedUser[1][0]);
  } catch (error) {
    next(createError(400, "Error updating user: " + error.message));
  }
};

// Delete a user
export const deleteUser = async (req, res, next) => {
  try {
    // Delete related records in UserClassSubjects first
    await UserClassSubjects.destroy({ where: { userId: req.params.id } });

    // Now delete the user
    const result = await User.destroy({ where: { id: req.params.id } });

    if (!result) return next(createError(404, "User not found"));

    res.status(204).send();
  } catch (error) {
    next(createError(500, "Error deleting user: " + error.message));
  }
};

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(createError(500, "Error fetching users: " + error.message));
  }
};

export const getAllTutorsBySchool = async (req, res, next) => {
  const { schoolId } = req.params;

  console.log("fetch tutors with id: ", schoolId);

  try {
    const tutors = await User.findAll({ where: { schoolId } });
    res.status(200).json(tutors);
  } catch (error) {
    next(createError(500, "Error fetching users: " + error.message));
  }
};

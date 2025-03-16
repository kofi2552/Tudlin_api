import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import UserClassSubject from "../models/UserClassSubject.js";
import dotenv from "dotenv";
import mailer from "../utils/mailer.js";
import { Op } from "sequelize";
import { Resend } from "resend";
import sendMail from "../utils/sendMail.js";
import sequelize from "../database.js";
import School from "../models/School.js";
import ActionLog from "../models/ActionLogs.js";

dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

// export const signup = async (req, res) => {
//   const { username, email, password, role, subjects } = req.body;

//   console.log("signup:", req.body);

//   try {
//     const existingUser = await User.findOne({
//       where: {
//         [Op.or]: [{ username }, { email }],
//       },
//     });

//     if (existingUser) {
//       const field = existingUser.username === username ? "username" : "email";
//       return res.status(409).json({ error: `${field} is already in use.` });
//     }

//     const transaction = await sequelize.transaction();

//     try {
//       // Create new user
//       const newUser = await User.create(
//         {
//           username,
//           email,
//           password,
//           role,
//         },
//         { transaction }
//       );

//       console.log("newUser: ", newUser);

//       // Process subjects: Ensure it's in the correct structure
//       const entries = Object.entries(subjects).flatMap(
//         ([classId, subjectIds]) =>
//           subjectIds.map((subjectId) => ({
//             userId: newUser.id,
//             classId: parseInt(classId, 10),
//             subjectId,
//           }))
//       );

//       console.log("Entries to insert:", entries);

//       // Insert into UserClassSubject
//       await UserClassSubject.bulkCreate(entries, { transaction });

//       // Commit transaction
//       await transaction.commit();

//       // Generate token and send response
//       const token = jwt.sign(
//         { id: newUser.id, username: newUser.username },
//         JWT_SECRET,
//         { expiresIn: "12h" }
//       );

//       res.cookie("authToken", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 12 * 60 * 60 * 1000,
//       });

//       const subject = "🔥Welcome to Tudlin!";
//       const userEmail = email;
//       const header = "Your account has been created successfully!";
//       const greetings = `Hi, ${username}`;
//       const paragraph =
//         "Welcome to Tudlin! We are excited to have you on board. You can now start creating and managing your classes, subjects, and more.";

//       sendMail(userEmail, subject, greetings, header, paragraph);

//       res.status(201).json({ user: newUser, token });
//     } catch (error) {
//       await transaction.rollback();
//       console.error("Error during user creation or subject insertion:", error);
//       res
//         .status(500)
//         .json({ error: "Sorry! User was not created. An error occurred!" });
//     }
//   } catch (error) {
//     console.error("Error signing up:", error);
//     if (error.name === "SequelizeUniqueConstraintError") {
//       const field = error.errors[0].path;
//       const message = `${field} is already in use.`;
//       return res.status(409).json({ error: message });
//     }
//     res.status(500).json({ error: "An unexpected error occurred." });
//   }
// };

export const signup = async (req, res) => {
  const { username, email, password, role, subjects, schoolId } = req.body;

  console.log("signup:", req.body);

  try {
    const school = await School.findOne({ where: { specialId: schoolId } });

    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    // Check if username or email is already in use
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      const field = existingUser.username === username ? "username" : "email";
      return res.status(409).json({ error: `${field} is already in use.` });
    }

    const transaction = await sequelize.transaction();

    try {
      // Default role to "user" if not provided
      const newUser = await User.create(
        {
          username,
          email,
          password,
          schoolId: school.specialId,
          role: role || "user",
        },
        { transaction }
      );

      console.log("newUser: ", newUser);

      // If the user is a tutor and subjects are provided
      if (role === "tutor" && subjects && Object.keys(subjects).length > 0) {
        // Prepare entries for UserClassSubject
        const entries = Object.entries(subjects).flatMap(
          ([classId, subjectIds]) =>
            subjectIds.map((subjectId) => ({
              userId: newUser.id,
              classId: parseInt(classId, 10),
              subjectId,
            }))
        );

        console.log("Entries to insert:", entries);

        // Insert into UserClassSubject table
        await UserClassSubject.bulkCreate(entries, { transaction });
      }

      // Commit transaction
      await transaction.commit();

      try {
        await ActionLog.create({
          userId: newUser.id,
          type: "Success",
          content: "New Signup",
          schoolId: newUser.schoolId,
        });
      } catch (logError) {
        console.error("Failed to log signup action:", logError);
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: "12h" }
      );

      // Set cookie with the token
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 12 * 60 * 60 * 1000,
      });

      // Send welcome email
      const subject = "🔥Welcome to Tudlin!";
      const userEmail = email;
      const header = "Your account has been created successfully!";
      const greetings = `Hi, ${username}`;
      const paragraph =
        "Welcome to Tudlin! We are excited to have you on board. You can now start creating and managing your classes, subjects, and more.";

      sendMail(userEmail, subject, greetings, header, paragraph);

      // Send success response
      res.status(201).json({ user: newUser, token });
    } catch (error) {
      await transaction.rollback();
      console.error("Error during user creation or subject insertion:", error);
      return res
        .status(500)
        .json({ error: "Sorry! User was not created. An error occurred!" });
    }
  } catch (error) {
    console.error("Error signing up:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path;
      const message = `${field} is already in use.`;
      return res.status(409).json({ error: message });
    }
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  //console.log("login:", req.body);
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });

    // console.log("login user found:", user);
    // console.log("password from user input: ", password);
    // console.log("password from database: ", user.password);

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    //console.log("Password validation result:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // Longer lifespan for persistent login
    );

    // Set the token in an HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Secure and inaccessible to client-side scripts
      secure: process.env.NODE_ENV === "production", // Only in HTTPS in production
      sameSite: "lax", // Strict cross-site cookie policy
      maxAge: 12 * 60 * 60 * 1000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("Generated Auth Token:", token);
    console.log("Generated Refresh Token:", refreshToken);

    try {
      await ActionLog.create({
        userId: user.id,
        type: "Success",
        content: "New User Login",
        schoolId: user.schoolId,
      });
    } catch (logError) {
      console.error("Failed to log signup action:", logError);
    }

    res.status(200).json({ message: "Login successful.", user: user, token });
  } catch (error) {
    console.log("login error:", error);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

export const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from JWT via middleware
    console.log("logged in user's ID: ", req.user.id);
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }, // Exclude sensitive fields
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "12h" }
    );
    // Set the token in an HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Secure and inaccessible to client-side scripts
      secure: process.env.NODE_ENV === "production", // Only in HTTPS in production
      sameSite: "lax", // Strict cross-site cookie policy
      maxAge: 12 * 60 * 60 * 1000, // 1 hour
    });

    // res.status(200).json({ message: "Login successful.", user: user, token });

    console.log("logged in user and token sent!");
    return res.status(200).json({ user, token });
  } catch (error) {
    //console.error("Error fetching logged-in user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

//logout
export const logout = async (req, res) => {
  res.cookie("connect.sid", "", {
    sameSite: "none",
    secure: true,
    expires: new Date(0),
  });
  res.clearCookie("authToken", {
    sameSite: "lax",
    secure: true,
    path: "/",
  });
  res.status(200).send("User has been logged out.");
};

export const forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  //console.log("email:", req.body.email);
  const resetToken = crypto.randomBytes(64).toString("base64");
  const subject = "Account Password Reset Request";
  //console.log("resetToken:", resetToken);
  // const user = await
  User.findOne({ where: { email } })
    // User.findOne({ email })
    .then((user) => {
      // If user not found, return error
      if (!user) {
        console.log("User not found");
        return res
          .status(201)
          .json({ success: false, message: "User not found" });
      }

      // Update user's reset token and expiry time
      user.resetToken = resetToken;
      const expiryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
      user.resetTokenExpires = expiryDate;
      user.save();

      // Send reset password email
      mailer(
        user.email,
        encodeURIComponent(resetToken),
        subject,
        "reset-password",
        "Greetings from Tudlin",
        "We received a request to reset the password for the Tudlin account associated with this e-mail address. Click the button below to reset your password.",
        "If you did not request this, please ignore this email and your password will remain unchanged.",
        "Reset Password"
      );

      // Send success response
      res.status(201).json({
        success: true,
        message: "Reset Password email sent successfully.",
      });
    })
    .catch((err) => {
      // Error handling: Log and return internal server error
      console.error("Error finding user:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
};

export const resetPassword = async (req, res, next) => {
  const { password, token } = req.body;

  console.log("Reset BK body:", req.body);

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  // Find user by token
  User.findOne({
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: new Date() },
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "Invalid or expired reset token. Please request for another password reset link.",
        });
      }

      // Update user password with the new hashed password
      user.password = password;
      user.resetToken = null;
      user.resetTokenExpires = null;

      // Save the updated user document
      user
        .save()
        .then(() => {
          res
            .status(200)
            .json({ success: true, message: "Password reset successful" });
        })
        .catch((err) => {
          console.error("Error updating password:", err);
          res
            .status(500)
            .json({ success: false, message: "Internal server error" });
        });

      const subject = "Password Reset Successful";
      const userEmail = user.email;
      const header = "Password has been changed Successfully!";
      const paragraph =
        "Your password has been successfully reset. You can now log in with your new password.";
      const body =
        "If you did not request this change, please contact our support team immediately.";
      const greetings = `Hi, ${user.username}`;

      sendMail(userEmail, subject, greetings, header, paragraph, body);
    })
    .catch((err) => {
      console.error("Error resetting password:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
};

export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch the user from the database
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

    // Update the user's password

    user.password = hashedPassword;
    await user.save();

    // Optionally, you can send a success message
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// new password reset controller
// export const forgotPassword = async (req, res, next) => {
//   const email = req.body.email;
//   console.log("email:", req.body.email);

//   // Generate reset token
//   const resetToken = crypto.randomBytes(64).toString("base64");
//   const subject = "Tudlin Account Password Reset Request";

//   try {
//     // Find the user by email
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       console.log("User not found");
//       return res
//         .status(201)
//         .json({ success: false, message: "User not found" });
//     }

//     // Update user's reset token and expiry time
//     user.resetToken = resetToken;
//     user.resetTokenExpires = Date.now() + 432000000; // Token expires in 5 days
//     await user.save();

//     // Construct reset link
//     const resetLink = `${
//       process.env.FRONTEND_URL
//     }/reset-password/${encodeURIComponent(resetToken)}`;

//     // Send reset password email using Resend
//     try {
//       await resend.emails.send({
//         from: "support@tudlin.com", // Replace with your verified Resend sender
//         to: email,
//         subject,
//         html: `
//           <p>Greetings from Tudlin,</p>
//           <p>We received a request to reset the password for the Tudlin account associated with this e-mail address.</p>
//           <p>Click the button below to reset your password:</p>
//           <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
//           <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
//         `,
//       });

//       // Respond with success
//       res.status(201).json({
//         success: true,
//         message: "Reset Password email sent successfully.",
//       });
//     } catch (emailError) {
//       console.error("Error sending email:", emailError);
//       res
//         .status(500)
//         .json({ success: false, message: "Error sending reset email." });
//     }
//   } catch (error) {
//     console.error("Error in forgot password flow:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      JWT_REFRESH_SECRET,
      { expiresIn: "1h" } // Issue new access token
    );

    res.cookie("authToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.sendStatus(200);
  });
};

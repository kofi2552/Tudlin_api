// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import createError from "./createError.js";

// export const verifyToken = async (req, res, next) => {
//   try {
//     // Get the token from cookies
//     const token = req.cookies?.authToken;
//     if (!token) return next(createError(401, "You are not authenticated!"));

//     //console.log("middleware req cookie data: ", req.cookies);
//     // Verify the token
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     if (!payload) return next(createError(403, "Invalid token!"));

//     // Fetch the user from the database
//     const user = await User.findOne({ where: { id: payload.id } });
//     if (!user) return next(createError(404, "User not found!"));

//     // Attach user data to the request object
//     req.user = user;
//     req.userId = user._id;
//     req.isAdmin = payload.isAdmin;

//     // Allow the request to proceed
//     next();
//   } catch (error) {
//     if (error.name === "JsonWebTokenError") {
//       return next(createError(403, "Invalid token!"));
//     }
//     if (error.name === "TokenExpiredError") {
//       return next(createError(401, "Token expired!"));
//     }
//     console.error("Error in authentication middleware:", error);
//     next(createError(500, "An unexpected error occurred!"));
//   }
// };

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import createError from "./createError.js";

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Student from "../models/Student.js";
import createError from "./createError.js";

export const verifyToken = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.Token;
    if (!token) return next(createError(401, "You are not authenticated!"));

    //console.log("Raw Token Before Processing:", token);

    // Decode token without verification to check if it's a valid JWT format
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader) {
      return next(createError(403, "Invalid token format!"));
    }

    //console.log("Decoded Token Header:", decodedHeader);

    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Token payload:", payload);
    if (!payload) return next(createError(403, "Invalid token!"));

    let user = await User.findOne({
      where: { id: payload.id },
      attributes: ["id", "username", "email", "isAdmin", "role", "schoolId"],
    });

    let student = null;

    if (!user) {
      // If no user found, check in Student table
      student = await Student.findOne({
        where: { id: payload.id },
        attributes: ["id", "name", "email", "schoolId"],
      });

      if (!student) return next(createError(404, "User/Student not found!"));
    }

    // Attach relevant info to the request object
    req.user = user || student; // Attach either User or Student object
    req.userId = (user || student).id; // Attach the ID
    req.isAdmin = user ? user.isAdmin : false; // Admin flag only for users
    req.isStudent = !!student; // Boolean flag to indicate if it's a student

    next(); // Allow the request to proceed
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(createError(403, "Invalid token!"));
    }
    if (error.name === "TokenExpiredError") {
      return next(createError(401, "Token expired!"));
    }
    console.error("Error in authentication middleware:", error);
    next(createError(500, "An unexpected error occurred!"));
  }
};

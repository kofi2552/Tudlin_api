import jwt from "jsonwebtoken";
import User from "../models/User.js";
import createError from "./createError.js";

export const verifyToken = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies?.authToken;
    if (!token) return next(createError(401, "You are not authenticated!"));

    console.log("middleware req cookie data: ", req.cookies);
    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) return next(createError(403, "Invalid token!"));

    // Fetch the user from the database
    const user = await User.findOne({ where: { id: payload.id } });
    if (!user) return next(createError(404, "User not found!"));

    // Attach user data to the request object
    req.user = user;
    req.userId = user._id;
    req.isAdmin = payload.isAdmin;

    // Allow the request to proceed
    next();
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

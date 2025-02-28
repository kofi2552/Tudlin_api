import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure subfolders exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine subfolder based on the URL or a custom field in the request body.
    // For example, if your route is "/upload/students", we can check req.baseUrl.
    let folder = "uploads/";
    if (req.baseUrl && req.baseUrl.includes("students")) {
      folder += "students/";
    } else if (req.baseUrl && req.baseUrl.includes("subjects")) {
      folder += "subjects/";
    } else if (req.baseUrl && req.baseUrl.includes("classes")) {
      folder += "classes/";
    } else if (req.baseUrl && req.baseUrl.includes("quizzes")) {
      folder += "quizzes/";
    } else {
      folder += "others/";
    }
    ensureDir(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Use Date.now() plus original name for uniqueness
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;

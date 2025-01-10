-- Database creation (optional, if not already created)
CREATE DATABASE IF NOT EXISTS stupro;
USE stupro;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- For storing hashed passwords
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'teacher', 'student') DEFAULT 'teacher', -- You can adjust roles as needed
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- School table
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    name VARCHAR(50) NOT NULL, -- Example: "Grade 10 A"
    teacher_id INT, -- Optionally assign a teacher to each class
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    class_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Subjects table
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school_id INT NOT NULL,
    name VARCHAR(50) NOT NULL, -- Subject name e.g., "Math"
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Additional linking table for many-to-many relationships between students and subjects (optional)
CREATE TABLE student_subjects (
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    score DECIMAL(5, 2), -- Store score or mark
    PRIMARY KEY (student_id, subject_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

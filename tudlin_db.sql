-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 09, 2025 at 04:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stupro`
--

-- --------------------------------------------------------

--
-- Table structure for table `assessments`
--

CREATE TABLE `assessments` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tscore` int(11) NOT NULL,
  `task_category_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `curriculum_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessments`
--

INSERT INTO `assessments` (`id`, `name`, `tscore`, `task_category_id`, `class_id`, `subject_id`, `curriculum_id`, `createdAt`, `updatedAt`) VALUES
(7, 'ICT Test', 20, 1, 18, 45, 1, '2025-01-09 10:28:25', '2025-01-09 10:28:25'),
(8, 'French_Grade 10_Friday - January 17, 2025', 100, 1, 18, 47, 1, '2025-01-09 10:46:54', '2025-01-09 10:46:54'),
(9, 'Global Perspective_Grade 6_Friday - January 17, 2025', 100, 1, 22, 87, 1, '2025-01-09 10:46:54', '2025-01-09 10:46:54'),
(10, 'Physics_Grade 9_Friday - January 17, 2025', 100, 1, 19, 58, 1, '2025-01-09 10:46:54', '2025-01-09 10:46:54'),
(11, 'English_Grade 7_Friday - January 17, 2025', 100, 1, 21, 82, 1, '2025-01-09 10:46:54', '2025-01-09 10:46:54');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `years` enum('1','2','3','4','5','6','7','8','9','10') DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`, `years`, `createdAt`, `updatedAt`) VALUES
(18, 'Grade 10', '1', '2025-01-03 01:20:33', '2025-01-03 01:20:33'),
(19, 'Grade 9', '1', '2025-01-06 00:58:19', '2025-01-06 00:58:19'),
(20, 'Grade 8', '1', '2025-01-06 00:58:33', '2025-01-06 00:58:33'),
(21, 'Grade 7', '1', '2025-01-06 00:58:49', '2025-01-06 00:58:49'),
(22, 'Grade 6', '1', '2025-01-06 00:58:56', '2025-01-06 00:58:56'),
(23, 'IBDP 1', '1', '2025-01-06 00:59:17', '2025-01-06 00:59:17'),
(24, 'IBDP 2', '1', '2025-01-06 00:59:26', '2025-01-06 00:59:26'),
(25, 'SHS 3', '1', '2025-01-06 00:59:41', '2025-01-06 00:59:41'),
(26, 'SHS 2', '1', '2025-01-06 00:59:46', '2025-01-06 00:59:46'),
(27, 'SHS 1', '1', '2025-01-06 00:59:57', '2025-01-06 00:59:57'),
(28, 'JHS 3', '1', '2025-01-06 01:00:04', '2025-01-06 01:00:04');

-- --------------------------------------------------------

--
-- Table structure for table `classtosubjects`
--

CREATE TABLE `classtosubjects` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `subjectId` int(11) DEFAULT NULL,
  `classId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classtosubjects`
--

INSERT INTO `classtosubjects` (`id`, `createdAt`, `updatedAt`, `subjectId`, `classId`) VALUES
(1, '2025-01-03 01:22:50', '2025-01-03 01:22:50', 45, 18),
(2, '2025-01-03 01:23:01', '2025-01-03 01:23:01', 46, 18),
(3, '2025-01-07 18:31:53', '2025-01-07 18:31:53', 47, 18),
(4, '2025-01-07 18:34:47', '2025-01-07 18:34:47', 48, 18),
(5, '2025-01-07 18:37:50', '2025-01-07 18:37:50', 49, 18),
(6, '2025-01-07 18:39:59', '2025-01-07 18:39:59', 50, 18),
(7, '2025-01-07 18:41:07', '2025-01-07 18:41:07', 51, 18),
(8, '2025-01-07 18:44:19', '2025-01-07 18:44:19', 52, 18),
(9, '2025-01-07 18:44:32', '2025-01-07 18:44:32', 53, 18),
(10, '2025-01-07 18:44:44', '2025-01-07 18:44:44', 54, 18),
(11, '2025-01-07 18:48:51', '2025-01-07 18:48:51', 55, 19),
(12, '2025-01-07 18:49:15', '2025-01-07 18:49:15', 56, 19),
(13, '2025-01-07 18:49:31', '2025-01-07 18:49:31', 57, 19),
(14, '2025-01-07 18:49:45', '2025-01-07 18:49:45', 58, 19),
(15, '2025-01-07 19:29:37', '2025-01-07 19:29:37', 59, 19),
(16, '2025-01-07 19:30:21', '2025-01-07 19:30:21', 60, 19),
(17, '2025-01-07 19:31:45', '2025-01-07 19:31:45', 61, 19),
(18, '2025-01-07 19:31:58', '2025-01-07 19:31:58', 62, 19),
(19, '2025-01-07 20:03:28', '2025-01-07 20:03:28', 63, 23),
(20, '2025-01-07 20:03:46', '2025-01-07 20:03:46', 64, 23),
(21, '2025-01-07 20:51:54', '2025-01-07 20:51:54', 65, 23),
(22, '2025-01-07 21:35:25', '2025-01-07 21:35:25', 66, 23),
(23, '2025-01-07 21:43:20', '2025-01-07 21:43:20', 67, 23),
(24, '2025-01-07 21:53:41', '2025-01-07 21:53:41', 68, 24),
(25, '2025-01-07 21:54:59', '2025-01-07 21:54:59', 69, 24),
(26, '2025-01-07 21:55:48', '2025-01-07 21:55:48', 70, 24),
(27, '2025-01-07 21:57:41', '2025-01-07 21:57:41', 71, 24),
(28, '2025-01-07 21:58:11', '2025-01-07 21:58:11', 72, 24),
(29, '2025-01-07 21:58:49', '2025-01-07 21:58:49', 73, 24),
(30, '2025-01-08 21:42:19', '2025-01-08 21:42:19', 74, 22),
(31, '2025-01-08 21:42:58', '2025-01-08 21:42:58', 75, 22),
(32, '2025-01-08 21:45:25', '2025-01-08 21:45:25', 76, 21),
(33, '2025-01-08 21:47:17', '2025-01-08 21:47:17', 77, 21),
(34, '2025-01-08 21:47:28', '2025-01-08 21:47:28', 78, 21),
(35, '2025-01-08 21:47:49', '2025-01-08 21:47:49', 79, 21),
(36, '2025-01-08 21:48:35', '2025-01-08 21:48:35', 80, 21),
(37, '2025-01-08 21:48:48', '2025-01-08 21:48:48', 81, 21),
(38, '2025-01-08 21:49:02', '2025-01-08 21:49:02', 82, 21),
(39, '2025-01-08 21:49:24', '2025-01-08 21:49:24', 83, 21),
(40, '2025-01-08 21:51:44', '2025-01-08 21:51:44', 84, 21),
(41, '2025-01-08 21:52:06', '2025-01-08 21:52:06', 85, 21),
(42, '2025-01-08 21:52:14', '2025-01-08 21:52:14', 86, 21),
(43, '2025-01-08 21:53:02', '2025-01-08 21:53:02', 87, 22),
(44, '2025-01-08 21:53:13', '2025-01-08 21:53:13', 88, 22),
(45, '2025-01-08 21:53:33', '2025-01-08 21:53:33', 89, 22);

-- --------------------------------------------------------

--
-- Table structure for table `curriculums`
--

CREATE TABLE `curriculums` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `curriculums`
--

INSERT INTO `curriculums` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Cambridge', '2024-12-07 15:54:00', '2024-12-07 15:54:00'),
(2, 'IBDP', '2024-12-07 15:56:05', '2024-12-07 15:56:05'),
(3, 'GES', '2024-12-07 16:35:59', '2024-12-07 16:35:59');

-- --------------------------------------------------------

--
-- Table structure for table `curriculumstudyareas`
--

CREATE TABLE `curriculumstudyareas` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `studyAreaId` int(11) DEFAULT NULL,
  `curriculumId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `curriculumstudyareas`
--

INSERT INTO `curriculumstudyareas` (`id`, `createdAt`, `updatedAt`, `studyAreaId`, `curriculumId`) VALUES
(1, '2025-01-03 01:21:50', '2025-01-03 01:21:50', 3, 1),
(2, '2025-01-03 01:21:56', '2025-01-03 01:21:56', 4, 1),
(3, '2025-01-03 01:22:15', '2025-01-03 01:22:15', 5, 1),
(4, '2025-01-03 01:22:22', '2025-01-03 01:22:22', 6, 1),
(5, '2025-01-03 01:22:32', '2025-01-03 01:22:32', 7, 1),
(6, '2025-01-07 20:02:56', '2025-01-07 20:02:56', 8, 2),
(7, '2025-01-07 20:03:11', '2025-01-07 20:03:11', 9, 2),
(8, '2025-01-07 20:51:11', '2025-01-07 20:51:11', 10, 2);

-- --------------------------------------------------------

--
-- Table structure for table `curriculumtoclasses`
--

CREATE TABLE `curriculumtoclasses` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `classId` int(11) DEFAULT NULL,
  `curriculumId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `curriculumtoclasses`
--

INSERT INTO `curriculumtoclasses` (`id`, `createdAt`, `updatedAt`, `classId`, `curriculumId`) VALUES
(1, '2025-01-03 01:20:33', '2025-01-03 01:20:33', 18, 1),
(2, '2025-01-06 00:58:19', '2025-01-06 00:58:19', 19, 1),
(3, '2025-01-06 00:58:33', '2025-01-06 00:58:33', 20, 1),
(4, '2025-01-06 00:58:49', '2025-01-06 00:58:49', 21, 1),
(5, '2025-01-06 00:58:56', '2025-01-06 00:58:56', 22, 1),
(6, '2025-01-06 00:59:17', '2025-01-06 00:59:17', 23, 2),
(7, '2025-01-06 00:59:26', '2025-01-06 00:59:26', 24, 2),
(8, '2025-01-06 00:59:41', '2025-01-06 00:59:41', 25, 3),
(9, '2025-01-06 00:59:46', '2025-01-06 00:59:46', 26, 3),
(10, '2025-01-06 00:59:57', '2025-01-06 00:59:57', 27, 3),
(11, '2025-01-06 01:00:04', '2025-01-06 01:00:04', 28, 3);

-- --------------------------------------------------------

--
-- Table structure for table `curriculumtosubjects`
--

CREATE TABLE `curriculumtosubjects` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `subjectId` int(11) DEFAULT NULL,
  `curriculumId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifies`
--

CREATE TABLE `notifies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `buttonUrl` varchar(255) NOT NULL,
  `buttonText` varchar(255) NOT NULL DEFAULT 'Go',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifies`
--

INSERT INTO `notifies` (`id`, `title`, `subtitle`, `description`, `imageUrl`, `buttonUrl`, `buttonText`, `createdAt`, `updatedAt`) VALUES
(2, 'First Timers Tutorials', 'Using Tudlin to the Fullest', 'Prepare to be part of dynamic conversations that will redefine the boundaries of rich education', 'https://res.cloudinary.com/loyke/image/upload/v1735914412/koyarr/ct8q7avnofgqescqqnmm.jpg', 'https://www.youtube.com/', 'Register to Learn', '2025-01-02 21:33:34', '2025-01-03 14:26:50');

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`id`, `name`, `type`, `address`, `createdAt`, `updatedAt`) VALUES
(6, 'Morgan International Com School', 'International', 'Agona Swedru', '2024-11-16 18:24:09', '2024-12-08 15:49:19');

-- --------------------------------------------------------

--
-- Table structure for table `studentassessmentscores`
--

CREATE TABLE `studentassessmentscores` (
  `id` int(11) NOT NULL,
  `assessment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `score` float NOT NULL,
  `max_score` float NOT NULL DEFAULT 100,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `curriculum_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `class_id`, `curriculum_id`, `name`, `email`, `createdAt`, `updatedAt`) VALUES
(11, 18, 1, 'Nathan Otto', 'no@gmail.com', '2025-01-03 02:02:19', '2025-01-03 02:02:19'),
(12, 22, 1, 'Adom Nhyira', 'adomnhyira@gmail.com', '2025-01-08 21:55:04', '2025-01-08 21:55:04'),
(13, 21, 1, 'Kayla Addo', 'kaylaaddo@gmail.com', '2025-01-08 21:56:41', '2025-01-08 21:56:41');

-- --------------------------------------------------------

--
-- Table structure for table `studenttosubjects`
--

CREATE TABLE `studenttosubjects` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `studentId` int(11) DEFAULT NULL,
  `subjectId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studenttosubjects`
--

INSERT INTO `studenttosubjects` (`id`, `createdAt`, `updatedAt`, `studentId`, `subjectId`) VALUES
(1, '2025-01-03 02:03:00', '2025-01-03 02:03:00', 11, 46);

-- --------------------------------------------------------

--
-- Table structure for table `studyareas`
--

CREATE TABLE `studyareas` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `studyareas`
--

INSERT INTO `studyareas` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(3, 'Technology', '2025-01-03 01:21:50', '2025-01-03 01:21:50'),
(4, 'Sciences', '2025-01-03 01:21:56', '2025-01-03 01:21:56'),
(5, 'Humanities', '2025-01-03 01:22:15', '2025-01-03 01:22:15'),
(6, 'Mathematics', '2025-01-03 01:22:22', '2025-01-03 01:22:22'),
(7, 'Languages', '2025-01-03 01:22:32', '2025-01-03 01:22:32'),
(8, 'Languages', '2025-01-07 20:02:56', '2025-01-07 20:02:56'),
(9, 'Sciences', '2025-01-07 20:03:11', '2025-01-07 20:03:11'),
(10, 'Individuals and Societies', '2025-01-07 20:51:11', '2025-01-07 20:51:11');

-- --------------------------------------------------------

--
-- Table structure for table `subjectgroups`
--

CREATE TABLE `subjectgroups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `classId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjectgroupsubjects`
--

CREATE TABLE `subjectgroupsubjects` (
  `id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `subjectId` int(11) DEFAULT NULL,
  `subjectGroupId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `studyareaid` int(255) DEFAULT NULL,
  `curriculumId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isArchive` tinyint(1) DEFAULT 0,
  `class_id` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `studyareaid`, `curriculumId`, `createdAt`, `updatedAt`, `isArchive`, `class_id`) VALUES
(45, 'ICT IGCSE', 3, 1, '2025-01-03 01:22:50', '2025-01-03 01:22:50', 0, 18),
(46, 'Computer Science', 3, 1, '2025-01-03 01:23:01', '2025-01-03 01:23:01', 0, 18),
(47, 'French', 7, 1, '2025-01-07 18:31:53', '2025-01-07 18:31:53', 0, 18),
(48, 'Spanish', 7, 1, '2025-01-07 18:34:47', '2025-01-07 18:34:47', 0, 18),
(49, 'Business Studies', 5, 1, '2025-01-07 18:37:50', '2025-01-07 18:37:50', 0, 18),
(50, 'History', 5, 1, '2025-01-07 18:39:59', '2025-01-07 18:39:59', 0, 18),
(51, 'Geography', 5, 1, '2025-01-07 18:41:07', '2025-01-07 18:41:07', 0, 18),
(52, 'Biology', 4, 1, '2025-01-07 18:44:19', '2025-01-07 18:44:19', 0, 18),
(53, 'Physics', 4, 1, '2025-01-07 18:44:32', '2025-01-07 18:44:32', 0, 18),
(54, 'Chemistry', 4, 1, '2025-01-07 18:44:44', '2025-01-07 18:44:44', 0, 18),
(55, 'Computer Science', 3, 1, '2025-01-07 18:48:51', '2025-01-07 18:48:51', 0, 19),
(56, 'ICT', 3, 1, '2025-01-07 18:49:15', '2025-01-07 18:49:15', 0, 19),
(57, 'Biology', 4, 1, '2025-01-07 18:49:31', '2025-01-07 18:49:31', 0, 19),
(58, 'Physics', 4, 1, '2025-01-07 18:49:45', '2025-01-07 18:49:45', 0, 19),
(59, 'Chemistry', 4, 1, '2025-01-07 19:29:37', '2025-01-07 19:29:37', 0, 19),
(60, 'History', 5, 1, '2025-01-07 19:30:21', '2025-01-07 19:30:21', 0, 19),
(61, 'French', 7, 1, '2025-01-07 19:31:45', '2025-01-07 19:31:45', 0, 19),
(62, 'Spanish', 7, 1, '2025-01-07 19:31:58', '2025-01-07 19:31:58', 0, 19),
(63, 'French', 8, 2, '2025-01-07 20:03:28', '2025-01-07 20:03:28', 0, 23),
(64, 'Spanish abinitio', 8, 2, '2025-01-07 20:03:45', '2025-01-07 20:03:45', 0, 23),
(65, 'Digital Society', 10, 2, '2025-01-07 20:51:54', '2025-01-07 20:51:54', 0, 23),
(66, 'Global Politics', 10, 2, '2025-01-07 21:35:25', '2025-01-07 21:35:25', 0, 23),
(67, 'Biology', 9, 2, '2025-01-07 21:43:20', '2025-01-07 21:43:20', 0, 23),
(68, 'Computer Science', 9, 2, '2025-01-07 21:53:41', '2025-01-07 21:53:41', 0, 24),
(69, 'Digital Society', 10, 2, '2025-01-07 21:54:59', '2025-01-07 21:54:59', 0, 24),
(70, 'Global Politics', 10, 2, '2025-01-07 21:55:48', '2025-01-07 21:55:48', 0, 24),
(71, 'Spanish abinitio', 8, 2, '2025-01-07 21:57:41', '2025-01-07 21:57:41', 0, 24),
(72, 'French', 8, 2, '2025-01-07 21:58:11', '2025-01-07 21:58:11', 0, 24),
(73, 'Business Management', 10, 2, '2025-01-07 21:58:49', '2025-01-07 21:58:49', 0, 24),
(74, 'Mathematics', 6, 1, '2025-01-08 21:42:19', '2025-01-08 21:42:19', 0, 22),
(75, 'ICT Starter', 3, 1, '2025-01-08 21:42:58', '2025-01-08 21:42:58', 0, 22),
(76, 'Mathematics', 6, 1, '2025-01-08 21:45:25', '2025-01-08 21:45:25', 0, 21),
(77, 'Geography', 5, 1, '2025-01-08 21:47:17', '2025-01-08 21:47:17', 0, 21),
(78, 'History', 5, 1, '2025-01-08 21:47:28', '2025-01-08 21:47:28', 0, 21),
(79, 'Global Perspective', 5, 1, '2025-01-08 21:47:49', '2025-01-08 21:47:49', 0, 21),
(80, 'ICT', 3, 1, '2025-01-08 21:48:35', '2025-01-08 21:48:35', 0, 21),
(81, 'French', 7, 1, '2025-01-08 21:48:48', '2025-01-08 21:48:48', 0, 21),
(82, 'English', 7, 1, '2025-01-08 21:49:02', '2025-01-08 21:49:02', 0, 21),
(83, 'Business Studies', 5, 1, '2025-01-08 21:49:24', '2025-01-08 21:49:24', 0, 21),
(84, 'Spanish', 7, 1, '2025-01-08 21:51:44', '2025-01-08 21:51:44', 0, 21),
(85, 'Physics', 4, 1, '2025-01-08 21:52:06', '2025-01-08 21:52:06', 0, 21),
(86, 'Chemistry', 4, 1, '2025-01-08 21:52:14', '2025-01-08 21:52:14', 0, 21),
(87, 'Global Perspective', 5, 1, '2025-01-08 21:53:02', '2025-01-08 21:53:02', 0, 22),
(88, 'Spanish', 7, 1, '2025-01-08 21:53:13', '2025-01-08 21:53:13', 0, 22),
(89, 'English', 7, 1, '2025-01-08 21:53:33', '2025-01-08 21:53:33', 0, 22);

-- --------------------------------------------------------

--
-- Table structure for table `taskcategories`
--

CREATE TABLE `taskcategories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `taskcategories`
--

INSERT INTO `taskcategories` (`id`, `name`, `desc`, `createdAt`, `updatedAt`) VALUES
(1, 'Crash', 'Weekly Test', '2025-01-03 02:01:27', '2025-01-03 02:01:27'),
(3, 'Test', 'Class Test', '2025-01-09 10:29:51', '2025-01-09 10:29:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `role` enum('tutor','student','parent') NOT NULL DEFAULT 'tutor',
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpires` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `subject_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `isAdmin`, `role`, `resetToken`, `resetTokenExpires`, `createdAt`, `updatedAt`, `subject_id`) VALUES
(11, 'kyde', 'wilwek.consult.hr@gmail.com', '$2a$10$TDqkrXwLRNn9GpyXhrNZx.qqw/EfFggn9q.OGAFnNHE/F9pr26KVS', 1, 'tutor', NULL, NULL, '2025-01-07 00:49:47', '2025-01-07 00:49:47', NULL),


--
-- Indexes for dumped tables
--

--
-- Indexes for table `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_category_id` (`task_category_id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `classtosubjects`
--
ALTER TABLE `classtosubjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ClassToSubjects_classId_subjectId_unique` (`subjectId`,`classId`),
  ADD KEY `classId` (`classId`);

--
-- Indexes for table `curriculums`
--
ALTER TABLE `curriculums`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `curriculumstudyareas`
--
ALTER TABLE `curriculumstudyareas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `CurriculumStudyAreas_curriculumId_studyAreaId_unique` (`studyAreaId`,`curriculumId`),
  ADD KEY `curriculumId` (`curriculumId`);

--
-- Indexes for table `curriculumtoclasses`
--
ALTER TABLE `curriculumtoclasses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `CurriculumToClasses_curriculumId_classId_unique` (`classId`,`curriculumId`),
  ADD KEY `curriculumId` (`curriculumId`);

--
-- Indexes for table `curriculumtosubjects`
--
ALTER TABLE `curriculumtosubjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `CurriculumToSubjects_curriculumId_subjectId_unique` (`subjectId`,`curriculumId`),
  ADD KEY `curriculumId` (`curriculumId`);

--
-- Indexes for table `notifies`
--
ALTER TABLE `notifies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `studentassessmentscores`
--
ALTER TABLE `studentassessmentscores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assessment_id` (`assessment_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `curriculum_id` (`curriculum_id`);

--
-- Indexes for table `studenttosubjects`
--
ALTER TABLE `studenttosubjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `StudentToSubjects_subjectId_studentId_unique` (`studentId`,`subjectId`),
  ADD KEY `subjectId` (`subjectId`);

--
-- Indexes for table `studyareas`
--
ALTER TABLE `studyareas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subjectgroups`
--
ALTER TABLE `subjectgroups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subjectgroupsubjects`
--
ALTER TABLE `subjectgroupsubjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `SubjectGroupSubjects_subjectGroupId_subjectId_unique` (`subjectId`,`subjectGroupId`),
  ADD KEY `subjectGroupId` (`subjectGroupId`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `studyareaid` (`studyareaid`),
  ADD KEY `curriculumId` (`curriculumId`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `taskcategories`
--
ALTER TABLE `taskcategories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `users_username_email` (`username`,`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `username_9` (`username`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `username_10` (`username`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `username_11` (`username`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `username_12` (`username`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `username_13` (`username`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `username_14` (`username`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `username_15` (`username`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `username_16` (`username`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `username_17` (`username`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `username_18` (`username`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `username_19` (`username`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `username_20` (`username`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD KEY `class_id` (`class_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assessments`
--
ALTER TABLE `assessments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `classtosubjects`
--
ALTER TABLE `classtosubjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `curriculums`
--
ALTER TABLE `curriculums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `curriculumstudyareas`
--
ALTER TABLE `curriculumstudyareas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `curriculumtoclasses`
--
ALTER TABLE `curriculumtoclasses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `curriculumtosubjects`
--
ALTER TABLE `curriculumtosubjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifies`
--
ALTER TABLE `notifies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `schools`
--
ALTER TABLE `schools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `studentassessmentscores`
--
ALTER TABLE `studentassessmentscores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `studenttosubjects`
--
ALTER TABLE `studenttosubjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `studyareas`
--
ALTER TABLE `studyareas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `subjectgroups`
--
ALTER TABLE `subjectgroups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subjectgroupsubjects`
--
ALTER TABLE `subjectgroupsubjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `taskcategories`
--
ALTER TABLE `taskcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assessments`
--
ALTER TABLE `assessments`
  ADD CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`task_category_id`) REFERENCES `taskcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_10` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_11` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_2` FOREIGN KEY (`task_category_id`) REFERENCES `taskcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_3` FOREIGN KEY (`task_category_id`) REFERENCES `taskcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_4` FOREIGN KEY (`task_category_id`) REFERENCES `taskcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_5` FOREIGN KEY (`task_category_id`) REFERENCES `taskcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_6` FOREIGN KEY (`task_category_id`) REFERENCES `taskcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_7` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_8` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_9` FOREIGN KEY (`task_category_id`) REFERENCES `taskcategories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `classtosubjects`
--
ALTER TABLE `classtosubjects`
  ADD CONSTRAINT `classtosubjects_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_10` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_11` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_12` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_13` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_14` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_3` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_4` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_5` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_6` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_7` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_8` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `classtosubjects_ibfk_9` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `curriculumstudyareas`
--
ALTER TABLE `curriculumstudyareas`
  ADD CONSTRAINT `curriculumstudyareas_ibfk_1` FOREIGN KEY (`studyAreaId`) REFERENCES `studyareas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_10` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_11` FOREIGN KEY (`studyAreaId`) REFERENCES `studyareas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_12` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_13` FOREIGN KEY (`studyAreaId`) REFERENCES `studyareas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_14` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_2` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_3` FOREIGN KEY (`studyAreaId`) REFERENCES `studyareas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_4` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_5` FOREIGN KEY (`studyAreaId`) REFERENCES `studyareas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_6` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_7` FOREIGN KEY (`studyAreaId`) REFERENCES `studyareas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_8` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumstudyareas_ibfk_9` FOREIGN KEY (`studyAreaId`) REFERENCES `studyareas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `curriculumtoclasses`
--
ALTER TABLE `curriculumtoclasses`
  ADD CONSTRAINT `curriculumtoclasses_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_10` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_11` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_12` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_13` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_14` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_2` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_3` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_4` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_5` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_6` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_7` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_8` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtoclasses_ibfk_9` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `curriculumtosubjects`
--
ALTER TABLE `curriculumtosubjects`
  ADD CONSTRAINT `curriculumtosubjects_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtosubjects_ibfk_2` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtosubjects_ibfk_3` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtosubjects_ibfk_4` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtosubjects_ibfk_5` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `curriculumtosubjects_ibfk_6` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `studentassessmentscores`
--
ALTER TABLE `studentassessmentscores`
  ADD CONSTRAINT `studentassessmentscores_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_10` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_11` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_12` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_13` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_14` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_3` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_4` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_5` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_6` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_7` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_8` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentassessmentscores_ibfk_9` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_10` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_11` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_12` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_13` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_14` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_15` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_16` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_17` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_18` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_19` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `students_ibfk_20` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_21` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_22` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_23` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_24` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_25` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_26` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_27` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_28` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_29` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_30` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_31` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_32` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_33` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_34` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_35` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_36` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_37` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_38` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_39` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_4` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_40` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_41` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_42` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_43` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_44` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_45` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_46` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_47` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_48` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_49` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_5` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_50` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_51` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_52` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_53` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_54` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_55` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_56` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_57` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_58` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_59` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_6` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_60` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_61` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_62` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_63` FOREIGN KEY (`curriculum_id`) REFERENCES `curriculums` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_7` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_8` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_ibfk_9` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `studenttosubjects`
--
ALTER TABLE `studenttosubjects`
  ADD CONSTRAINT `studenttosubjects_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_10` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_11` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_12` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_13` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_14` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_3` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_4` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_5` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_6` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_7` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_8` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studenttosubjects_ibfk_9` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subjectgroupsubjects`
--
ALTER TABLE `subjectgroupsubjects`
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_10` FOREIGN KEY (`subjectGroupId`) REFERENCES `subjectgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_11` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_12` FOREIGN KEY (`subjectGroupId`) REFERENCES `subjectgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_13` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_14` FOREIGN KEY (`subjectGroupId`) REFERENCES `subjectgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_2` FOREIGN KEY (`subjectGroupId`) REFERENCES `subjectgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_3` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_4` FOREIGN KEY (`subjectGroupId`) REFERENCES `subjectgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_5` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_6` FOREIGN KEY (`subjectGroupId`) REFERENCES `subjectgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_7` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_8` FOREIGN KEY (`subjectGroupId`) REFERENCES `subjectgroups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjectgroupsubjects_ibfk_9` FOREIGN KEY (`subjectId`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_10` FOREIGN KEY (`studyareaid`) REFERENCES `studyareas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_11` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_12` FOREIGN KEY (`studyareaid`) REFERENCES `studyareas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_13` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_14` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_15` FOREIGN KEY (`studyareaid`) REFERENCES `studyareas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_16` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_17` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_18` FOREIGN KEY (`studyareaid`) REFERENCES `studyareas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_19` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_2` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_20` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_21` FOREIGN KEY (`studyareaid`) REFERENCES `studyareas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_22` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_23` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_24` FOREIGN KEY (`studyareaid`) REFERENCES `studyareas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_25` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_26` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_27` FOREIGN KEY (`studyareaid`) REFERENCES `studyareas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_28` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_29` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_3` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_30` FOREIGN KEY (`studyareaid`) REFERENCES `studyareas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_31` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_32` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_4` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_5` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_6` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_7` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_8` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subjects_ibfk_9` FOREIGN KEY (`curriculumId`) REFERENCES `curriculums` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `Users_class_id_foreign_idx` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

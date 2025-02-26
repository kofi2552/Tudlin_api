-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 12, 2025 at 09:13 PM
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
(33, 'SHS 3', '3', '2025-01-24 20:41:52', '2025-01-24 20:41:52');

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
(1, '2025-01-24 20:41:52', '2025-01-24 20:41:52', 125, 33),
(2, '2025-01-24 20:41:52', '2025-01-24 20:41:52', 126, 33),
(3, '2025-01-24 20:41:52', '2025-01-24 20:41:52', 127, 33),
(5, '2025-01-26 11:47:29', '2025-01-26 11:47:29', 132, 33);

-- --------------------------------------------------------

--
-- Table structure for table `currdivisions`
--

CREATE TABLE `currdivisions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `specialId` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `currdivisions`
--

INSERT INTO `currdivisions` (`id`, `name`, `specialId`, `createdAt`, `updatedAt`) VALUES
(1, 'GES', 'MO_2025_57816', '2025-01-24 20:36:48', '2025-01-24 20:36:48');

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
(12, 'SHS', '2025-01-24 20:37:26', '2025-01-24 20:37:26');

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
(1, '2025-01-24 20:40:51', '2025-01-24 20:40:51', 19, 12),
(2, '2025-01-24 20:40:57', '2025-01-24 20:40:57', 20, 12);

-- --------------------------------------------------------

--
-- Table structure for table `curriculumsubjects`
--

CREATE TABLE `curriculumsubjects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subjectId` int(11) NOT NULL,
  `studyArea` varchar(255) NOT NULL,
  `studyAreaId` int(11) NOT NULL,
  `curriculumId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `curriculumsubjects`
--

INSERT INTO `curriculumsubjects` (`id`, `name`, `subjectId`, `studyArea`, `studyAreaId`, `curriculumId`, `createdAt`, `updatedAt`) VALUES
(2, 'French', 122, 'Languages', 20, 12, '2025-01-24 20:41:18', '2025-01-24 20:41:18'),
(3, 'Physics', 123, 'Science', 19, 12, '2025-01-24 20:41:27', '2025-01-24 20:41:27'),
(8, 'E-ICT', 131, 'Science', 19, 12, '2025-01-26 11:01:18', '2025-01-26 11:01:18');

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
(1, '2025-01-24 20:41:52', '2025-01-24 20:41:52', 33, 12);

-- --------------------------------------------------------

--
-- Table structure for table `curriculumtodivisions`
--

CREATE TABLE `curriculumtodivisions` (
  `id` int(11) NOT NULL,
  `curriculumId` int(11) NOT NULL,
  `divisionId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `curriculumtodivisions`
--

INSERT INTO `curriculumtodivisions` (`id`, `curriculumId`, `divisionId`, `createdAt`, `updatedAt`) VALUES
(1, 12, 1, '2025-01-24 20:37:26', '2025-01-24 20:37:26');

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

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`options`)),
  `correctAnswer` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `specialId` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`id`, `name`, `type`, `address`, `createdAt`, `updatedAt`, `specialId`) VALUES
(8, 'Morgan International Com School', 'International', 'International School which offers both national and International curriculums.', '2025-01-19 11:35:35', '2025-01-19 15:59:31', 'MO_2025_57816');

-- --------------------------------------------------------

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `name`, `email`, `class_id`, `curriculum_id`, `schoolId`, `createdAt`, `updatedAt`, `password`, `isRep`) VALUES
(1, 'test', 'test@gmail.com', 33, 12, 'MO_2025_57816', '2025-01-26 10:58:14', '2025-01-26 10:58:14', NULL, 0),
(2, 'tes2', 'test2@gmail.com', 33, 12, 'MO_2025_57816', '2025-01-29 16:39:15', '2025-01-29 16:39:15', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `studyareas`
--


INSERT INTO `studyareas` (`id`, `name`, `createdAt`, `updatedAt`, `curriculumId`) VALUES
(19, 'Science', '2025-01-24 20:40:51', '2025-01-24 20:40:51', 12),
(20, 'Languages', '2025-01-24 20:40:57', '2025-01-24 20:40:57', 12);

-- --------------------------------------------------------


--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `name`, `studyareaid`, `curriculumId`, `createdAt`, `updatedAt`, `isArchive`, `class_id`, `content`) VALUES
(121, 'English', 20, 12, '2025-01-24 20:41:12', '2025-01-24 21:04:18', 1, NULL, NULL),
(122, 'French', 20, 12, '2025-01-24 20:41:18', '2025-01-24 20:41:18', 0, NULL, NULL),
(123, 'Physics', 19, 12, '2025-01-24 20:41:27', '2025-01-24 20:41:27', 0, NULL, NULL),
(125, 'English_SHS 3', 20, 12, '2025-01-24 20:41:52', '2025-01-24 21:27:23', 1, 33, NULL),
(126, 'French_SHS 3', 20, 12, '2025-01-24 20:41:52', '2025-01-24 20:41:52', 0, 33, NULL),
(127, 'Physics_SHS 3', 19, 12, '2025-01-24 20:41:52', '2025-01-24 20:41:52', 0, 33, NULL),
(131, 'E-ICT', 19, 12, '2025-01-26 11:01:18', '2025-01-26 11:01:18', 0, NULL, NULL),
(132, 'E-ICT_SHS 3', 19, 12, '2025-01-26 11:47:29', '2025-01-26 11:47:29', 0, 33, NULL);

-- --------------------------------------------------------


--
-- Dumping data for table `taskcategories`
--

INSERT INTO `taskcategories` (`id`, `name`, `desc`, `createdAt`, `updatedAt`, `schoolId`) VALUES
(2, 'test 3 final', '', '2025-01-25 14:44:42', '2025-01-25 14:44:42', 'MO_2025_57816');

--
-- Indexes for dumped tables
--


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

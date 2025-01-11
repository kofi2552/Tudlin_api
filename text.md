SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

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

CREATE TABLE `classes` (
`id` int(11) NOT NULL,
`name` varchar(255) NOT NULL,
`years` enum('1','2','3','4','5','6','7','8','9','10') DEFAULT '1',
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `classtosubjects` (
`id` int(11) NOT NULL,
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL,
`subjectId` int(11) DEFAULT NULL,
`classId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `curriculums` (
`id` int(11) NOT NULL,
`name` varchar(255) NOT NULL,
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `curriculumstudyareas` (
`id` int(11) NOT NULL,
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL,
`studyAreaId` int(11) DEFAULT NULL,
`curriculumId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `curriculumtoclasses` (
`id` int(11) NOT NULL,
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL,
`classId` int(11) DEFAULT NULL,
`curriculumId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `curriculumtosubjects` (
`id` int(11) NOT NULL,
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL,
`subjectId` int(11) DEFAULT NULL,
`curriculumId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

INSERT INTO `notifies` (`id`, `title`, `subtitle`, `description`, `imageUrl`, `buttonUrl`, `buttonText`, `createdAt`, `updatedAt`) VALUES
(2, 'First Timers Tutorials', 'Using Tudlin to the Fullest', 'Prepare to be part of dynamic conversations that will redefine the boundaries of rich education', 'https://res.cloudinary.com/loyke/image/upload/v1735914412/koyarr/ct8q7avnofgqescqqnmm.jpg', 'https://www.youtube.com/', 'Register to Learn', '2025-01-02 21:33:34', '2025-01-03 14:26:50');

CREATE TABLE `schools` (
`id` int(11) NOT NULL,
`name` varchar(255) NOT NULL,
`type` varchar(255) NOT NULL,
`address` varchar(255) NOT NULL,
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `schools` (`id`, `name`, `type`, `address`, `createdAt`, `updatedAt`) VALUES
(6, 'Morgan International Com School', 'International', 'Agona Swedru', '2024-11-16 18:24:09', '2024-12-08 15:49:19');

CREATE TABLE `studentassessmentscores` (
`id` int(11) NOT NULL,
`assessment_id` int(11) NOT NULL,
`student_id` int(11) NOT NULL,
`score` float NOT NULL,
`max_score` float NOT NULL DEFAULT 100,
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `students` (
`id` int(11) NOT NULL,
`class_id` int(11) DEFAULT NULL,
`curriculum_id` int(11) DEFAULT NULL,
`name` varchar(255) NOT NULL,
`email` varchar(255) NOT NULL,
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `students` (`id`, `class_id`, `curriculum_id`, `name`, `email`, `createdAt`, `updatedAt`) VALUES
(11, 18, 1, 'Nathan Otto', 'no@gmail.com', '2025-01-03 02:02:19', '2025-01-03 02:02:19'),
(12, 22, 1, 'Adom Nhyira', 'adomnhyira@gmail.com', '2025-01-08 21:55:04', '2025-01-08 21:55:04'),
(13, 21, 1, 'Kayla Addo', 'kaylaaddo@gmail.com', '2025-01-08 21:56:41', '2025-01-08 21:56:41');

CREATE TABLE `studenttosubjects` (
`id` int(11) NOT NULL,
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL,
`studentId` int(11) DEFAULT NULL,
`subjectId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `studyareas` (
`id` int(11) NOT NULL,
`name` varchar(255) NOT NULL,
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `taskcategories` (
`id` int(11) NOT NULL,
`name` varchar(255) NOT NULL,
`desc` varchar(255) DEFAULT NULL,
`createdAt` datetime NOT NULL,
`updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

INSERT INTO `users` (`id`, `username`, `email`, `password`, `isAdmin`, `role`, `resetToken`, `resetTokenExpires`, `createdAt`, `updatedAt`, `subject_id`) VALUES
(11, 'kyde', 'wilwek.consult.hr@gmail.com', '$2a$10$TDqkrXwLRNn9GpyXhrNZx.qqw/EfFggn9q.OGAFnNHE/F9pr26KVS', 1, 'tutor', NULL, NULL, '2025-01-07 00:49:47', '2025-01-07 00:49:47', NULL),

BEGIN;

CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tscore INTEGER NOT NULL,
    task_category_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    curriculum_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    years VARCHAR(2) CHECK (years IN ('1','2','3','4','5','6','7','8','9','10')) DEFAULT '1',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE classtosubjects (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    subject_id INTEGER DEFAULT NULL,
    class_id INTEGER DEFAULT NULL
);

CREATE TABLE curriculums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE curriculumstudyareas (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    study_area_id INTEGER DEFAULT NULL,
    curriculum_id INTEGER DEFAULT NULL
);

CREATE TABLE curriculumtoclasses (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    class_id INTEGER DEFAULT NULL,
    curriculum_id INTEGER DEFAULT NULL
);

CREATE TABLE curriculumtosubjects (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    subject_id INTEGER DEFAULT NULL,
    curriculum_id INTEGER DEFAULT NULL
);

CREATE TABLE notifies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    button_url VARCHAR(255) NOT NULL,
    button_text VARCHAR(255) NOT NULL DEFAULT 'Go',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO notifies (id, title, subtitle, description, image_url, button_url, button_text, created_at, updated_at) 
VALUES
(2, 'First Timers Tutorials', 'Using Tudlin to the Fullest', 
'Prepare to be part of dynamic conversations that will redefine the boundaries of rich education', 
'https://res.cloudinary.com/loyke/image/upload/v1735914412/koyarr/ct8q7avnofgqescqqnmm.jpg', 
'https://www.youtube.com/', 'Register to Learn', '2025-01-02 21:33:34', '2025-01-03 14:26:50');

CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO schools (id, name, type, address, created_at, updated_at) 
VALUES
(6, 'Morgan International Com School', 'International', 'Agona Swedru', '2024-11-16 18:24:09', '2024-12-08 15:49:19');

CREATE TABLE studentassessmentscores (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    score FLOAT NOT NULL,
    max_score FLOAT NOT NULL DEFAULT 100,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    class_id INTEGER DEFAULT NULL,
    curriculum_id INTEGER DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO students (id, class_id, curriculum_id, name, email, created_at, updated_at) 
VALUES
(11, 18, 1, 'Nathan Otto', 'no@gmail.com', '2025-01-03 02:02:19', '2025-01-03 02:02:19'),
(12, 22, 1, 'Adom Nhyira', 'adomnhyira@gmail.com', '2025-01-08 21:55:04', '2025-01-08 21:55:04'),
(13, 21, 1, 'Kayla Addo', 'kaylaaddo@gmail.com', '2025-01-08 21:56:41', '2025-01-08 21:56:41');

CREATE TABLE studenttosubjects (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    student_id INTEGER DEFAULT NULL,
    subject_id INTEGER DEFAULT NULL
);

CREATE TABLE studyareas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    study_area_id INTEGER DEFAULT NULL,
    curriculum_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    is_archive BOOLEAN DEFAULT FALSE,
    class_id INTEGER DEFAULT NULL
);

CREATE TABLE taskcategories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    role VARCHAR(10) CHECK (role IN ('tutor', 'student', 'parent')) NOT NULL DEFAULT 'tutor',
    reset_token VARCHAR(255) DEFAULT NULL,
    reset_token_expires VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    subject_id INTEGER DEFAULT NULL
);

INSERT INTO users (id, username, email, password, is_admin, role, reset_token, reset_token_expires, created_at, updated_at, subject_id) 
VALUES
(11, 'kyde', 'wilwek.consult.hr@gmail.com', '$2a$10$TDqkrXwLRNn9GpyXhrNZx.qqw/EfFggn9q.OGAFnNHE/F9pr26KVS', TRUE, 'tutor', NULL, NULL, '2025-01-07 00:49:47', '2025-01-07 00:49:47', NULL);

COMMIT;

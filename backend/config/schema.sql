CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher') NOT NULL,
  name VARCHAR(100) NOT NULL,
  teacher_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_role (role)
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL CHECK (age >= 5 AND age <= 100),
  intake VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_email (email)
);

-- Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(200) NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_email (email)
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(200) NOT NULL,
  teacher_id INT NULL,
  number_of_students INT NOT NULL DEFAULT 0 CHECK (number_of_students >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_teacher_id (teacher_id),
  CONSTRAINT fk_courses_teacher
    FOREIGN KEY (teacher_id)
    REFERENCES teachers(id)
    ON DELETE SET NULL
);

-- Grades Table
CREATE TABLE IF NOT EXISTS grades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  exercise DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (exercise >= 0 AND exercise <= 10),
  homework DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (homework >= 0 AND homework <= 10),
  group_discussion DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (group_discussion >= 0 AND group_discussion <= 10),
  project_exam DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (project_exam >= 0 AND project_exam <= 70),
  total_score DECIMAL(5,2) GENERATED ALWAYS AS (exercise + homework + group_discussion + project_exam) STORED,
  grade VARCHAR(3) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_student_id (student_id),
  INDEX idx_course_id (course_id),
  UNIQUE KEY unique_student_course (student_id, course_id),
  CONSTRAINT fk_grades_student
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_grades_course
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

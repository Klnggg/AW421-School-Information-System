import { pool } from '../config/db.js';

export const getAllCourses = async (req, res) => {
  try {
    const [courses] = await pool.query(
      `SELECT c.*, t.name as teacher_name 
       FROM courses c 
       LEFT JOIN teachers t ON c.teacher_id = t.id 
       ORDER BY c.created_at DESC`
    );
    
    res.json({
      success: true,
      courses: courses.map(course => ({
        id: course.id,
        courseName: course.course_name,
        teacherId: course.teacher_id,
        teacherName: course.teacher_name,
        numberOfStudents: course.number_of_students,
        createdAt: course.created_at
      }))
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch courses' 
    });
  }
};


export const createCourse = async (req, res) => {
  try {
    const { courseName, teacherId, numberOfStudents } = req.body;

    if (!courseName || numberOfStudents === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Course name and number of students are required'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO courses (course_name, teacher_id, number_of_students) VALUES (?, ?, ?)',
      [courseName, teacherId || null, numberOfStudents]
    );

    res.status(201).json({
      success: true,
      course: {
        id: result.insertId,
        courseName,
        teacherId: teacherId || null,
        numberOfStudents
      },
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course'
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName, teacherId, numberOfStudents } = req.body;

    if (!courseName || numberOfStudents === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Course name and number of students are required'
      });
    }

    await pool.query(
      'UPDATE courses SET course_name = ?, teacher_id = ?, number_of_students = ? WHERE id = ?',
      [courseName, teacherId || null, numberOfStudents, id]
    );

    res.json({
      success: true,
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course'
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM courses WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete course' 
    });
  }
};
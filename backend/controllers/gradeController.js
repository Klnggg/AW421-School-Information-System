import { pool } from '../config/db.js';

const calculateGrade = (total) => {
  if (total >= 90) return 'A+';
  if (total >= 85) return 'A';
  if (total >= 80) return 'A-';
  if (total >= 75) return 'B+';
  if (total >= 70) return 'B';
  if (total >= 65) return 'B-';
  if (total >= 60) return 'C+';
  if (total >= 55) return 'C';
  if (total >= 50) return 'C-';
  return 'F';
};

export const getAllGrades = async (req, res) => {
  try {
    const [grades] = await pool.query(
      `SELECT g.*, s.name as student_name, c.course_name 
       FROM grades g 
       LEFT JOIN students s ON g.student_id = s.id 
       LEFT JOIN courses c ON g.course_id = c.id 
       ORDER BY g.created_at DESC`
    );
    
    res.json({
      success: true,
      grades: grades.map(grade => ({
        id: grade.id,
        studentId: grade.student_id,
        studentName: grade.student_name,
        courseId: grade.course_id,
        courseName: grade.course_name,
        exercise: parseFloat(grade.exercise),
        homework: parseFloat(grade.homework),
        groupDiscussion: parseFloat(grade.group_discussion),
        projectExam: parseFloat(grade.project_exam),
        totalScore: parseFloat(grade.total_score),
        grade: grade.grade,
        createdAt: grade.created_at
      }))
    });
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch grades' 
    });
  }
};

export const createGrade = async (req, res) => {
  try {
    const { studentId, courseId, exercise, homework, groupDiscussion, projectExam } = req.body;

    if (!studentId || !courseId || exercise === undefined || homework === undefined || 
        groupDiscussion === undefined || projectExam === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const total = parseFloat(exercise) + parseFloat(homework) + 
                  parseFloat(groupDiscussion) + parseFloat(projectExam);
    const grade = calculateGrade(total);

    const [result] = await pool.query(
      'INSERT INTO grades (student_id, course_id, exercise, homework, group_discussion, project_exam, grade) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [studentId, courseId, exercise, homework, groupDiscussion, projectExam, grade]
    );

    res.status(201).json({
      success: true,
      grade: {
        id: result.insertId,
        studentId,
        courseId,
        exercise: parseFloat(exercise),
        homework: parseFloat(homework),
        groupDiscussion: parseFloat(groupDiscussion),
        projectExam: parseFloat(projectExam),
        totalScore: total,
        grade
      },
      message: 'Grade created successfully'
    });
  } catch (error) {
    console.error('Create grade error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false, 
        message: 'Grade already exists for this student and course' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create grade' 
    });
  }
};

export const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, courseId, exercise, homework, groupDiscussion, projectExam } = req.body;

    if (!studentId || !courseId || exercise === undefined || homework === undefined || 
        groupDiscussion === undefined || projectExam === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const total = parseFloat(exercise) + parseFloat(homework) + 
                  parseFloat(groupDiscussion) + parseFloat(projectExam);
    const grade = calculateGrade(total);

    await pool.query(
      'UPDATE grades SET student_id = ?, course_id = ?, exercise = ?, homework = ?, group_discussion = ?, project_exam = ?, grade = ? WHERE id = ?',
      [studentId, courseId, exercise, homework, groupDiscussion, projectExam, grade, id]
    );

    res.json({
      success: true,
      message: 'Grade updated successfully'
    });
  } catch (error) {
    console.error('Update grade error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false, 
        message: 'Grade already exists for this student and course' 
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update grade'
    });
  }
};

export const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM grades WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Grade deleted successfully'
    });
  } catch (error) {
    console.error('Delete grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete grade'
    });
  }
};


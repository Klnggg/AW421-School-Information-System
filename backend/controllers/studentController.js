import { pool } from '../config/db.js';

export const getAllStudents = async (req, res) => {
  try {
    const [students] = await pool.query(
      'SELECT * FROM students ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      students
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch students' 
    });
  }
};

export const createStudent = async (req, res) => {
  try {
    const { name, age, intake, email } = req.body;

    if (!name || !age || !intake || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const [result] = await pool.query(
      'INSERT INTO students (name, age, intake, email) VALUES (?, ?, ?, ?)',
      [name, age, intake, email]
    );

    res.status(201).json({
      success: true,
      student: {
        id: result.insertId,
        name,
        age,
        intake,
        email
      },
      message: 'Student created successfully'
    });
  } catch (error) {
    console.error('Create student error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create student' 
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, intake, email } = req.body;

    if (!name || !age || !intake || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    await pool.query(
      'UPDATE students SET name = ?, age = ?, intake = ?, email = ? WHERE id = ?',
      [name, age, intake, email, id]
    );

    res.json({
      success: true,
      message: 'Student updated successfully'
    });
  } catch (error) {
    console.error('Update student error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update student' 
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM students WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete student' 
    });
  }
};


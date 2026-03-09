import { pool } from '../config/db.js';

export const getAllTeachers = async (req, res) => {
  try {
    const [teachers] = await pool.query(
      'SELECT * FROM teachers ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      teachers
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch teachers' 
    });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { name, subject, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO teachers (name, subject, email) VALUES (?, ?, ?)',
      [name, subject || null, email]
    );

    res.status(201).json({
      success: true,
      teacher: {
        id: result.insertId,
        name,
        subject,
        email
      },
      message: 'Teacher created successfully'
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create teacher' 
    });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    await pool.query(
      'UPDATE teachers SET name = ?, subject = ?, email = ? WHERE id = ?',
      [name, subject || null, email, id]
    );

    res.json({
      success: true,
      message: 'Teacher updated successfully'
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update teacher'
    });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM teachers WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete teacher' 
    });
  }
};


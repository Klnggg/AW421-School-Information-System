import { pool } from '../config/db.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    const [users] = await pool.query(
      'SELECT id, username, role, name, teacher_id FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }

    const user = users[0];
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        teacherId: user.teacher_id
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, role, name, teacher_id, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        teacherId: user.teacher_id,
        createdAt: user.created_at
      }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users' 
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, role, name, teacherId } = req.body;

    if (!username || !password || !role || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if username already exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    const [result] = await pool.query(
      'INSERT INTO users (username, password, role, name, teacher_id) VALUES (?, ?, ?, ?, ?)',
      [username, password, role, name, teacherId || null]
    );

    res.status(201).json({
      success: true,
      user: {
        id: result.insertId,
        username,
        role,
        name,
        teacherId: teacherId || null
      },
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create user' 
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role, name, teacherId } = req.body;

    if (!username || !role || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, role, and name are required' 
      });
    }

    // Check if username is taken by another user
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? AND id != ?',
      [username, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    let query, params;
    if (password) {
      query = 'UPDATE users SET username = ?, password = ?, role = ?, name = ?, teacher_id = ? WHERE id = ?';
      params = [username, password, role, name, teacherId || null, id];
    } else {
      query = 'UPDATE users SET username = ?, role = ?, name = ?, teacher_id = ? WHERE id = ?';
      params = [username, role, name, teacherId || null, id];
    }

    await pool.query(query, params);

    res.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};


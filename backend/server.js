import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import dayjs from 'dayjs';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import teacherRoutes from './routes/teacher.js';
import courseRoutes from './routes/course.js';
import gradeRoutes from './routes/grade.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = dayjs().format('YYYY-MM-DD hh:mm:ss');

  // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
  const colors = {
    GET: ['\x1b[42m', '\x1b[30m'], // Green background, black text
    POST: ['\x1b[44m', '\x1b[30m'], // Blue background, black text
    PUT: ['\x1b[43m', '\x1b[30m'], // Yellow background, black text
    DELETE: ['\x1b[41m', '\x1b[30m'], // Red background, black text
    BOLD: '\x1b[1m',
    RESET: '\x1b[0m'
  };

  console.log(`[${timestamp}] - ${colors.BOLD}${colors[req.method][0]}${colors[req.method][1]}${req.method}${colors.RESET} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/grades', gradeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const startServer = async () => {
  try {
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`\nServer is running on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
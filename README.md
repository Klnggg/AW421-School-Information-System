# School Information System (SIS)

A full-stack web application for managing school-related data including student records, teachers, courses, and grades.

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Formik + Yup** - Form handling and validation
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Express.js** - Web framework
- **MySQL** - Database
- **Node.js** - Runtime
- **CORS** - Cross-origin resource sharing
- **Body Parser** - Request parsing
- **Day.js** - Date handling

## Features

- **Dashboard** - Overview with statistics (total students, teachers, courses, average grades)
- **Student Management** - Add, edit, delete student records with validation
- **Teacher Management** - Admin-only: Manage teacher records
- **Course Management** - Admin-only: Manage courses and assign teachers
- **Grade Management** - Record and update student grades per course
- **Authentication** - Login system with role-based access (Admin/Teacher)
- **Dark Mode** - Toggle between light and dark themes

## Project Structure

```
school-information-system/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (SchoolContext, SnackProvider)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service
│   │   ├── App.jsx          # Main app with routing
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Express backend
│   ├── config/
│   │   ├── db.js            # Database connection
│   │   └── schema.sql       # SQL schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── student.js       # Student CRUD
│   │   ├── teacher.js       # Teacher CRUD
│   │   ├── course.js        # Course CRUD
│   │   └── grade.js         # Grade CRUD
│   ├── server.js            # Express server
│   ├── .env                 # Environment variables
│   └── package.json
│
├── project-docs.md          # Project requirements
└── README.md                # This file
```

## Database Schema

| Table | Description |
|-------|-------------|
| `users` | User accounts (admin/teacher) with login credentials |
| `students` | Student records (name, age, intake, email) |
| `teachers` | Teacher records (name, subject, email) |
| `courses` | Course information with assigned teachers |
| `grades` | Student grades per course (exercise, homework, discussion, exam) |

## Prerequisites

- Node.js 18+
- MySQL 8.0+

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd school-information-system
```

### 2. Setup Database

Create a MySQL database and import the schema:

```bash
# Login to MySQL
mysql -u root -p

# Run the schema (from backend/config/schema.sql)
source path/to/backend/config/schema.sql
```

### 3. Configure Backend

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_db
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 4. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

## Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Teacher | teacher | teacher123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Teachers
- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Grades
- `GET /api/grades` - Get all grades
- `POST /api/grades` - Create grade
- `PUT /api/grades/:id` - Update grade
- `DELETE /api/grades/:id` - Delete grade

## Form Validation

### Student
- Name: Required, min 3 characters
- Age: Number between 5-100
- Intake: Required (e.g., "1st Grade")
- Email: Valid email format

### Teacher
- Name: Required, min 3 characters
- Subject: Required
- Email: Valid email format

### Course
- Course Name: Required
- Teacher: Required (existing teacher)
- Number of Students: Positive integer

### Grade
- Student: Required
- Course: Required
- Exercise: 0-10
- Homework: 0-10
- Group Discussion: 0-10
- Project Exam: 0-70

## License

ISC

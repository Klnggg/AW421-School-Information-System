import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authAPI, studentsAPI, teachersAPI, coursesAPI, gradesAPI } from '../services/api';

const SchoolContext = createContext();

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within SchoolProvider');
  }
  return context;
};

export const SchoolProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [users, setUsers] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved === 'true';
  });

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);

  const isFetchingData = useRef(false);
  const isFetchingUsers = useRef(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const fetchAllData = async () => {
    if (isFetchingData.current) {
      return;
    }

    try {
      isFetchingData.current = true;
      setLoading(true);
      const [studentsRes, teachersRes, coursesRes, gradesRes] = await Promise.all([
        studentsAPI.getAll(),
        teachersAPI.getAll(),
        coursesAPI.getAll(),
        gradesAPI.getAll(),
      ]);

      setStudents(studentsRes.students || []);
      setTeachers(teachersRes.teachers || []);
      setCourses(coursesRes.courses || []);
      setGrades(gradesRes.grades || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
      isFetchingData.current = false;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      if (response.success) {
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setStudents([]);
    setTeachers([]);
    setCourses([]);
    setGrades([]);
    setUsers([]);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // User CRUD operations
  const fetchUsers = async () => {
    if (isFetchingUsers.current) {
      return;
    }

    try {
      isFetchingUsers.current = true;
      const response = await authAPI.getAllUsers();
      if (response.success) {
        setUsers(response.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      isFetchingUsers.current = false;
    }
  };

  const addUser = async (userData) => {
    try {
      const response = await authAPI.createUser(userData);
      if (response.success) {
        await fetchUsers();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const response = await authAPI.updateUser(id, userData);
      if (response.success) {
        await fetchUsers();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await authAPI.deleteUser(id);
      if (response.success) {
        await fetchUsers();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Student CRUD operations
  const addStudent = async (student) => {
    try {
      const response = await studentsAPI.create(student);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateStudent = async (id, student) => {
    try {
      const response = await studentsAPI.update(id, student);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await studentsAPI.delete(id);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Teacher CRUD operations
  const addTeacher = async (teacher) => {
    try {
      const response = await teachersAPI.create(teacher);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateTeacher = async (id, teacher) => {
    try {
      const response = await teachersAPI.update(id, teacher);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteTeacher = async (id) => {
    try {
      const response = await teachersAPI.delete(id);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Course CRUD operations
  const addCourse = async (course) => {
    try {
      const response = await coursesAPI.create(course);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateCourse = async (id, course) => {
    try {
      const response = await coursesAPI.update(id, course);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteCourse = async (id) => {
    try {
      const response = await coursesAPI.delete(id);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Grade CRUD operations
  const addGrade = async (gradeData) => {
    try {
      const response = await gradesAPI.create(gradeData);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const updateGrade = async (id, gradeData) => {
    try {
      const response = await gradesAPI.update(id, gradeData);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const deleteGrade = async (id) => {
    try {
      const response = await gradesAPI.delete(id);
      if (response.success) {
        await fetchAllData();
        return response;
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    // Auth
    currentUser,
    isAuthenticated,
    login,
    logout,
    // Theme
    isDarkMode,
    toggleTheme,
    // Users
    users,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    // Students
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    // Teachers
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    // Courses
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    // Grades
    grades,
    addGrade,
    updateGrade,
    deleteGrade,
    // Loading
    loading,
    fetchAllData,
  };

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
};

export default SchoolContext;
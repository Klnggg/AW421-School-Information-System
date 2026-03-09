const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (username, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  getAllUsers: () => apiCall('/auth/users'),
  
  createUser: (userData) =>
    apiCall('/auth/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  updateUser: (id, userData) =>
    apiCall(`/auth/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  deleteUser: (id) =>
    apiCall(`/auth/users/${id}`, {
      method: 'DELETE',
    }),
};

// Students API
export const studentsAPI = {
  getAll: () => apiCall('/students'),

  create: (studentData) =>
    apiCall('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),
  
  update: (id, studentData) =>
    apiCall(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    }),
  
  delete: (id) =>
    apiCall(`/students/${id}`, {
      method: 'DELETE',
    }),
};

// Teachers API
export const teachersAPI = {
  getAll: () => apiCall('/teachers'),
  
  create: (teacherData) =>
    apiCall('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    }),
  
  update: (id, teacherData) =>
    apiCall(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teacherData),
    }),
  
  delete: (id) =>
    apiCall(`/teachers/${id}`, {
      method: 'DELETE',
    }),
};

// Courses API
export const coursesAPI = {
  getAll: () => apiCall('/courses'),
  
  create: (courseData) =>
    apiCall('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),
  
  update: (id, courseData) =>
    apiCall(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),
  
  delete: (id) =>
    apiCall(`/courses/${id}`, {
      method: 'DELETE',
    }),
};

// Grades API
export const gradesAPI = {
  getAll: () => apiCall('/grades'),
  
  create: (gradeData) =>
    apiCall('/grades', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    }),
  
  update: (id, gradeData) =>
    apiCall(`/grades/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    }),
  
  delete: (id) =>
    apiCall(`/grades/${id}`, {
      method: 'DELETE',
    }),
};
import { useState, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { User, UserStar, Book, GraduationCap, Plus, Pencil, Trash2, Users, X } from 'lucide-react';
import UserForm from '../components/UserForm';
import DataTable from '../components/DataTable';

const Dashboard = () => {
  const {
    students,
    teachers,
    courses,
    grades,
    isDarkMode,
    currentUser,
    users,
    fetchUsers,
    deleteUser
  } = useSchool();

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (currentUser?.role === 'admin' && activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const calculateAverageGrade = () => {
    if (grades.length === 0) return 'N/A';

    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'F': 0.0
    };

    const total = grades.reduce((sum, g) => sum + (gradePoints[g.grade] || 0), 0);
    const average = total / grades.length;
    return average.toFixed(2);
  };

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      darkBg: 'bg-blue-900/20',
      darkText: 'text-blue-400',
      icon: <User className="h-9 w-9" />,
    },
    {
      title: 'Total Teachers',
      value: teachers.length,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      darkBg: 'bg-emerald-900/20',
      darkText: 'text-emerald-400',
      icon: <UserStar className="h-9 w-9" />,
    },
    {
      title: 'Total Courses',
      value: courses.length,
      color: 'text-violet-600',
      bgColor: 'bg-violet-100',
      darkBg: 'bg-violet-900/20',
      darkText: 'text-violet-400',
      icon: <Book className="h-9 w-9" />,
    },
    {
      title: 'Average GPA',
      value: calculateAverageGrade(),
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      darkBg: 'bg-amber-900/20',
      darkText: 'text-amber-400',
      icon: <GraduationCap className="h-9 w-9" />,
    }
  ];

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Dashboard
          </h1>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Welcome back, {currentUser?.name}! Manage your school system.
          </p>
        </div>
      </div>

      {currentUser?.role === 'admin' && (
        <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? isDarkMode
                    ? 'border-blue-500 text-blue-400'
                    : 'border-blue-600 text-blue-600'
                  : isDarkMode
                    ? 'border-transparent text-slate-400 hover:text-slate-300'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? isDarkMode
                    ? 'border-blue-500 text-blue-400'
                    : 'border-blue-600 text-blue-600'
                  : isDarkMode
                    ? 'border-transparent text-slate-400 hover:text-slate-300'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="inline h-4 w-4 mr-1" />
              User Management
            </button>
          </div>
        </div>
      )}

      {(currentUser?.role !== 'admin' || activeTab === 'overview') && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow ${
                  isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {stat.title}
                    </p>
                    <p className={`mt-2 text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`flex items-center justify-center rounded-full p-3 ${
                    isDarkMode ? `${stat.darkBg} ${stat.darkText}` : `${stat.bgColor} ${stat.color}`
                  }`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Students */}
        <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className={`border-b px-6 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Students</h2>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Latest enrolled students</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{student.name}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{student.intake}</p>
                    </div>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{student.email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Courses */}
        <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
          <div className={`border-b px-6 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Active Courses</h2>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Currently running courses</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {courses.slice(0, 5).map((course) => {
                const teacher = teachers.find(t => t.id === course.teacherId);
                return (
                  <div key={course.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                          isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
                        }`}>
                          <Book className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{course.courseName}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{teacher?.name || 'No Teacher'}</p>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {course.numberOfStudents} students
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
          </div>
        </>
      )}

      {currentUser?.role === 'admin' && activeTab === 'users' && (
        <div className={`rounded-xl border shadow-sm ${
          isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
        }`}>
          <div className={`flex items-center justify-between border-b px-6 py-4 ${
            isDarkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                User Management
              </h2>
              <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Manage system users and their roles
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleCloseForm}></div>
                <div className={`relative w-full max-w-md transform overflow-hidden rounded-xl shadow-2xl transition-all ${
                  isDarkMode ? 'bg-slate-800' : 'bg-white'
                }`}>
                  <div className={`border-b px-6 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {editingUser ? 'Edit User' : 'Add New User'}
                      </h2>
                      <button
                        onClick={handleCloseForm}
                        className={`rounded-lg p-1.5 transition-colors ${
                          isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                        }`}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <UserForm user={editingUser} onClose={handleCloseForm} />
                  </div>
                </div>
              </div>
            </div>
          )}
            <div className="p-6">

            <DataTable
              data={users.map(user => ({
                ...user,
                teacherName: teachers.find(t => t.id === user.teacherId)?.name || '-'
              }))}
              columns={[
                {
                  header: 'Username',
                  accessor: 'username',
                  cell: (user) => (
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {user.username}
                    </div>
                  ),
                },
                {
                  header: 'Name',
                  accessor: 'name',
                  cell: (user) => (
                    <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {user.name}
                    </div>
                  ),
                },
                {
                  header: 'Role',
                  accessor: 'role',
                  cell: (user) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                        : isDarkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {user.role}
                    </span>
                  ),
                },
                {
                  header: 'Teacher Link',
                  accessor: 'teacherName',
                  cell: (user) => (
                    <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {user.teacherName}
                    </div>
                  ),
                },
              ]}
              searchable={true}
              searchPlaceholder="Search users by username, name, or role..."
              searchFields={['username', 'name', 'role']}
              pageSize={10}
              emptyMessage="No users found"
              emptyIcon={Users}
              isDarkMode={isDarkMode}
              renderRowActions={(user) => {
                const originalUser = users.find(u => u.id === user.id);
                return (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(originalUser);
                      }}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(originalUser.id);
                      }}
                      className="inline-flex items-center gap-1.5 cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </>
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
import { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import CourseForm from '../components/CourseForm';
import DataTable from '../components/DataTable';
import { Book, Plus, Pencil, Trash2, X } from 'lucide-react';

const Courses = () => {
  const { courses, teachers, deleteCourse, isDarkMode } = useSchool();
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'No Teacher Assigned';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold dark:text-white`}>Courses</h1>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage course offerings and enrollments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Course
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleCloseForm}></div>
            <div className={`relative w-full max-w-md transform overflow-hidden rounded-xl shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className={`border-b px-6 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </h2>
                  <button onClick={handleCloseForm} className={`rounded-lg p-1 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-500'}`}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="px-6 py-4">
                <CourseForm course={editingCourse} onClose={handleCloseForm} />
              </div>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={courses.map(course => ({
          ...course,
          teacherName: getTeacherName(course.teacherId)
        }))}
        columns={[
          {
            header: 'Course Name',
            accessor: 'courseName',
            cell: (course) => (
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                  <Book className="h-4 w-4" />
                </div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{course.courseName}</div>
              </div>
            ),
          },
          {
            header: 'Teacher',
            accessor: 'teacherName',
            cell: (course) => (
              <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{course.teacherName}</div>
            ),
          },
          {
            header: 'Students',
            accessor: 'numberOfStudents',
            cell: (course) => (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isDarkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                {course.numberOfStudents} students
              </span>
            ),
          },
        ]}
        searchable={true}
        searchPlaceholder="Search courses by name or teacher..."
        searchFields={['courseName', 'teacherName']}
        pageSize={10}
        emptyMessage="No courses found"
        emptyIcon={Book}
        isDarkMode={isDarkMode}
        renderRowActions={(course) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(course);
              }}
              className="inline-flex items-center gap-1.5 cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(course.id);
              }}
              className="inline-flex items-center gap-1.5 cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </>
        )}
      />
    </div>
  );
};

export default Courses;
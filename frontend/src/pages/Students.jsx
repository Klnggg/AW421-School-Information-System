import { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import StudentForm from '../components/StudentForm';
import DataTable from '../components/DataTable';
import { Plus, Pencil, Trash2, X, Users } from 'lucide-react';

const Students = () => {
  const { students, deleteStudent, isDarkMode } = useSchool();
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Students</h1>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage student information and records
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Student
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={handleCloseForm}></div>
            <div className={`relative w-full max-w-md transform overflow-hidden rounded-xl shadow-2xl transition-all ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <div className={`border-b px-6 py-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className={`rounded-lg p-1 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-500'}`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="px-6 py-4">
                <StudentForm student={editingStudent} onClose={handleCloseForm} />
              </div>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={students}
        columns={[
          {
            header: 'Name',
            accessor: 'name',
            cell: (student) => (
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  {student.name.charAt(0)}
                </div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{student.name}</div>
              </div>
            ),
          },
          {
            header: 'Age',
            accessor: 'age',
            cell: (student) => (
              <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{student.age}</div>
            ),
          },
          {
            header: 'Intake',
            accessor: 'intake',
            cell: (student) => (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                {student.intake}
              </span>
            ),
          },
          {
            header: 'Email',
            accessor: 'email',
            cell: (student) => (
              <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{student.email}</div>
            ),
          },
        ]}
        searchable={true}
        searchPlaceholder="Search students by name, email, or intake..."
        searchFields={['name', 'email', 'intake']}
        pageSize={10}
        emptyMessage="No students found"
        emptyIcon={Users}
        isDarkMode={isDarkMode}
        renderRowActions={(student) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(student);
              }}
              className="inline-flex items-center gap-1.5 cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-4 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(student.id);
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

export default Students;
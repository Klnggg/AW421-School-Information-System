import { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import GradeForm from '../components/GradeForm';
import DataTable from '../components/DataTable';
import { Plus, Pencil, Trash2, X, Users } from 'lucide-react';

const Grades = () => {
  const { grades, students, courses, deleteGrade, isDarkMode } = useSchool();
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  const handleEdit = (grade) => {
    setEditingGrade(grade);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      deleteGrade(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGrade(null);
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.courseName : 'Unknown Course';
  };

  const getGradeColor = (grade) => {
    if (isDarkMode) {
      if (grade.startsWith('A')) return 'bg-emerald-900 text-emerald-300 ring-1 ring-emerald-600/50';
      if (grade.startsWith('B')) return 'bg-blue-900 text-blue-300 ring-1 ring-blue-600/50';
      if (grade.startsWith('C')) return 'bg-amber-900 text-amber-300 ring-1 ring-amber-600/50';
      if (grade === 'F') return 'bg-red-900 text-red-300 ring-1 ring-red-600/50';
      return 'bg-slate-700 text-slate-300';
    } else {
      if (grade.startsWith('A')) return 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20';
      if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20';
      if (grade.startsWith('C')) return 'bg-amber-100 text-amber-700 ring-1 ring-amber-600/20';
      if (grade === 'F') return 'bg-red-100 text-red-700 ring-1 ring-red-600/20';
      return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Grade Management</h1>
          <p className={`mt-1 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Track and manage student grades</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Grade
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
                    {editingGrade ? 'Edit Grade' : 'Add New Grade'}
                  </h2>
                  <button onClick={handleCloseForm} className={`rounded-lg p-1 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-500'}`}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="px-6 py-4">
                <GradeForm grade={editingGrade} onClose={handleCloseForm} />
              </div>
            </div>
          </div>
        </div>
      )}

      <DataTable
        data={grades.map(grade => ({
          ...grade,
          studentName: getStudentName(grade.studentId),
          courseName: getCourseName(grade.courseId)
        }))}
        columns={[
          {
            header: 'Student',
            accessor: 'studentName',
            cell: (grade) => (
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  {grade.studentName.charAt(0)}
                </div>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{grade.studentName}</div>
              </div>
            ),
          },
          {
            header: 'Course',
            accessor: 'courseName',
            cell: (grade) => (
              <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{grade.courseName}</div>
            ),
          },
          {
            header: (
              <>
                Exercise<br />
                <span className="text-[10px] font-normal">(10)</span>
              </>
            ),
            accessor: 'exercise',
            align: 'center',
            cell: (grade) => (
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{grade.exercise}</span>
            ),
          },
          {
            header: (
              <>
                Homework<br />
                <span className="text-[10px] font-normal">(10)</span>
              </>
            ),
            accessor: 'homework',
            align: 'center',
            cell: (grade) => (
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{grade.homework}</span>
            ),
          },
          {
            header: (
              <>
                Discussion<br />
                <span className="text-[10px] font-normal">(10)</span>
              </>
            ),
            accessor: 'groupDiscussion',
            align: 'center',
            cell: (grade) => (
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{grade.groupDiscussion}</span>
            ),
          },
          {
            header: (
              <>
                Project/Exam<br />
                <span className="text-[10px] font-normal">(70)</span>
              </>
            ),
            accessor: 'projectExam',
            align: 'center',
            cell: (grade) => (
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{grade.projectExam}</span>
            ),
          },
          {
            header: (
              <>
                Total<br />
                <span className="text-[10px] font-normal">(100)</span>
              </>
            ),
            accessor: 'totalScore',
            align: 'center',
            cell: (grade) => (
              <span className={`text-sm font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{grade.totalScore}</span>
            ),
          },
          {
            header: 'Grade',
            accessor: 'grade',
            align: 'center',
            cell: (grade) => (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getGradeColor(grade.grade)}`}>
                {grade.grade}
              </span>
            ),
          },
        ]}
        searchable={true}
        searchPlaceholder="Search grades by student or course..."
        searchFields={['studentName', 'courseName']}
        pageSize={10}
        emptyMessage="No grades found"
        emptyIcon={Users}
        isDarkMode={isDarkMode}
        renderRowActions={(grade) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(grade);
              }}
              className="inline-flex items-center gap-1.5 cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-3 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(grade.id);
              }}
              className="inline-flex items-center gap-1.5 cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </>
        )}
      />
    </div>
  );
};

export default Grades;
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSchool } from '../context/SchoolContext';
import { ChevronDown } from 'lucide-react';
import { useSnack } from '../context/SnackProvider';

const GradeForm = ({ grade, onClose }) => {
  const { addGrade, updateGrade, students, courses, isDarkMode } = useSchool();
  const { showSnack } = useSnack();

  const initialValues = {
    studentId: grade?.studentId || '',
    courseId: grade?.courseId || '',
    exercise: grade?.exercise || '',
    homework: grade?.homework || '',
    groupDiscussion: grade?.groupDiscussion || '',
    projectExam: grade?.projectExam || '',
  };

  const validationSchema = Yup.object({
    studentId: Yup.number()
      .required('Student is required'),
    courseId: Yup.number()
      .required('Course is required'),
    exercise: Yup.number()
      .min(0, 'Score must be at least 0')
      .max(10, 'Score must be at most 10')
      .required('Exercise score is required'),
    homework: Yup.number()
      .min(0, 'Score must be at least 0')
      .max(10, 'Score must be at most 10')
      .required('Homework score is required'),
    groupDiscussion: Yup.number()
      .min(0, 'Score must be at least 0')
      .max(10, 'Score must be at most 10')
      .required('Group Discussion score is required'),
    projectExam: Yup.number()
      .min(0, 'Score must be at least 0')
      .max(70, 'Score must be at most 70')
      .required('Project/Exam score is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {

    const gradeData = {
      studentId: parseInt(values.studentId),
      courseId: parseInt(values.courseId),
      exercise: parseFloat(values.exercise),
      homework: parseFloat(values.homework),
      groupDiscussion: parseFloat(values.groupDiscussion),
      projectExam: parseFloat(values.projectExam),
    };

    let result;
    if (grade) {
      result = await updateGrade(grade.id, gradeData);
    } else {
      result = await addGrade(gradeData);
    }

    if (!result.success) {
      showSnack({ type: 'error', message: result.message });
      setSubmitting(false);
      return;
    }

    showSnack({ message: result.message });
    setSubmitting(false);
    onClose();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, values }) => {
        const exercise = parseFloat(values.exercise) || 0;
        const homework = parseFloat(values.homework) || 0;
        const groupDiscussion = parseFloat(values.groupDiscussion) || 0;
        const projectExam = parseFloat(values.projectExam) || 0;
        const totalScore = exercise + homework + groupDiscussion + projectExam;

        const calculateGrade = (total) => {
          if (total >= 90) return 'A+';
          if (total >= 85) return 'A';
          if (total >= 80) return 'A-';
          if (total >= 75) return 'B+';
          if (total >= 70) return 'B';
          if (total >= 65) return 'B-';
          if (total >= 60) return 'C+';
          if (total >= 55) return 'C';
          if (total >= 50) return 'C-';
          return 'F';
        };

        const finalGrade = calculateGrade(totalScore);

        return (
          <Form className="space-y-5">
            <div>
              <label htmlFor="studentId" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Student</label>
              <div className="relative">
                <Field
                  as="select"
                  name="studentId"
                  className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm shadow-sm transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.studentId && touched.studentId
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                      : isDarkMode
                        ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.intake}
                    </option>
                  ))}
                </Field>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>
              <ErrorMessage name="studentId" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
            </div>

            <div>
              <label htmlFor="courseId" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Course</label>
              <div className="relative">
                <Field
                  as="select"
                  name="courseId"
                  className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm shadow-sm transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.courseId && touched.courseId
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                      : isDarkMode
                        ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.courseName}
                    </option>
                  ))}
                </Field>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>
              <ErrorMessage name="courseId" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
            </div>

            {/* Score Inputs Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="exercise" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Exercise <span className="text-xs text-slate-500">(Max: 10)</span>
                </label>
                <Field
                  type="number"
                  name="exercise"
                  step="0.5"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.exercise && touched.exercise
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                      : isDarkMode
                        ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                  placeholder="0-10"
                />
                <ErrorMessage name="exercise" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
              </div>

              <div>
                <label htmlFor="homework" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Homework <span className="text-xs text-slate-500">(Max: 10)</span>
                </label>
                <Field
                  type="number"
                  name="homework"
                  step="0.5"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.homework && touched.homework
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                      : isDarkMode
                        ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                  placeholder="0-10"
                />
                <ErrorMessage name="homework" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
              </div>

              <div>
                <label htmlFor="groupDiscussion" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Group Discussion <span className="text-xs text-slate-500">(Max: 10)</span>
                </label>
                <Field
                  type="number"
                  name="groupDiscussion"
                  step="0.5"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.groupDiscussion && touched.groupDiscussion
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                      : isDarkMode
                        ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                  placeholder="0-10"
                />
                <ErrorMessage name="groupDiscussion" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
              </div>

              <div>
                <label htmlFor="projectExam" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Project/Exam <span className="text-xs text-slate-500">(Max: 70)</span>
                </label>
                <Field
                  type="number"
                  name="projectExam"
                  step="0.5"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectExam && touched.projectExam
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                      : isDarkMode
                        ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                  placeholder="0-70"
                />
                <ErrorMessage name="projectExam" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Total Score and Grade Display */}
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Total Score</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{totalScore.toFixed(1)} / 100</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Final Grade</p>
                  <p className={`text-2xl font-bold ${
                    finalGrade.startsWith('A') ? 'text-emerald-600' :
                    finalGrade.startsWith('B') ? 'text-blue-600' :
                    finalGrade.startsWith('C') ? 'text-amber-600' :
                    'text-red-600'
                  }`}>{finalGrade}</p>
                </div>
              </div>
            </div>

            <div className={`flex justify-end gap-3 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <button
                type="button"
                onClick={onClose}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors ${
                  isDarkMode
                    ? 'border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {grade ? 'Update Grade' : 'Add Grade'}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default GradeForm;


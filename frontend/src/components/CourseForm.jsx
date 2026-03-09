import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSchool } from '../context/SchoolContext';
import { ChevronDown } from 'lucide-react';
import { useSnack } from '../context/SnackProvider';

const CourseForm = ({ course, onClose }) => {
  const { addCourse, updateCourse, teachers, isDarkMode } = useSchool();
  const { showSnack } = useSnack();

  const initialValues = {
    courseName: course?.courseName || '',
    teacherId: course?.teacherId || '',
    numberOfStudents: course?.numberOfStudents || '',
  };

  const validationSchema = Yup.object({
    courseName: Yup.string()
      .required('Course name is required'),
    teacherId: Yup.number()
      .nullable()
      .transform((value, originalValue) => originalValue === '' ? null : value),
    numberOfStudents: Yup.number()
      .min(0, 'Number of students must be 0 or greater')
      .required('Number of students is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {

    const courseData = {
      ...values,
      teacherId: values.teacherId ? parseInt(values.teacherId) : null,
      numberOfStudents: parseInt(values.numberOfStudents),
    };

    let result;
    if (course) {
      result = await updateCourse(course.id, courseData);
    } else {
      result = await addCourse(courseData);
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
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-5">
          <div>
            <label htmlFor="courseName" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Course Name</label>
            <Field
              type="text"
              name="courseName"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.courseName && touched.courseName
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                  : isDarkMode
                    ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
              placeholder="Enter course name"
            />
            <ErrorMessage name="courseName" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          <div>
            <label htmlFor="teacherId" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Teacher <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>(optional)</span>
            </label>
            <div className="relative">
              <Field
                as="select"
                name="teacherId"
                className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm shadow-sm transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.teacherId && touched.teacherId
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                    : isDarkMode
                      ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              >
                <option value="">No teacher assigned</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} {teacher.subject ? `- ${teacher.subject}` : ''}
                  </option>
                ))}
              </Field>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              </div>
            </div>
            <ErrorMessage name="teacherId" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          <div>
            <label htmlFor="numberOfStudents" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Number of Students</label>
            <Field
              type="number"
              name="numberOfStudents"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.numberOfStudents && touched.numberOfStudents
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                  : isDarkMode
                    ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
              placeholder="Enter number of students"
            />
            <ErrorMessage name="numberOfStudents" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
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
              {course ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CourseForm;
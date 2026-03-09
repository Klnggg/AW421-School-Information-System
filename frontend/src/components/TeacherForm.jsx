import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSchool } from '../context/SchoolContext';
import { useSnack } from '../context/SnackProvider';

const TeacherForm = ({ teacher, onClose }) => {
  const { addTeacher, updateTeacher, isDarkMode } = useSchool();
  const { showSnack } = useSnack();

  const initialValues = {
    name: teacher?.name || '',
    subject: teacher?.subject || '',
    email: teacher?.email || '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Name is required'),
    subject: Yup.string(),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {

    let result;
    if (teacher) {
      result = await updateTeacher(teacher.id, values);
    } else {
      result = await addTeacher(values);
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
            <label htmlFor="name" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Name</label>
            <Field
              type="text"
              name="name"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name && touched.name
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                  : isDarkMode
                    ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
              placeholder="Enter teacher name"
            />
            <ErrorMessage name="name" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          <div>
            <label htmlFor="subject" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Subject <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>(optional)</span>
            </label>
            <Field
              type="text"
              name="subject"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.subject && touched.subject
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                  : isDarkMode
                    ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
              placeholder="e.g., Mathematics, Physics, Computer Science"
            />
            <ErrorMessage name="subject" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email</label>
            <Field
              type="email"
              name="email"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email && touched.email
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                  : isDarkMode
                    ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
              placeholder="teacher@school.com"
            />
            <ErrorMessage name="email" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
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
              {teacher ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TeacherForm;
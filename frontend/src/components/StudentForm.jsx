import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSchool } from '../context/SchoolContext';
import { useSnack } from '../context/SnackProvider';

const StudentForm = ({ student, onClose }) => {
  const { addStudent, updateStudent, isDarkMode } = useSchool();
  const { showSnack } = useSnack();

  const initialValues = {
    name: student?.name || '',
    age: student?.age || '',
    intake: student?.intake || '',
    email: student?.email || '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Name is required'),
    age: Yup.number()
      .min(5, 'Age must be between 5 and 100')
      .max(100, 'Age must be between 5 and 100')
      .required('Age is required'),
    intake: Yup.string()
      .required('Intake is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {

    let result;
    if (student) {
      result = await updateStudent(student.id, values);
    } else {
      result = await addStudent(values);
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
            <label htmlFor="name" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Name
            </label>
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
              placeholder="Enter student name"
            />
            <ErrorMessage name="name" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          <div>
            <label htmlFor="age" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Age
            </label>
            <Field
              type="number"
              name="age"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.age && touched.age
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                  : isDarkMode
                    ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
              placeholder="Enter age"
            />
            <ErrorMessage name="age" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          <div>
            <label htmlFor="intake" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Intake
            </label>
            <Field
              type="text"
              name="intake"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.intake && touched.intake
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                  : isDarkMode
                    ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
              placeholder="Enter intake"
            />
            <ErrorMessage name="intake" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Email
            </label>
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
              placeholder="student@example.com"
            />
            <ErrorMessage name="email" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          <div className={`flex justify-end gap-3 pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors ${
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
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {student ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StudentForm;


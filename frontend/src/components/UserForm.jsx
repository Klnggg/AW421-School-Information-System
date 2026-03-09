import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { useSnack } from '../context/SnackProvider';

const UserForm = ({ user, onClose }) => {
  const { addUser, updateUser, isDarkMode, teachers } = useSchool();
  const [showPassword, setShowPassword] = useState(false);
  const { showSnack } = useSnack();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    password: user ? Yup.string().min(6, 'Password must be at least 6 characters') : Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    role: Yup.string()
      .oneOf(['admin', 'teacher'], 'Invalid role')
      .required('Role is required'),
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    teacherId: Yup.number().when('role', {
      is: 'teacher',
      then: (schema) => schema.required('Teacher selection is required for teacher role'),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const initialValues = {
    username: user?.username || '',
    password: '',
    role: user?.role || 'teacher',
    name: user?.name || '',
    teacherId: user?.teacherId || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const userData = {
      ...values,
      teacherId: values.teacherId ? parseInt(values.teacherId) : null,
    };

    let result;

    if (user) {
      result = await updateUser(user.id, userData);
    } else {
      result = await addUser(userData);
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
      {({ isSubmitting, values, errors, touched }) => (
        <Form className="space-y-5">
          <div>
            <label htmlFor="username" className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-slate-200' : 'text-slate-700'
            }`}>
              Username
            </label>
            <Field
              id="username"
              name="username"
              type="text"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.username && touched.username
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                  : isDarkMode
                    ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
              placeholder="Enter username"
            />
            <ErrorMessage name="username" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-slate-200' : 'text-slate-700'
            }`}>
              Password {user && <span className="text-xs text-slate-400">(leave empty to keep current)</span>}
            </label>
            <div className="relative">
              <Field
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password && touched.password
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                  : isDarkMode
                    ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                  isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <ErrorMessage name="password" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          <div>
            <label htmlFor="role" className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-slate-200' : 'text-slate-700'
            }`}>
              Role
            </label>
            <div className="relative">
              <Field
                as="select"
                id="role"
                name="role"
                className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm shadow-sm transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.role && touched.role
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                    : isDarkMode
                      ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
              >
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </Field>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              </div>
            </div>
            <ErrorMessage name="role" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-1 ${
              isDarkMode ? 'text-slate-200' : 'text-slate-700'
            }`}>
              Full Name
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name && touched.name
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                  : isDarkMode
                    ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                    : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
              placeholder="Enter full name"
            />
            <ErrorMessage name="name" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
          </div>

          {values.role === 'teacher' && (
            <div>
              <label htmlFor="teacherId" className={`block text-sm font-medium mb-1 ${
                isDarkMode ? 'text-slate-200' : 'text-slate-700'
              }`}>
                Link to Teacher
              </label>
              <div className="relative">
                <Field
                  as="select"
                  id="teacherId"
                  name="teacherId"
                  className={`w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm shadow-sm transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.teacherId && touched.teacherId
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:text-white dark:border-red-700'
                      : isDarkMode
                        ? 'border-slate-600 bg-slate-700 text-white hover:border-slate-500'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.subject}
                    </option>
                  ))}
                </Field>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className={`h-4 w-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
              </div>
              <ErrorMessage name="teacherId" component="div" className="mt-1.5 text-sm text-red-600 dark:text-red-400" />
            </div>
          )}

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
              {user ? 'Update User' : 'Add User'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;


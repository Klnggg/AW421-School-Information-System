import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { LogIn, User, Lock, GraduationCap, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useSnack } from '../context/SnackProvider';

const Login = () => {
  const { login, isDarkMode, toggleTheme } = useSchool();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { showSnack } = useSnack();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {


    setTimeout(async () => {
      const result = await login(values.username, values.password);
      if (result.success) {
        navigate('/');
        showSnack({ message: result.message });
      } else {
        showSnack({ type: 'error', message: result.message });
      }
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      <div className="fixed top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-xl transition-all shadow-lg ${
            isDarkMode
              ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400'
              : 'bg-white hover:bg-slate-50 text-slate-700'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            School Information System
          </h1>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
            Sign in to access your account
          </p>
        </div>

        <div className={`rounded-2xl shadow-xl border p-8 ${
          isDarkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="username" className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    </div>
                    <Field
                      id="username"
                      name="username"
                      type="text"
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.username && touched.username
                          ? isDarkMode
                            ? 'border-red-700 bg-red-900/20 text-white'
                            : 'border-red-300 bg-red-50'
                          : isDarkMode
                            ? 'border-slate-600 bg-slate-700 text-white'
                            : 'border-slate-300 bg-white'
                      }`}
                      placeholder="Enter your username"
                    />
                  </div>
                  <ErrorMessage name="username" component="div" className={`mt-1.5 text-sm ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} />
                </div>

                <div>
                  <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.password && touched.password
                          ? isDarkMode
                            ? 'border-red-700 bg-red-900/20 text-white'
                            : 'border-red-300 bg-red-50'
                          : isDarkMode
                            ? 'border-slate-600 bg-slate-700 text-white'
                            : 'border-slate-300 bg-white'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
                        isDarkMode
                          ? 'text-slate-500 hover:text-slate-300'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className={`mt-1.5 text-sm ${
                    isDarkMode ? 'text-red-400' : 'text-red-600'
                  }`} />
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <p className="mb-1">• Username must be at least 3 characters</p>
                  <p className="mb-1">• Password must be at least 6 characters</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        <p className={`text-center text-sm mt-6 mb-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
          © 2025 School Information System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
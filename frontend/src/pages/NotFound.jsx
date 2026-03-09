import { Link } from 'react-router-dom';
import { useSchool } from '../context/SchoolContext';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const { isDarkMode } = useSchool();

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      isDarkMode ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      <div className="text-center">
        <div className="relative">
          <h1 className={`text-9xl font-bold ${
            isDarkMode ? 'text-slate-800' : 'text-slate-200'
          }`}>
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className={`h-24 w-24 ${
              isDarkMode ? 'text-slate-600' : 'text-slate-400'
            }`} />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Page Not Found
          </h2>
          <p className={`text-lg ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className={`text-sm ${
            isDarkMode ? 'text-slate-500' : 'text-slate-500'
          }`}>
            It might have been moved or deleted.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors shadow-sm ${
              isDarkMode
                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>

        <div className="mt-16 flex items-center justify-center gap-2">
          <div className={`h-1 w-16 rounded-full ${
            isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
          }`} />
          <div className={`h-1 w-1 rounded-full ${
            isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
          }`} />
          <div className={`h-1 w-1 rounded-full ${
            isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
          }`} />
          <div className={`h-1 w-1 rounded-full ${
            isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
          }`} />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
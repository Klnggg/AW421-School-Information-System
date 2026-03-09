import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useSchool } from '../context/SchoolContext';
import { GraduationCap, Sun, Moon, LogOut, User, Menu, X, ChevronDown, LayoutDashboard, Palette } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isDarkMode, toggleTheme } = useSchool();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const allLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/students', label: 'Students' },
    { path: '/teachers', label: 'Teachers', adminOnly: true },
    { path: '/courses', label: 'Courses', adminOnly: true },
    { path: '/grades', label: 'Grades' },
  ];

  const navLinks = allLinks.filter(link => {
    if (link.adminOnly && currentUser?.role !== 'admin') {
      return false;
    }
    return true;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      {/* Navigation Bar */}
      <nav className={`border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  School System
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? isDarkMode
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100 text-slate-900'
                      : isDarkMode
                        ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side Actions - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  <User className={`h-4 w-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {currentUser?.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    currentUser?.role === 'admin'
                      ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                      : isDarkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {currentUser?.role}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  } ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </button>

                {isUserMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-50 ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-slate-200'
                  }`}>
                    <div className="py-1">
                      <Link
                        to="/"
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isDarkMode
                            ? 'text-slate-200 hover:bg-slate-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>

                      <button
                        onClick={() => {
                          toggleTheme();
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isDarkMode
                            ? 'text-slate-200 hover:bg-slate-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Palette className="h-4 w-4" />
                        <span>Change Theme</span>
                        <span className={`ml-auto text-xs px-2 py-0.5 rounded ${
                          isDarkMode
                            ? 'bg-slate-700 text-slate-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isDarkMode ? 'Dark' : 'Light'}
                        </span>
                      </button>

                      <div className={`my-1 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} />

                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          isDarkMode
                            ? 'text-red-400 hover:bg-red-900/20'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? isDarkMode
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100 text-slate-900'
                      : isDarkMode
                        ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className={`flex items-center gap-2 px-4 py-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <User className={`h-4 w-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  {currentUser?.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  currentUser?.role === 'admin'
                    ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                    : isDarkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {currentUser?.role}
                </span>
              </div>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-red-900 text-red-200 hover:bg-red-800'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
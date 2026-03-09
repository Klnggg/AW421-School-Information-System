import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { SnackProvider } from './context/SnackProvider';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Courses from './pages/Courses';
import Grades from './pages/Grades';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, currentUser } = useSchool();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && currentUser?.role !== 'admin') {
    return <Navigate to="/NotFound" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSchool();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  const { isDarkMode } = useSchool();

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={
              <ProtectedRoute requireAdmin={true}>
                <Teachers />
              </ProtectedRoute>
            } />
            <Route path="courses" element={
              <ProtectedRoute requireAdmin={true}>
                <Courses />
              </ProtectedRoute>
            } />
            <Route path="grades" element={<Grades />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <SchoolProvider>
      <SnackProvider>
        <AppRoutes />
      </SnackProvider>
    </SchoolProvider>
  );
}

export default App;

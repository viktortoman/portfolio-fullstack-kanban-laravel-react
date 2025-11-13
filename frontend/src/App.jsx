import { Routes, Route } from 'react-router-dom';

// 1. Import the new page
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage'; // <-- ADD THIS IMPORT
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- Private Routes --- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* --- 404 Catch-All Route --- */}
      {/* This route MUST be the last one */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}

export default App;
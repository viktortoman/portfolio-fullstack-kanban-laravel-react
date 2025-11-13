// File: frontend/src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import our "brain"

const ProtectedRoute = ({ children }) => {
  // Get the user state AND the loading state
  const { user, isLoading } = useAuth();

  // --- NEW LOGIC ---
  // 1. If we are still checking the token, show a loading message
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  // 2. If loading is done AND the user is still not logged in...
  if (!user) {
    // ...redirect them to the /login page.
    return <Navigate to="/login" />;
  }

  // 3. If loading is done AND user exists, show the page
  return children;
};

export default ProtectedRoute;
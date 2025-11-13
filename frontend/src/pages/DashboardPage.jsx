import { useAuth } from '../context/AuthContext'; // Import our "brain"

export default function DashboardPage() {
  // Get the user data and logout function from the "brain"
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Display user's name if available */}
      {user && <h2>Welcome, {user.name}!</h2>}

      {/* Add a logout button */}
      <button onClick={logout}>Logout</button>

      {/* The Kanban boards and tasks will be built here */}
    </div>
  );
}
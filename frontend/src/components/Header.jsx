import {useAuth} from '../context/AuthContext';
import {Link} from 'react-router-dom';

export default function Header() {
  const {user, logout} = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              TaskFlow
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                  Welcome, {user.name}
              </span>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import Header from '../components/Header';

export default function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] =useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await apiClient.get('/boards');
        setBoards(response.data);
      } catch (err) {
        console.error("Failed to fetch boards:", err);
        setError('Failed to load your boards. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoards();
  }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    setIsCreating(true);
    setFormError(null);

    try {
      const response = await apiClient.post('/boards', { name: newBoardName });
      setBoards([...boards, response.data]);
      setNewBoardName('');
    } catch (err) {
      console.error("Failed to create board:", err);

      if (err.response && err.response.status === 422) {
        setFormError(err.response.data.errors.name[0]);
      } else {
        setFormError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <form onSubmit={handleCreateBoard} className="flex space-x-4">
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Enter new board name..."
              disabled={isCreating}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-75 disabled:bg-indigo-400"
            >
              {isCreating ? 'Creating...' : 'Create Board'}
            </button>
          </form>

          {formError && (
            <p className="mt-3 text-sm text-center text-red-600">
              {formError}
            </p>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Boards</h2>

        {isLoading ? (
          <p>Loading boards...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {boards.length > 0 ? (
              boards.map((board) => (
                <Link
                  to={`/board/${board.id}`}
                  key={board.id}
                  className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold text-lg text-gray-900">{board.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Click to view tasks
                  </p>
                </Link>
              ))
            ) : (
              <p>You don't have any boards yet. Create one above!</p>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
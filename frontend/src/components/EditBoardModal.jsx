import { useState, useEffect } from 'react';

export default function EditBoardModal({ board, isOpen, onClose, onBoardUpdated, isUpdating }) {
  if (!isOpen || !board) return null;

  const [name, setName] = useState(board.name);

  useEffect(() => {
    setName(board.name);
  }, [board]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onBoardUpdated(name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Board</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="board-name" className="block text-sm font-medium text-gray-700">
              Board Name
            </label>
            <input
              id="board-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
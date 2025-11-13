import {useState} from 'react';

export default function AddTaskForm({status, onSubmit, onCancel, isCreating, error}) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title, status);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-1 space-y-2">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this card..."
              autoFocus
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows="3"
            />
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      <div className="flex items-center space-x-2">
        <button
          type="submit"
          disabled={isCreating}
          className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-75 disabled:bg-indigo-400"
        >
          {isCreating ? 'Adding...' : 'Add card'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
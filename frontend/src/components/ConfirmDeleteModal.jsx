export default function ConfirmDeleteModal({
                                             isOpen,
                                             onClose,
                                             onConfirm,
                                             isDeleting,
                                             title,
                                             message
                                           }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800">
          {title || 'Confirm Deletion'}
        </h2>

        <p className="text-gray-600 mt-4">
          {message || 'Are you sure? This action cannot be undone.'}
        </p>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
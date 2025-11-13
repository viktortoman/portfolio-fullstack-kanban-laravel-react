import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskCard({ task, onDelete, onClick }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      sourceStatus: task.status
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-200 p-3.5 rounded-lg border-2 border-dashed border-slate-400"
      >
        <h4 className="font-medium text-transparent">{task.title}</h4>
        {task.description && (
          <p className="text-sm text-transparent mt-2">{task.description}</p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="group relative bg-white p-3.5 rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 transition-shadow cursor-grab"
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 rounded-full bg-transparent text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 transition-all"
        aria-label="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h4 className="font-medium text-gray-800 pr-4">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-gray-600 mt-2 truncate">{task.description}</p>
      )}
    </div>
  );
}
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

export default function BoardColumn({
                                      id,
                                      title,
                                      tasks,
                                      onEditTask,
                                      onDeleteTask,
                                      isAddingTask,
                                      onAddTaskClick,
                                      onAddTaskSubmit,
                                      onAddTaskCancel,
                                      isCreatingTask,
                                      createTaskError
                                    }) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'Column'
    }
  });
  const taskIds = tasks.map(task => task.id);

  return (
    <div className="flex flex-col flex-shrink-0 w-80">
      <div className="flex items-center justify-between p-4 bg-slate-100 rounded-t-xl border-b-2 border-slate-200">
        <h3 className="text-lg font-bold text-gray-700 tracking-wide">
          {title}
        </h3>
        <span className="text-sm font-semibold text-gray-500">
                    {tasks.length}
                </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-grow p-4 bg-slate-100 rounded-b-xl border border-t-0 border-slate-200 overflow-y-auto"
      >
        <SortableContext
          items={taskIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3 min-h-[50px]">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={() => onDeleteTask(task)}
                onClick={() => onEditTask(task)}
              />
            ))}
          </div>
        </SortableContext>

        <div className="mt-4">
          {isAddingTask ? (
            <AddTaskForm
              status={id}
              onSubmit={onAddTaskSubmit}
              onCancel={onAddTaskCancel}
              isCreating={isCreatingTask}
              error={createTaskError}
            />
          ) : (
            <button
              onClick={onAddTaskClick}
              className="w-full p-2.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-200"
            >
              + Add a card
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
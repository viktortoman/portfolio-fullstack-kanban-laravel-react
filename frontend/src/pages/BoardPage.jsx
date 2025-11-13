import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import BoardColumn from '../components/BoardColumn';
import EditTaskModal from '../components/EditTaskModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import EditBoardModal from '../components/EditBoardModal';
import TaskCard from '../components/TaskCard';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';

import { useBoardLoader } from '../hooks/useBoardLoader';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { useBoardDnd } from '../hooks/useBoardDnd';
import { useBoardMutations } from '../hooks/useBoardMutations';

export default function BoardPage() {
  const { boardId } = useParams();

  const { board, setBoard, columns, setColumns, isLoading, error } = useBoardLoader(boardId);

  const {
    activeTask,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useBoardDnd(columns, setColumns);

  const {
    isCreatingTask,
    createTaskError,
    setCreateTaskError,
    handleCreateTask,
    isDeleting: isDeletingTask,
    confirmDeleteTask,
    handleTaskUpdated
  } = useTaskMutations(boardId, setColumns);

  const {
    isUpdating: isUpdatingBoard,
    isDeleting: isDeletingBoard,
    handleUpdateBoard,
    handleDeleteBoard
  } = useBoardMutations(boardId, setBoard);

  const [addingTaskTo, setAddingTaskTo] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [isEditingBoard, setIsEditingBoard] = useState(false);
  const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);

  const onConfirmTaskDelete = async () => {
    const success = await confirmDeleteTask(taskToDelete);
    if (success) {
      setTaskToDelete(null);
    }
  };

  const onConfirmBoardDelete = async () => {
    const success = await handleDeleteBoard();
    if (success) {
      setIsDeleteBoardModalOpen(false);
    }
  };

  const onCreateTask = async (title, status) => {
    const success = await handleCreateTask(title, status);
    if (success) {
      setAddingTaskTo(null);
    }
  };

  const onTaskUpdated = (updatedTask) => {
    handleTaskUpdated(updatedTask);
    setEditingTask(null);
  };

  const onBoardUpdated = async (name) => {
    const updatedBoard = await handleUpdateBoard(name);
    if (updatedBoard) {
      setIsEditingBoard(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-8 text-center">Loading board...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-8 text-center text-red-500">
          <p>{error}</p>
          <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!board) return null;

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <div className="flex-grow flex flex-col p-4 sm:p-8">

        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {board.name}
            </h1>
            <button
              onClick={() => setIsEditingBoard(true)}
              className="p-1 text-gray-500 hover:text-gray-800"
              title="Edit board name"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => setIsDeleteBoardModalOpen(true)}
              className="p-1 text-gray-500 hover:text-red-600"
              title="Delete board"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <Link
            to="/"
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to all boards
          </Link>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-grow flex space-x-6 overflow-x-auto pb-4 p-4 bg-gray-100 rounded-xl">
            {Object.entries(columns).map(([status, column]) => (
              <BoardColumn
                key={status}
                id={status}
                title={column.title}
                tasks={column.tasks}
                onDeleteTask={(task) => setTaskToDelete(task)}
                onEditTask={(task) => setEditingTask(task)}
                isAddingTask={addingTaskTo === status}
                onAddTaskClick={() => { setAddingTaskTo(status); setCreateTaskError(null); }}
                onAddTaskCancel={() => setAddingTaskTo(null)}
                onAddTaskSubmit={onCreateTask}
                isCreatingTask={isCreatingTask && addingTaskTo === status}
                createTaskError={addingTaskTo === status ? createTaskError : null}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} />
            ) : null}
          </DragOverlay>

        </DndContext>
      </div>

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onTaskUpdated={onTaskUpdated}
      />

      <EditBoardModal
        board={board}
        isOpen={isEditingBoard}
        onClose={() => setIsEditingBoard(false)}
        onBoardUpdated={onBoardUpdated}
        isUpdating={isUpdatingBoard}
      />

      <ConfirmDeleteModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={onConfirmTaskDelete}
        isDeleting={isDeletingTask}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
      />

      <ConfirmDeleteModal
        isOpen={isDeleteBoardModalOpen}
        onClose={() => setIsDeleteBoardModalOpen(false)}
        onConfirm={onConfirmBoardDelete}
        isDeleting={isDeletingBoard}
        title="Delete Board"
        message={`Are you sure you want to delete the "${board.name}" board? All tasks will be permanently lost.`}
      />
    </div>
  );
}
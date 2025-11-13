import { useState } from 'react';
import apiClient from '../api/axios';

export function useTaskMutations(boardId, setColumns) {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [createTaskError, setCreateTaskError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateTask = async (title, status) => {
    if (isCreatingTask) return false;
    setIsCreatingTask(true);
    setCreateTaskError(null);
    try {
      const response = await apiClient.post(`/boards/${boardId}/tasks`, {
        title,
        status
      });
      const newTask = response.data;
      setColumns(prevColumns => {
        const newColTasks = [...prevColumns[status].tasks, newTask];
        return {
          ...prevColumns,
          [status]: { ...prevColumns[status], tasks: newColTasks }
        };
      });
      return true;
    } catch (err) {
      console.error("Failed to create task:", err);
      if (err.response && err.response.status === 422) {
        setCreateTaskError(err.response.data.errors.title[0]);
      } else {
        setCreateTaskError('An error occurred. Please try again.');
      }
      return false;
    } finally {
      setIsCreatingTask(false);
    }
  };

  const confirmDeleteTask = async (taskToDelete) => {
    if (!taskToDelete || isDeleting) return false;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/tasks/${taskToDelete.id}`);
      setColumns(prevColumns => {
        const newColTasks = prevColumns[taskToDelete.status].tasks
          .filter(task => task.id !== taskToDelete.id);
        return {
          ...prevColumns,
          [taskToDelete.status]: { ...prevColumns[taskToDelete.status], tasks: newColTasks }
        };
      });
      return true;
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert('Failed to delete task.');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setColumns(prevColumns => {
      const tasksInCol = prevColumns[updatedTask.status]?.tasks || [];
      const taskExists = tasksInCol.find(t => t.id === updatedTask.id);

      let newColumns = { ...prevColumns };

      if (!taskExists) {
        for (const colStatus in newColumns) {
          newColumns[colStatus] = {
            ...newColumns[colStatus],
            tasks: newColumns[colStatus].tasks.filter(t => t.id !== updatedTask.id)
          };
        }
        newColumns[updatedTask.status] = {
          ...newColumns[updatedTask.status],
          tasks: [...newColumns[updatedTask.status].tasks, updatedTask]
        };
      } else {
        newColumns[updatedTask.status] = {
          ...newColumns[updatedTask.status],
          tasks: newColumns[updatedTask.status].tasks.map(
            task => task.id === updatedTask.id ? updatedTask : task
          )
        };
      }

      return newColumns;
    });
  };

  return {
    isCreatingTask,
    createTaskError,
    setCreateTaskError,
    handleCreateTask,
    isDeleting,
    confirmDeleteTask,
    handleTaskUpdated
  };
}
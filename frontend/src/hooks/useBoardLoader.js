import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { TaskStatus } from '../Enums';

const initialColumns = {
  [TaskStatus.TODO]: { title: 'Todo', tasks: [] },
  [TaskStatus.IN_PROGRESS]: { title: 'In Progress', tasks: [] },
  [TaskStatus.DONE]: { title: 'Done', tasks: [] }
};

export function useBoardLoader(boardId) {
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState(initialColumns);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardData = async () => {
      setIsLoading(true);
      try {
        const [boardResponse, tasksResponse] = await Promise.all([
          apiClient.get(`/boards/${boardId}`),
          apiClient.get(`/boards/${boardId}/tasks`)
        ]);

        setBoard(boardResponse.data);

        const newColumns = { ...initialColumns };
        const tasks = tasksResponse.data;

        newColumns[TaskStatus.TODO].tasks = tasks
          .filter(t => t.status === TaskStatus.TODO)
          .sort((a, b) => a.order - b.order);
        newColumns[TaskStatus.IN_PROGRESS].tasks = tasks
          .filter(t => t.status === TaskStatus.IN_PROGRESS)
          .sort((a, b) => a.order - b.order);
        newColumns[TaskStatus.DONE].tasks = tasks
          .filter(t => t.status === TaskStatus.DONE)
          .sort((a, b) => a.order - b.order);

        setColumns(newColumns);
        setError(null);

      } catch (err) {
        console.error("Failed to fetch board data:", err);
        setError('Failed to load board. You may not have permission to view it.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoardData();
  }, [boardId]);

  return { board, setBoard, columns, setColumns, isLoading, error };
}
import { useState } from 'react';
import apiClient from '../api/axios';
import { useNavigate } from 'react-router-dom';

export function useBoardMutations(boardId, setBoard) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUpdateBoard = async (name) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await apiClient.put(`/boards/${boardId}`, { name });
      setBoard(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to update board:", err);
      setError('Failed to update board.');
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteBoard = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await apiClient.delete(`/boards/${boardId}`);
      navigate('/');
      return true;
    } catch (err) {
      console.error("Failed to delete board:", err);
      setError('Failed to delete board.');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isUpdating,
    isDeleting,
    error,
    handleUpdateBoard,
    handleDeleteBoard
  };
}
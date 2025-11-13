import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';

export function useBoardDnd(columns, setColumns) {
  const [activeTask, setActiveTask] = useState(null);
  const [sourceColumn, setSourceColumn] = useState(null);

  const findColumn = (taskId) => {
    if (!taskId) return null;
    for (const [status, column] of Object.entries(columns)) {
      if (column.tasks.find(task => task.id === taskId)) {
        return status;
      }
    }
    return null;
  };

  const findTask = (id) => {
    for (const status of Object.keys(columns)) {
      const task = columns[status].tasks.find(t => t.id === id);
      if (task) {
        return task;
      }
    }
    return null;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = findTask(active.id);
    setActiveTask(task);
    setSourceColumn(task.status);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || !active) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    if (!isActiveATask) return;

    const overColumnId = over.data.current?.type === 'Column'
      ? over.id
      : findColumn(overId);

    const activeColumnId = findColumn(activeId);

    if (!overColumnId || !activeColumnId) return;

    if (activeColumnId === overColumnId) {
      setColumns(prev => {
        const colTasks = prev[activeColumnId].tasks;
        const oldIndex = colTasks.findIndex(t => t.id === activeId);
        const newIndex = colTasks.findIndex(t => t.id === overId);
        if (oldIndex === newIndex || newIndex === -1) return prev;

        return {
          ...prev,
          [activeColumnId]: { ...prev[activeColumnId], tasks: arrayMove(colTasks, oldIndex, newIndex) }
        };
      });
    } else {
      const overIsTask = over.data.current?.type === 'Task';
      setColumns(prev => {
        const sourceTasks = [...prev[activeColumnId].tasks];
        const activeTaskIndex = sourceTasks.findIndex(t => t.id === activeId);
        const [movedTask] = sourceTasks.splice(activeTaskIndex, 1);

        const destTasks = [...prev[overColumnId].tasks];
        const overTaskIndex = overIsTask ? destTasks.findIndex(t => t.id === overId) : destTasks.length;

        destTasks.splice(overTaskIndex, 0, { ...movedTask, status: overColumnId });

        return {
          ...prev,
          [activeColumnId]: { ...prev[activeColumnId], tasks: sourceTasks },
          [overColumnId]: { ...prev[overColumnId], tasks: destTasks }
        };
      });
    }
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    setSourceColumn(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const destColumnId = findColumn(activeId);
    if (!destColumnId) return;

    const finalTasksInColumn = columns[destColumnId].tasks;
    const taskIds = finalTasksInColumn.map(t => t.id);

    apiClient.post('/tasks/reorder', {
      status: destColumnId,
      taskIds: taskIds
    }).catch(err => {
      console.error("Failed to reorder dest tasks:", err);
    });

    if (sourceColumn && sourceColumn !== destColumnId) {
      const sourceTasks = columns[sourceColumn].tasks;
      const sourceTaskIds = sourceTasks.map(t => t.id);

      apiClient.post('/tasks/reorder', {
        status: sourceColumn,
        taskIds: sourceTaskIds
      }).catch(err => {
        console.error("Failed to reorder source tasks:", err);
      });
    }
  };

  return { activeTask, sensors, handleDragStart, handleDragOver, handleDragEnd };
}
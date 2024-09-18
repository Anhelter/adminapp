// src/components/TasksPanel.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TasksPanel = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (err) {
        console.error('Error al obtener las tareas:', err);
      }
    };

    fetchTasks();
  }, [token]);

  const handleCompleteTask = async (taskId) => {
    try {
      await axios.post(
        `/api/tasks/${taskId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Error al completar la tarea:', err);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Tareas Pendientes</h3>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-2 bg-gray-100 rounded flex justify-between items-center">
            <p className="text-sm text-gray-800">{task.title}</p>
            <button
              onClick={() => handleCompleteTask(task.id)}
              className="text-green-500 hover:text-green-700"
            >
              Completar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPanel;

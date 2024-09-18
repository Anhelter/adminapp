// src/components/NotificationsPanel.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data);
      } catch (err) {
        console.error('Error al obtener las notificaciones:', err);
      }
    };

    fetchNotifications();
  }, [token]);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Notificaciones</h3>
      <ul className="space-y-2">
        {notifications.map((notification) => (
          <li key={notification.id} className="p-2 bg-gray-100 rounded">
            <p className="text-sm text-gray-800">{notification.message}</p>
            <p className="text-xs text-gray-500">{notification.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;

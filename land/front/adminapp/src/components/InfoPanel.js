// src/components/InfoPanel.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InfoPanel = () => {
  const [stats, setStats] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (err) {
        console.error('Error al obtener las estadísticas:', err);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Información Rápida</h3>
      <div className="space-y-4">
        <div className="p-4 bg-blue-100 rounded">
          <p className="text-sm text-gray-600">Clientes Totales</p>
          <p className="text-xl font-semibold text-gray-800">{stats.totalClients || 0}</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <p className="text-sm text-gray-600">Instancias Activas</p>
          <p className="text-xl font-semibold text-gray-800">{stats.activeInstances || 0}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <p className="text-sm text-gray-600">Tareas Pendientes</p>
          <p className="text-xl font-semibold text-gray-800">{stats.pendingTasks || 0}</p>
        </div>
        {/* Agrega más widgets según sea necesario */}
      </div>
    </div>
  );
};

export default InfoPanel;

// src/components/Clients.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data);
      } catch (err) {
        console.error('Error al obtener los clientes:', err);
      }
    };

    fetchClients();
  }, [token]);

  return (
    <div className= "text-white">
      <h2 className="text-xl font-bold mb-4">Lista de Clientes</h2>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre de Empresa</th>
            <th className="px-4 py-2">Número de Instancia</th>
            <th className="px-4 py-2">ID de Empresa</th>
            {/* Agrega más columnas si es necesario */}
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="border px-4 py-2">{client.company_name}</td>
              <td className="border px-4 py-2">{client.instance_number}</td>
              <td className="border px-4 py-2">{client.company_id}</td>
              {/* Agrega más celdas si es necesario */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clients;

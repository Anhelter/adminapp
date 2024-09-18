import React, { useState } from 'react';
import axios from 'axios';

const ConsolidationForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [instanceNumber, setInstanceNumber] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/validate-company',
        {
          companyName,
          instanceNumber,
          companyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setMessage('Empresa no existe');
      } else {
        setMessage('Error al validar la empresa');
      }
    }
  };

  return (
    <div className= "text-white">
      <h2 className="text-xl font-bold mb-4">Consolidación</h2>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white ">Nombre de Empresa</label>
          <input
            type="text"
            className="mt-2 p-2 border rounded w-full sm:w-80 bg-gray-700"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Número de Instancia</label>
          <input
            type="number"
            className="mt-2 p-2 border rounded w-full sm:w-80 bg-gray-700"
            value={instanceNumber}
            onChange={(e) => setInstanceNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-white">ID de Empresa</label>
          <input
            type="text"
            className="mt-2 p-2 border rounded w-full sm:w-80 bg-gray-700"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-800 text-white p-2 rounded hover:bg-blue-900"
        >
          Validar y Ejecutar Script
        </button>
      </form>
    </div>
  );
};

export default ConsolidationForm;

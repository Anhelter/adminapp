// src/components/Register.js

import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/register',
        { username, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Usuario registrado exitosamente');
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage('Error al registrar el usuario');
    }
  };

  return (
    <div>
      <h2 className="text-xl text-white font-bold mb-4">Registro de Usuario</h2>
      {message && <div className="mb-4 text-green-500">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white">Nombre de Usuario</label>
          <input
            type="text"
            className="text-white mt-2 p-2 border rounded w-full sm:w-80 bg-gray-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-white">Contraseña</label>
          <input
            type="password"
            className="text-white mt-2 p-2 border rounded w-full sm:w-80 bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-800 text-white p-2 rounded hover:bg-blue-900"
        >
          Registrar Usuario
        </button>
      </form>
    </div>
  );
};

export default Register;

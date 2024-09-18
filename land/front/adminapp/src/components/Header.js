// src/components/Header.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-yellow-400 shadow flex items-center justify-between px-6 py-3">
      <div>
        <Link to="/" className="text-xl font-bold text-gray-800">
          ERPAPP
        </Link>
      </div>

      <div>
        {token ? (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 focus:outline-none"
          >
            Cerrar Sesión
          </button>
        ) : (
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;

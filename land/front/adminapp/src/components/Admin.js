import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ConsolidationForm from './ConsolidationForm';
import Register from './Register';
import Clients from './Clients';
import RegisterClient from './RegisterClient'; 
import Header from './Header';
import InfoPanel from './InfoPanel';
import RightPanel from './RightPanel';



const Admin = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Agrega el Header aquí */}
      <Header />
    <div className="flex flex-grow">
      {/* Menú lateral */}
      <aside className="w-64 bg-gray-900 text-white">
        <nav className="mt-10">
          <ul>
            <li className="bg-gray-900">
              <Link to="/admin/consolidation" className="block px-4 py-2 hover:bg-gray-700">
                Consolidación
              </Link>
            </li>
            <li className="bg-gray-900">
              <Link to="/admin/register" className="block px-4 py-2 hover:bg-gray-700">
                Registro
              </Link>
            </li>
            <li className="bg-gray-900">
              <Link to="/admin/register-client" className="block px-4 py-2 hover:bg-gray-700">
                Registrar Cliente
              </Link>
            </li>
            <li className="bg-gray-900">
              <Link to="/admin/master" className="block px-4 py-2 hover:bg-gray-700">
                Clientes
              </Link>
            </li>
            {/* Puedes agregar más opciones aquí */}
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      
      <main className="flex-grow bg-gray-800 p-8">
        <Routes>
          <Route path="/consolidation" element={<ConsolidationForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-client" element={<RegisterClient />} />
          <Route path="/master" element={<Clients />} />
          {/* Agrega más rutas si es necesario */}
        </Routes>
      </main>

      {/* Panel derecho */}
    <aside className="sm:w-90 bg-gray-700 p-4 shadow-inner text-white">
      {/* Aquí irá el contenido del panel derecho */}
      <RightPanel />
    </aside>
  
    </div>
  </div>
  );
};

export default Admin;

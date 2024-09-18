import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Encabezado */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            <h1>ERPAPP</h1>
          </div>
          <div className="space-x-8">
            <Link to="/aplicaciones" className="text-gray-600 hover:text-gray-900">Aplicaciones</Link>
            <Link to="/comunidad" className="text-gray-600 hover:text-gray-900">Comunidad</Link>
            <Link to="/precios" className="text-gray-600 hover:text-gray-900">Precios</Link>
            <Link to="/contacto" className="text-gray-600 hover:text-gray-900">Contacto</Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-900">Identificarse</Link>
            <Link to="/signup" className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md">
              Prueba Gratis
            </Link>
          </div>
        </nav>
      </header>

      {/* Contenido principal */}
      <main className="bg-yellow-500 flex-grow">
        <section className="bg-purple-900 py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-50 mb-4">
              Todo tu negocio en una sola plataforma.
            </h2>
            <p className="text-xl text-gray-50 mb-8">
              ¡Sencillo, eficiente y a buen precio!
            </p>
            <div className="space-x-4">
              <Link to="/signup" className="bg-purple-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-purple-700">
                Empieza ahora - Es gratis
              </Link>
              <Link to="/demo" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md shadow-md hover:bg-gray-300">
                Programar una demostración
              </Link>
            </div>
            <p className="text-gray-300 mt-4">US$ 7.25 / al mes por TODAS las aplicaciones</p>
          </div>
        </section>

       {/* Sección de módulos */}
<section className="container mx-auto py-16">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center">
    {/* Módulos */}
    <div className="p-4 bg-gray-700 shadow-md rounded-md">
      <img src="/icons/accounting.svg" alt="Contabilidad" className="w-28 h-28 mx-auto mb-4" />
      <p className="text-white">Contabilidad</p>
    </div>
    <div className="p-4 bg-gray-700 shadow-md rounded-md">
      <img src="/icons/crm.svg" alt="CRM" className="w-28 h-28 mx-auto mb-4" />
      <p className="text-white">CRM</p>
    </div>
    <div className="p-4 bg-gray-700 shadow-md rounded-md">
      <img src="/icons/hr.svg" alt="RRHH" className="w-28 h-28 mx-auto mb-4" />
      <p className="text-white">RRHH</p>
    </div>
    <div className="p-4 bg-gray-700 shadow-md rounded-md">
      <img src="/icons/project.svg" alt="Proyectos" className="w-28 h-28 mx-auto mb-4" />
      <p className="text-white">Proyectos</p>
    </div>
    <div className="p-4 bg-gray-700 shadow-md rounded-md">
      <img src="/icons/inventory.svg" alt="Inventario" className="w-28 h-28 mx-auto mb-4" />
      <p className="text-white">Inventario</p>
    </div>
    <div className="p-4 bg-gray-700 shadow-md rounded-md">
      <img src="/icons/sales.svg" alt="Ventas" className="w-28 h-28 mx-auto mb-4" />
      <p className="text-white">Ventas</p>
    </div>
    <div className="p-4 bg-gray-700 shadow-md rounded-md">
      <img src="/icons/purchase.svg" alt="Compras" className="w-28 h-28 mx-auto mb-4" />
      <p className="text-white">Compras</p>
    </div>
    <div className="p-4 bg-gray-700 shadow-md rounded-md">
      <img src="/icons/marketing.svg" alt="Marketing" className="w-28 h-28 mx-auto mb-4" />
      <p className="text-white">Marketing</p>
    </div>
  </div>
</section>

      </main>

      {/* Pie de página */}
      <footer className="bg-gray-900 py-6">
        <div className="container mx-auto text-center text-gray-100">
          © 2024 ERPAPP
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

// src/components/Layout/AdminLayout.jsx
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');
  
  const handleLogout = () => {
    logout();
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Panel Administrativo</h1>
            <div className="flex items-center space-x-4">
              {email && (
                <span className="text-sm text-gray-600">
                  Bienvenido, {email}
                </span>
              )}
              <button 
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

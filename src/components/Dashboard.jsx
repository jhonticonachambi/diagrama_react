// src/components/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const email = localStorage.getItem('userEmail');
  
  // Estados para estadísticas
  const [stats, setStats] = useState({
    proyectos: 0,
    usuarios: 15,  // Estático por ahora
    diagramas: 25, // Estático por ahora
    colaboraciones: 8 // Estático por ahora
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);

  // Recuperar estadísticas cuando el componente se monta
  useEffect(() => {
    fetchStatistics();
  }, [token]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener la cantidad de proyectos
      const projectsResponse = await axios.get(
        'http://127.0.0.1:8000/api/proyectos', 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      let projectsData = projectsResponse.data;
      
      // Manejar diferentes formatos de respuesta
      if (projectsResponse.data && projectsResponse.data.proyectos) {
        projectsData = projectsResponse.data.proyectos;
      }
      
      if (projectsData && !Array.isArray(projectsData) && typeof projectsData === 'object') {
        projectsData = Object.values(projectsData);
      }
      
      const projectCount = Array.isArray(projectsData) ? projectsData.length : 0;
      
      // Guardar los proyectos más recientes (máximo 5)
      const sortedProjects = Array.isArray(projectsData) 
        ? projectsData
            .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
            .slice(0, 5) 
        : [];
            
      setRecentProjects(sortedProjects);
      
      // Actualizar estadísticas
      setStats(prev => ({
        ...prev,
        proyectos: projectCount
      }));
      
      // En el futuro, aquí se podrían agregar más llamadas a la API para obtener
      // estadísticas reales de usuarios, diagramas y colaboraciones
      
    } catch (err) {
      console.error("Error al obtener estadísticas:", err);
      setError("No se pudieron cargar las estadísticas. Por favor, intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar una tarjeta de estadística
  const StatCard = ({ title, value, icon, color, linkTo }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-t-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border', 'bg')} bg-opacity-20`}>
          {icon}
        </div>
      </div>
      {linkTo && (
        <div className="mt-4">
          <Link to={linkTo} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            Ver detalles →
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Panel de Control</h2>
        <button 
          onClick={fetchStatistics} 
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {loading ? 'Cargando...' : 'Actualizar datos'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Proyectos" 
          value={loading ? "..." : stats.proyectos} 
          icon={<svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>} 
          color="border-blue-500" 
          linkTo="/admin/diagrama"
        />
        
        <StatCard 
          title="Diagramas" 
          value={stats.diagramas} 
          icon={<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>} 
          color="border-green-500" 
          linkTo="/admin/diagrama"
        />
        
        <StatCard 
          title="Usuarios" 
          value={stats.usuarios} 
          icon={<svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>} 
          color="border-purple-500" 
          linkTo="#"
        />
        
        <StatCard 
          title="Colaboraciones" 
          value={stats.colaboraciones} 
          icon={<svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>} 
          color="border-orange-500" 
          linkTo="/admin/colaboracion"
        />
      </div>
      
      {/* Proyectos recientes y actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Proyectos recientes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Proyectos Recientes</h3>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : recentProjects.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentProjects.map((project) => (
                <li key={project.id} className="py-3">
                  <Link 
                    to={`/admin/diagrama?project=${project.id}`} 
                    className="flex items-center justify-between hover:bg-gray-50 px-2 py-1 rounded"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{project.nombre || "Proyecto sin nombre"}</p>
                      <p className="text-sm text-gray-500">
                        {project.created_at 
                          ? `Creado: ${new Date(project.created_at).toLocaleDateString()}` 
                          : "Fecha no disponible"}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 py-4">No hay proyectos recientes.</p>
          )}
          
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link to="/admin/diagrama" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Ver todos los proyectos →
            </Link>
          </div>
        </div>
        
        {/* Actividad reciente */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Actividad Reciente</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full mr-3"></span>
              <div>
                <p className="text-gray-800">Se creó un nuevo diagrama de clases</p>
                <p className="text-xs text-gray-500 mt-1">Hace 2 horas</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full mr-3"></span>
              <div>
                <p className="text-gray-800">Se compartió el proyecto "Sistema de Ventas"</p>
                <p className="text-xs text-gray-500 mt-1">Ayer</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 mt-2 bg-yellow-500 rounded-full mr-3"></span>
              <div>
                <p className="text-gray-800">Se modificó el diagrama "Arquitectura"</p>
                <p className="text-xs text-gray-500 mt-1">Hace 3 días</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 mt-2 bg-purple-500 rounded-full mr-3"></span>
              <div>
                <p className="text-gray-800">Se agregó un nuevo colaborador al proyecto</p>
                <p className="text-xs text-gray-500 mt-1">Hace 5 días</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 mt-2 bg-red-500 rounded-full mr-3"></span>
              <div>
                <p className="text-gray-800">Se eliminó un diagrama obsoleto</p>
                <p className="text-xs text-gray-500 mt-1">Hace 1 semana</p>
              </div>
            </li>
          </ul>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link to="/admin/historia" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Ver todo el historial →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Sección de Colaboraciones */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Colaboraciones Activas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 p-4 rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Sistema de Gestión</h4>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Activo</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Colaborando con 3 usuarios</p>
            <div className="flex">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center -ml-0">JD</span>
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center -ml-1">RK</span>
              <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center -ml-1">MS</span>
            </div>
          </div>
          
          <div className="border border-gray-200 p-4 rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Análisis de Requisitos</h4>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Activo</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Colaborando con 2 usuarios</p>
            <div className="flex">
              <span className="w-6 h-6 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center -ml-0">LT</span>
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center -ml-1">AM</span>
            </div>
          </div>
          
          <div className="border border-gray-200 p-4 rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Diagrama de Clases</h4>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Pendiente</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Invitación enviada a 1 usuario</p>
            <div className="flex">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center -ml-0">CP</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Link to="/admin/colaboracion" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            Gestionar colaboraciones →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

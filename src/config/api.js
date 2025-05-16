// src/config/api.js
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Definir las rutas de la API
export const API_ROUTES = {
  LOGIN: `${API_URL}/api/login`,
  REGISTER: `${API_URL}/api/register`,
  PROYECTOS: `${API_URL}/api/proyectos`,
  CREAR_PROYECTO: `${API_URL}/api/proyectos/crear`,
  GENERAR_DIAGRAMA: `${API_URL}/api/diagramas/generar`,
  USUARIOS: `${API_URL}/api/usuarios`,
  COLABORACIONES: `${API_URL}/api/colaboraciones`,
};

export default API_URL;

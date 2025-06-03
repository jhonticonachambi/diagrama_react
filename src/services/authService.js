import api from './api';

export const authService = {  login: async (email, password) => {
    const response = await api.post('/login', null, {
      params: { email, password }
    });
    console.log('Debug - Respuesta completa del login:', response.data);
    return response.data;
  },
  register: async (userData) => {
    // Mapear 'name' a 'nombre' para que coincida con el backend
    const requestData = {
      email: userData.email,
      nombre: userData.name,  // Cambiar 'name' por 'nombre'
      password: userData.password
    };
    const response = await api.post('/register', requestData);
    return response.data;
  },  verifyToken: async (token) => {
    // Por ahora no hay endpoint de verificación, retornamos true si el token existe
    if (!token) {
      throw new Error('No token provided');
    }
    return { valid: true };
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/refresh');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  getUserData: async (token) => {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
};

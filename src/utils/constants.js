export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/profile',
    CHANGE_PASSWORD: '/user/password'
  },
  DIAGRAMS: {
    LIST: '/diagrams',
    CREATE: '/diagrams',
    UPDATE: '/diagrams',
    DELETE: '/diagrams'
  }
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  DIAGRAMS: '/dashboard/diagrams',
  HISTORY: '/dashboard/history',
  COLLABORATION: '/dashboard/collaboration'
};

export const MESSAGES = {
  LOADING: 'Cargando...',
  ERROR: 'Ha ocurrido un error',
  SUCCESS: 'Operación exitosa',
  LOGIN_SUCCESS: 'Sesión iniciada correctamente',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  REGISTER_SUCCESS: 'Cuenta creada exitosamente'
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_EMAIL: 'userEmail',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebarState'
};

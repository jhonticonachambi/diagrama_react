// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/Layout/AdminLayout';

import DiagramaView from './views/DiagramaView';
import HistoryView from './views/HistoryView';
import CollaborationView from './views/CollaborationView';

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<Login />} />
    {/* Redirección para compatibilidad con código antiguo */}
    <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
    <Route
      path="/admin"
      element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="diagrama" element={<DiagramaView />} />
      <Route path="historia" element={<HistoryView />} />
      <Route path="colaboracion" element={<CollaborationView />} />
    </Route>
  </Routes>
);

export default App;

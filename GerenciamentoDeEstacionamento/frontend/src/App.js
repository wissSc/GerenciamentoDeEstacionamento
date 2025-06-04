import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VehicleList from './pages/VehicleList';
import VehicleForm from './pages/VehicleForm';
import AccessControl from './pages/AccessControl';
import NotFound from './pages/NotFound';

// Componente para rotas privadas
const PrivateRoute = ({ children }) => {
  const { signed, loading } = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  return signed ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/vehicles" 
            element={
              <PrivateRoute>
                <VehicleList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/vehicles/new" 
            element={
              <PrivateRoute>
                <VehicleForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/vehicles/edit/:id" 
            element={
              <PrivateRoute>
                <VehicleForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/access" 
            element={
              <PrivateRoute>
                <AccessControl />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

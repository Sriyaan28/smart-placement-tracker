import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is not authorized, redirect to appropriate dashboard or 403 page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'STUDENT') return <Navigate to="/student-dashboard" replace />;
    if (user.role === 'COMPANY') return <Navigate to="/company-dashboard" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

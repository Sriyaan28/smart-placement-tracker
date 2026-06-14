import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { StudentDashboard } from '../pages/StudentDashboard';
import { CompanyDashboard } from '../pages/CompanyDashboard';
import { AdminDashboard } from '../pages/AdminDashboard';
import { useAuth } from '../hooks/useAuth';

export const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-300">Loading Application...</div>;
  }

  // Determine homepage redirect based on role
  const getHomeRedirect = () => {
    if (!user) return "/login";
    if (user.role === 'STUDENT') return "/student-dashboard";
    if (user.role === 'COMPANY') return "/company-dashboard";
    if (user.role === 'ADMIN') return "/admin-dashboard";
    return "/login";
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to={getHomeRedirect()} replace />} />
        
        {/* Redirect logged in users away from auth pages */}
        <Route path="/login" element={user ? <Navigate to={getHomeRedirect()} replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={getHomeRedirect()} replace /> : <Register />} />
        
        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          {/* We can add /jobs, /profile etc here later */}
        </Route>

        {/* Protected Company Routes */}
        <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          {/* We can add /post-job, /manage-applications etc here later */}
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

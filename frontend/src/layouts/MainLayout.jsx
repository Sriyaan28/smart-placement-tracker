import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../api/authApi';

export const MainLayout = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      {/* Navbar */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-blue-400">Smart Placement Tracker</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-400">
                {user.name} <span className="bg-slate-700 px-2 py-1 rounded-full text-xs ml-2">{user.role}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-md transition text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium">Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-white transition text-sm font-medium">Register</Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

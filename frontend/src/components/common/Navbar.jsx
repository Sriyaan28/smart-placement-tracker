import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/auth/useAuth';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { handleLogout } = useAuth();

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl shadow-2xl">
        {/* Logo */}
        <Link to="/home" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2 transition-transform hover:scale-105">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
          Placio
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-full transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>
    </div>
  );
};

import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, FileWarning, UserCircle, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/auth/useAuth';

export const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user, handleLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/home', icon: LayoutDashboard },
    { name: 'Search', path: '/home/search', icon: Search },
    { name: 'Reports', path: '/home/reports', icon: FileWarning },
    { name: 'Profile', path: '/home/profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside 
        className={`fixed left-4 top-4 bottom-4 z-50 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 transition-all duration-300 flex flex-col items-center py-6 shadow-2xl ${
          isCollapsed ? 'w-20 rounded-[2rem]' : 'w-64 rounded-r-none rounded-l-[2rem]'
        }`}
        style={{
          borderTopRightRadius: isCollapsed ? '2rem' : '1rem',
          borderBottomRightRadius: isCollapsed ? '2rem' : '1rem',
        }}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-10 w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors shadow-lg"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Logo / Brand */}
        <div 
          className="flex items-center gap-3 mb-10 w-full px-6 cursor-pointer"
          onClick={() => navigate('/home')}
        >
          <div className="w-8 h-8 min-w-[32px] bg-red-500 rounded-full flex items-center justify-center shrink-0">
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
          {!isCollapsed && (
            <span className="text-white font-bold text-xl tracking-tight flex items-center gap-2 animate-in fade-in">
              Placio
              <span className="text-[10px] text-red-400 font-normal bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 uppercase">Admin</span>
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 w-full flex flex-col gap-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Exact match for home, partial for others to keep them highlighted if nested
            const isActive = item.path === '/home' 
              ? location.pathname === '/home' 
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all group overflow-hidden ${
                  isActive 
                    ? 'bg-red-500/10 text-red-500' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon size={22} className={`shrink-0 ${isActive ? 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'group-hover:scale-110 transition-transform'}`} />
                {!isCollapsed && (
                  <span className={`font-medium whitespace-nowrap animate-in fade-in ${isActive ? 'text-red-500' : 'text-zinc-300'}`}>
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="w-full px-3 mt-auto pt-4 border-t border-zinc-800/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all group overflow-hidden"
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut size={22} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap animate-in fade-in text-red-400">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-24' : 'ml-[17rem]'} min-h-screen p-8 relative overflow-y-auto`}>
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

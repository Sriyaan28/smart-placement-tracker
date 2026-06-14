import React from 'react';
import { Navbar } from '../components/utils/Navbar';
import { useAuth } from '../hooks/useAuth';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="pt-40 pb-20 px-6 max-w-6xl mx-auto relative">
        {/* Abstract Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Welcome, <span className="text-emerald-400">{user?.name}</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-12">
            You are logged in as a <span className="font-semibold text-emerald-500">{user?.role}</span>. This is your home dashboard.
          </p>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-3">Dashboard Overview</h3>
            <p className="text-zinc-400">
              This space will soon contain your {user?.role === 'STUDENT' ? 'job applications, resume stats, and recommended companies' : 'job postings, applicant tracking, and interview schedules'}.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

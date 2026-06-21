import React from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { ShieldCheck, Mail } from 'lucide-react';

export const AdminProfileView = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Admin Profile</h1>
        <p className="text-zinc-400">Manage your administrator account and settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Left Column - Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center text-red-500 font-bold text-4xl mb-4 shadow-inner">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <h2 className="text-xl font-bold text-white mb-1 flex items-center justify-center gap-2">
              {user?.name || 'Administrator'}
              <ShieldCheck className="w-5 h-5 text-red-500" />
            </h2>
            <p className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4">
              SYSTEM ADMIN
            </p>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-6">System Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-black/50 border border-zinc-800/50 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-500 font-medium mb-1">Email Address</p>
                  <p className="text-white font-medium text-sm truncate">{user?.email}</p>
                </div>
              </div>

            </div>
            
            <div className="mt-8 pt-8 border-t border-zinc-800/50">
              <h3 className="text-lg font-bold text-white mb-4">About the Admin Role</h3>
              <p className="text-zinc-400 leading-relaxed">
                As a System Administrator, you have full oversight over the platform. You can moderate users, verify companies, manage reported jobs, and ensure the community remains safe and professional.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

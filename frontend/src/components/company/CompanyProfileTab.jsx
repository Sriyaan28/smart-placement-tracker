import React from 'react';
import { useProfile } from '../../hooks/common/useProfile';
import { Mail, Phone, Building2, Link as LinkIcon, BadgeCheck } from 'lucide-react';

const LinkedinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const CompanyProfileTab = () => {
  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Left Column - Basic Info */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-4xl mb-4 shadow-inner">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            {profile.isVerified && (
              <div className="relative flex items-center group">
                <BadgeCheck className="w-5 h-5 text-blue-500 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-3 py-2 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-lg shadow-xl border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 text-center">
                  This company is verified and trusted by our administration.
                </div>
              </div>
            )}
          </div>
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-4 flex items-center justify-center gap-1">
            <Building2 className="w-4 h-4" />
            {profile.role?.replace('_', ' ')}
          </p>
          
          <div className="w-full h-px bg-zinc-800 my-4" />
          
          <div className="w-full space-y-4">
            <div className="flex items-center gap-3 text-zinc-400">
              <Mail className="w-5 h-5 text-zinc-500" />
              <span className="text-sm truncate">{profile.email}</span>
            </div>
            {profile.number && (
              <div className="flex items-center gap-3 text-zinc-400">
                <Phone className="w-5 h-5 text-zinc-500" />
                <span className="text-sm">{profile.number}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Bio & Links */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-white mb-4">About Company</h3>
          <p className="text-zinc-400 leading-relaxed min-h-[100px]">
            {profile.bio || "No company description provided yet. Add a bio in your settings to tell candidates more about your company."}
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-white mb-6">Connected Platforms</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* LinkedIn */}
            <div className="p-4 rounded-2xl border border-zinc-800 bg-black/50 flex items-center justify-between group hover:border-zinc-700 transition-colors sm:col-span-2">
              <div className="flex items-center gap-3">
                <LinkedinIcon className="w-6 h-6 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                <div>
                  <p className="text-sm text-zinc-500">LinkedIn</p>
                  <p className="text-white font-medium truncate max-w-[250px]">{profile.linkedinUrl || 'Not connected'}</p>
                </div>
              </div>
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 bg-blue-500/10 p-2 rounded-full">
                  <LinkIcon className="w-4 h-4" />
                </a>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

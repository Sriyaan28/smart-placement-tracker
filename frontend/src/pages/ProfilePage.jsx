import React, { useState } from 'react';
import { User, FileText, Settings, AlertCircle } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { ProfileTab } from '../components/profile/ProfileTab';
import { ResumeTab } from '../components/profile/ResumeTab';
import { SettingsTab } from '../components/profile/SettingsTab';
import { Loading } from '../components/utils/Loading';

export const ProfilePage = () => {
  const { loadingProfile, profileError } = useProfile();
  const [activeTab, setActiveTab] = useState('PROFILE');

  if (loadingProfile) {
    return <Loading />;
  }

  if (profileError) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
        <p className="text-zinc-400">{profileError}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">My Profile</h1>
        <p className="text-zinc-400">Manage your personal information, resume, and account settings.</p>
      </div>

      {/* Tab Switcher */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-1 rounded-full flex items-center mb-8 relative w-fit">
        <div 
          className="absolute top-1 bottom-1 w-[120px] bg-zinc-800 rounded-full shadow-sm transition-all duration-300 ease-in-out"
          style={{ 
            left: '4px',
            transform: `translateX(${activeTab === 'PROFILE' ? 0 : activeTab === 'RESUME' ? 120 : 240}px)`
          }}
        />
        
        <button 
          onClick={() => setActiveTab('PROFILE')}
          className={`relative z-10 w-[120px] py-2.5 text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'PROFILE' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <User size={16} /> Profile
        </button>
        
        <button 
          onClick={() => setActiveTab('RESUME')}
          className={`relative z-10 w-[120px] py-2.5 text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'RESUME' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <FileText size={16} /> Resume
        </button>

        <button 
          onClick={() => setActiveTab('SETTINGS')}
          className={`relative z-10 w-[120px] py-2.5 text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'SETTINGS' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Settings size={16} /> Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative">
        {activeTab === 'PROFILE' && <ProfileTab />}
        {activeTab === 'RESUME' && <ResumeTab />}
        {activeTab === 'SETTINGS' && <SettingsTab />}
      </div>
    </div>
  );
};

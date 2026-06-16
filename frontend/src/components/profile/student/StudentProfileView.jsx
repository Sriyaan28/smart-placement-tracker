import React, { useState } from 'react';
import { User, FileText, Settings } from 'lucide-react';
import { ProfileTab } from './StudentProfileTab';
import { ResumeTab } from './StudentResumeTab';
import { SettingsTab } from './StudentSettingsTab';

export const StudentProfileView = () => {
  const [activeTab, setActiveTab] = useState('PROFILE');

  return (
    <>
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
    </>
  );
};

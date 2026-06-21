import React, { useState } from 'react';
import { Building2, Settings } from 'lucide-react';
import { CompanyProfileTab } from './CompanyProfileTab';
import { CompanySettingsTab } from './CompanySettingsTab';

export const CompanyProfileView = () => {
  const [activeTab, setActiveTab] = useState('PROFILE');

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Company Profile</h1>
        <p className="text-zinc-400">Manage your company information and settings.</p>
      </div>

      {/* Tab Switcher */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-1 rounded-full flex items-center mb-8 relative w-fit">
        <div 
          className="absolute top-1 bottom-1 w-[120px] bg-zinc-800 rounded-full shadow-sm transition-all duration-300 ease-in-out"
          style={{ 
            left: '4px',
            transform: `translateX(${activeTab === 'PROFILE' ? 0 : 120}px)`
          }}
        />
        
        <button 
          onClick={() => setActiveTab('PROFILE')}
          className={`relative z-10 w-[120px] py-2.5 text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'PROFILE' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Building2 size={16} /> Profile
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
        {activeTab === 'PROFILE' && <CompanyProfileTab />}
        {activeTab === 'SETTINGS' && <CompanySettingsTab />}
      </div>
    </>
  );
};

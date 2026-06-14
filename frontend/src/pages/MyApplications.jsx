import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import { Briefcase, Calendar, CheckCircle2, XCircle, Search, ChevronRight, Clock, Building2 } from 'lucide-react';

export const MyApplications = () => {
  const navigate = useNavigate();
  const { applications, loading, error, fetchApplications } = useApplications();

  useEffect(() => {
    fetchApplications(false); // Silent background refresh
  }, [fetchApplications]);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      // 1. Tab Filtering
      let matchesTab = false;
      if (activeTab === 'ALL') matchesTab = true;
      if (activeTab === 'PENDING' && app.status === 'APPLIED') matchesTab = true;
      if (activeTab === 'SCHEDULED' && app.status === 'INTERVIEW') matchesTab = true;
      if (activeTab === 'REVIEWED' && (app.status === 'SELECTED' || app.status === 'REJECTED')) matchesTab = true;

      // 2. Search Query Filtering
      const query = searchQuery.toLowerCase().trim();
      const jobTitle = app.jobId?.title?.toLowerCase() || '';
      const companyName = app.jobId?.user?.name?.toLowerCase() || '';
      const matchesSearch = !query || jobTitle.includes(query) || companyName.includes(query);

      return matchesTab && matchesSearch;
    });
  }, [applications, activeTab, searchQuery]);

  // Status Badge Configuration
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPLIED':
        return (
          <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold w-fit">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'INTERVIEW':
        return (
          <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold w-fit">
            <Calendar className="w-3.5 h-3.5" /> Scheduled
          </span>
        );
      case 'SELECTED':
        return (
          <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selected
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold w-fit">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'ALL', label: 'All Applications' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'SCHEDULED', label: 'Scheduled' },
    { id: 'REVIEWED', label: 'Reviewed' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2">My Applications</h1>
        <p className="text-zinc-400">Track and manage your job applications in one place.</p>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        
        {/* Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-zinc-900/50 p-1.5 rounded-full border border-zinc-800 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                activeTab === tab.id 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-80 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company or role..."
            className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500/50 text-white pl-11 pr-4 py-3 rounded-full outline-none transition-all text-sm placeholder:text-zinc-600"
          />
        </div>

      </div>

      {/* Data Table View */}
      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl overflow-hidden">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-zinc-800/50 bg-zinc-900/50 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <div className="col-span-4 lg:col-span-3 pl-2">Company</div>
          <div className="col-span-4 lg:col-span-4">Role</div>
          <div className="col-span-2">Date Applied</div>
          <div className="col-span-2">Status</div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="flex flex-col divide-y divide-zinc-800/50">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 h-24 animate-pulse bg-zinc-900/20" />
            ))}
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-400 bg-red-500/5">{error}</div>
        ) : filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No applications found</h3>
            <p className="text-zinc-500 max-w-sm">
              {searchQuery || activeTab !== 'ALL' 
                ? "We couldn't find any applications matching your current filters." 
                : "You haven't applied to any jobs yet. Start exploring the marketplace!"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-800/50">
            {filteredApplications.map((app) => (
              <div 
                key={app._id}
                onClick={() => navigate(`/home/applications/${app._id}`)}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 p-6 items-center hover:bg-zinc-800/30 transition-colors cursor-pointer group"
              >
                
                {/* Mobile View Header (Hidden on Desktop) */}
                <div className="flex items-center justify-between md:hidden mb-2">
                  {getStatusBadge(app.status)}
                  <p className="text-xs text-zinc-500">
                    {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {/* Company Avatar & Name */}
                <div className="col-span-4 lg:col-span-3 flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0 border border-zinc-700/50">
                    <span className="text-xl font-bold text-emerald-500">
                      {app.jobId?.user?.name?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <div className="font-bold text-white truncate">
                    {app.jobId?.user?.name || 'Unknown Company'}
                  </div>
                </div>
                
                {/* Role Details */}
                <div className="col-span-4 lg:col-span-4 flex flex-col justify-center">
                  <h4 className="text-white font-semibold truncate group-hover:text-emerald-400 transition-colors">
                    {app.jobId?.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md w-fit">
                      {app.jobId?.jobType?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Date Applied (Desktop) */}
                <div className="hidden md:flex col-span-2 text-sm text-zinc-400 font-medium">
                  {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                {/* Status (Desktop) */}
                <div className="hidden md:flex col-span-2 items-center justify-between">
                  {getStatusBadge(app.status)}
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-emerald-500 transition-colors translate-x-0 group-hover:translate-x-1" />
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { useCompany } from '../../hooks/company/useCompany';
import { Search, MapPin, IndianRupee, Clock, PlusCircle, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CompanyHome = () => {
  const { user } = useAuth();
  const { companyJobs, loading, error } = useCompany();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Frontend-only filter by title
  const filteredJobs = companyJobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            Company Dashboard
          </h1>
          <p className="text-zinc-400">Manage your active job postings and track applications.</p>
        </div>
        <button 
          onClick={() => navigate('/home/post-job')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
        >
          <PlusCircle size={20} />
          Post New Job
        </button>
      </div>

      {/* Local Search Bar */}
      <div className="mb-10 relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your posted jobs by title..."
          className="w-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 focus:border-blue-500/50 focus:bg-black text-white pl-14 pr-6 py-5 rounded-full outline-none transition-all shadow-xl text-lg placeholder:text-zinc-500"
        />
      </div>

      {/* Jobs Grid */}
      <h2 className="text-xl font-bold text-white mb-6">Your Posted Jobs ({filteredJobs.length})</h2>

      {loading && companyJobs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl h-48 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      ) : companyJobs.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800 p-12 rounded-3xl text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Briefcase size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Jobs Posted Yet</h3>
          <p className="text-zinc-400 mb-6 max-w-md">You haven't posted any jobs. Create your first job posting to start receiving applications from students.</p>
          <button 
            onClick={() => navigate('/home/post-job')}
            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-6 rounded-full transition-colors"
          >
            Create Job Posting
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl text-center">
          <p className="text-zinc-400">No jobs match your search "{searchQuery}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <div 
              key={job._id || job.id} 
              className="bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/50 p-6 rounded-3xl transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-bold bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20">
                  {job.jobType?.replace('_', ' ')}
                </span>
                <span className="text-xs font-medium text-zinc-500">
                  {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="font-bold text-white text-xl line-clamp-1 mb-4">{job.title}</h3>
              
              <div className="mt-auto flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <MapPin className="w-4 h-4 text-zinc-500" /> 
                  <span className="truncate">{job.location?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <IndianRupee className="w-4 h-4 text-zinc-500" /> 
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <Clock className="w-4 h-4 text-zinc-500" /> 
                  <span>{job.duration}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-zinc-800/50 flex items-center justify-between">
                <button 
                  onClick={() => navigate(`/home/job/${job._id || job.id}`)}
                  className="text-sm font-bold text-zinc-300 hover:text-white transition-colors"
                >
                  View Details
                </button>
                <button 
                  onClick={() => navigate(`/home/company-applications`)}
                  className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors"
                >
                  View Applicants
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { useAuth } from '../../hooks/auth/useAuth';
import { useJobs } from '../../hooks/student/useJobs';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, IndianRupee, Clock, ArrowRight } from 'lucide-react';

export const StudentHome = () => {
  const { user } = useAuth();
  const { jobs, loading, error } = useJobs();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/home/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (user?.role !== 'STUDENT') {
    return (
      <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-emerald-500/30">
        <Navbar />
        <main className="pt-40 pb-20 px-6 max-w-6xl mx-auto relative">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Welcome, <span className="text-emerald-400">{user?.name}</span>
            </h1>
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-white mb-3">Company Dashboard Overview</h3>
              <p className="text-zinc-400">
                This space will soon contain your job postings, applicant tracking, and interview schedules.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Student Dashboard View
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, <span className="text-emerald-400">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-zinc-400">Ready to discover your next opportunity?</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-12 relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by job title or company name..."
          className="w-full bg-white/5 backdrop-blur-md border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 text-white pl-14 pr-32 py-5 rounded-full outline-none transition-all shadow-xl text-lg placeholder:text-zinc-500"
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 rounded-full transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
        >
          Search
        </button>
      </form>

      {/* Recommended/Newest Jobs */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Newest Opportunities</h2>
        <button 
          onClick={() => navigate('/home/search')}
          className="text-emerald-500 hover:text-emerald-400 font-medium flex items-center gap-2 group"
        >
          View more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {loading && jobs.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 p-5 rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {jobs.map(job => (
            <div key={job._id || job.id} className="bg-zinc-900/40 border border-zinc-800/50 hover:border-emerald-500/30 p-5 rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:-translate-y-1 flex flex-col cursor-pointer" onClick={() => navigate(`/home/job/${job._id || job.id}`)}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-emerald-500">
                    {job.user?.name?.charAt(0) || 'C'}
                  </span>
                </div>
                <span className="text-xs font-semibold bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md">
                  {job.jobType?.replace('_', ' ')}
                </span>
              </div>
              
              <h3 className="font-bold text-white text-lg line-clamp-1 mb-1">{job.title}</h3>
              <p className="text-sm text-zinc-400 mb-4">{job.user?.name}</p>
              
              <div className="mt-auto flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <MapPin className="w-3 h-3" /> 
                  <span className="truncate">{job.location?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-3 h-3" /> {job.salary}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {job.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

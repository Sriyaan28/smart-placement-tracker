import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, User as UserIcon, AlertCircle, ChevronRight } from 'lucide-react';
import { searchUsers } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';

export const SearchStudents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch results when debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setStudents([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setError('');
      setHasSearched(true);
      
      try {
        const res = await searchUsers(debouncedQuery);
        if (res.success) {
          // Explicitly only use the students array to ensure companies aren't shown
          setStudents(res.payload.students || []);
        } else {
          setError(res.message || 'Failed to search students');
        }
      } catch (err) {
        // If 404 (No users found), just show empty state without an error alert
        if (err.response?.status === 404) {
          setStudents([]);
        } else {
          setError(err.response?.data?.message || 'An error occurred during search');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Search className="text-blue-500 w-8 h-8" />
          Student Directory
        </h1>
        <p className="text-zinc-400">Search for prospective candidates by name.</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-10">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="w-6 h-6 text-zinc-500" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name..." 
          className="w-full bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-full pl-16 pr-8 py-5 text-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none shadow-xl placeholder:text-zinc-600"
        />
        {loading && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Results Container */}
      <div className="space-y-4">
        
        {!hasSearched && (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
              <UserIcon className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Start Typing to Search</h3>
            <p className="text-zinc-500 max-w-md">Enter a student's name above to find their profile and contact information.</p>
          </div>
        )}

        {hasSearched && !loading && students.length === 0 && !error && (
          <div className="py-20 text-center flex flex-col items-center animate-in fade-in">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
              <Search className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Students Found</h3>
            <p className="text-zinc-500">We couldn't find any students matching "{debouncedQuery}".</p>
          </div>
        )}

        {/* Vertical list of horizontal cards */}
        {students.map((student) => (
          <div 
            key={student._id}
            className="group bg-zinc-900/40 border border-zinc-800 hover:border-blue-500/50 rounded-[1.5rem] p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
          >
            {/* Subtle blue glow on hover */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex gap-6 w-full md:w-auto items-center">
              {/* Left: Avatar Square */}
              <div className="w-16 h-16 bg-zinc-800/80 rounded-2xl flex items-center justify-center border border-zinc-700/50 shrink-0 group-hover:border-blue-500/30 transition-colors">
                <span className="text-2xl font-black text-blue-500">
                  {student.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* Right: Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {student.name}
                  </h3>
                  <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider">
                    STUDENT
                  </span>
                </div>
                
                {/* Contact Pills */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 px-3 py-1 rounded-full text-sm">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{student.email}</span>
                  </div>
                  {student.number && (
                    <div className="flex items-center gap-1.5 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 px-3 py-1 rounded-full text-sm">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>{student.number}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* View Profile Action */}
            <div className="w-full md:w-auto flex justify-end mt-2 md:mt-0 z-10">
              <button 
                onClick={() => navigate(`/home/stats/${student._id}`)}
                className="bg-zinc-800 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 border border-zinc-700 hover:border-transparent"
              >
                View Profile <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

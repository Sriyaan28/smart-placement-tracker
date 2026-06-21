import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchJobs as searchJobsApi } from '../../api/jobApi';
import { Search, MapPin, IndianRupee, Clock, Briefcase, Building2, ChevronRight } from 'lucide-react';

export const SearchJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const currentQuery = searchParams.get('q') || '';
  
  // State
  const [query, setQuery] = useState(currentQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [filterJobType, setFilterJobType] = useState('ALL');
  const [filterLocation, setFilterLocation] = useState('ALL');

  const executeSearch = async (searchQ) => {
    if (!searchQ || !searchQ.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await searchJobsApi(searchQ);
      setResults(res.success ? res.payload : []);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setResults([]);
      } else {
        setError('An error occurred while searching for jobs.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Run search when URL param changes
  useEffect(() => {
    setQuery(currentQuery);
    executeSearch(currentQuery);
  }, [currentQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  // Apply frontend filters
  const filteredResults = useMemo(() => {
    return results.filter(job => {
      const matchType = filterJobType === 'ALL' || job.jobType === filterJobType;
      const matchLocation = filterLocation === 'ALL' || job.location === filterLocation;
      return matchType && matchLocation;
    });
  }, [results, filterJobType, filterLocation]);

  const isSearching = currentQuery.length > 0;

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 min-h-[80vh] flex flex-col relative">
      
      {/* Dynamic Header & Search Bar Container */}
      <div 
        className={`w-full transition-all duration-700 ease-in-out flex flex-col ${
          isSearching ? 'mt-0 pt-0' : 'mt-[20vh] items-center text-center'
        }`}
      >
        <h1 className={`font-black text-white transition-all duration-700 ${
          isSearching ? 'text-3xl mb-6 text-left' : 'text-5xl md:text-6xl mb-8'
        }`}>
          {isSearching ? 'Search Results' : 'Discover Your Next Role'}
        </h1>
        
        {/* Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className={`relative group transition-all duration-700 ${
            isSearching ? 'w-full max-w-none' : 'w-full max-w-3xl'
          }`}
        >
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className={`text-zinc-400 group-focus-within:text-emerald-500 transition-colors ${isSearching ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by job title or company name..."
            className={`w-full bg-white/5 backdrop-blur-md border border-white/10 focus:border-emerald-500/50 focus:bg-white/10 text-white outline-none transition-all shadow-xl placeholder:text-zinc-500 rounded-full ${
              isSearching ? 'pl-14 pr-32 py-5 text-lg' : 'pl-16 pr-40 py-6 text-xl'
            }`}
          />
          <button 
            type="submit"
            className={`absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-full transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] ${
              isSearching ? 'px-8' : 'px-10 text-lg'
            }`}
          >
            Search
          </button>
        </form>

        {!isSearching && (
          <p className="mt-8 text-zinc-400 text-lg animate-in fade-in duration-1000 delay-300">
            Start typing above to search thousands of opportunities...
          </p>
        )}
      </div>

      {/* Results Section (Only visible when searching) */}
      <div className={`transition-all duration-700 ease-in-out w-full ${isSearching ? 'opacity-100 translate-y-0 mt-8' : 'opacity-0 translate-y-10 pointer-events-none absolute'}`}>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50">
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-zinc-400" />
            <select 
              value={filterJobType} 
              onChange={(e) => setFilterJobType(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-sm text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Job Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="RESEARCH">Research</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-zinc-400" />
            <select 
              value={filterLocation} 
              onChange={(e) => setFilterLocation(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-sm text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Locations</option>
              <option value="ON_SITE">On Site</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
          
          <div className="ml-auto text-sm text-zinc-400 font-medium">
            Found {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}
          </div>
        </div>

        {/* Results List */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl h-32 animate-pulse w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
            {error}
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No jobs found</h2>
            <p className="text-zinc-400 max-w-md">
              We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-in fade-in duration-500">
            {filteredResults.map(job => (
              <div 
                key={job._id || job.id} 
                onClick={() => navigate(`/home/job/${job._id || job.id}`)}
                className="bg-zinc-900/40 border border-zinc-800/50 hover:border-emerald-500/30 p-6 rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:-translate-y-1 cursor-pointer flex flex-col md:flex-row md:items-center gap-6 group"
              >
                {/* Company Avatar */}
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-700">
                  <span className="text-2xl font-bold text-emerald-500">
                    {job.user?.name?.charAt(0) || 'C'}
                  </span>
                </div>
                
                {/* Job Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-white text-xl group-hover:text-emerald-400 transition-colors">
                      {job.title}
                    </h3>
                    <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap mt-0.5">
                      {job.jobType?.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-zinc-400 mb-3 font-medium">
                    <Building2 className="w-4 h-4" />
                    <span>{job.user?.name}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-1.5 bg-zinc-800/50 px-3 py-1 rounded-lg">
                      <MapPin className="w-4 h-4 text-zinc-400" /> 
                      <span>{job.location?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-zinc-800/50 px-3 py-1 rounded-lg">
                      <IndianRupee className="w-4 h-4 text-zinc-400" /> 
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-zinc-800/50 px-3 py-1 rounded-lg">
                      <Clock className="w-4 h-4 text-zinc-400" /> 
                      <span>{job.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

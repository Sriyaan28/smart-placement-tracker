import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Search, Loader2, User, Building2, Briefcase, Filter } from 'lucide-react';

export const AdminSearch = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('STUDENT'); // STUDENT, COMPANY, JOB
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);
    setResults([]);

    try {
      const res = await api.get(`/user/admin-search/${encodeURIComponent(query)}?type=${searchType}`);
      if (res.data.success) {
        setResults(res.data.payload);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (item) => {
    if (searchType === 'STUDENT') navigate(`/home/stats/${item._id}`);
    else if (searchType === 'COMPANY') navigate(`/home/company/${item._id}`);
    else if (searchType === 'JOB') navigate(`/home/job/${item._id}`);
  };

  const getIcon = () => {
    if (searchType === 'STUDENT') return <User className="w-5 h-5 text-zinc-400" />;
    if (searchType === 'COMPANY') return <Building2 className="w-5 h-5 text-zinc-400" />;
    return <Briefcase className="w-5 h-5 text-zinc-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="mb-8 text-center mt-10">
        <h1 className="text-4xl font-black text-white mb-4">Universal Search</h1>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Quickly find any student, company, or job posting across the platform.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative z-20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className={`w-6 h-6 transition-colors duration-300 ${query ? 'text-red-500' : 'text-zinc-500 group-focus-within:text-red-500'}`} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search for ${searchType.toLowerCase()}s...`}
              className="w-full bg-zinc-900/80 border-2 border-zinc-800 text-white pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:border-red-500/50 transition-all text-lg placeholder:text-zinc-600 shadow-xl"
            />
          </div>

          <div className="relative min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="w-5 h-5 text-zinc-500" />
            </div>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setResults([]);
                setHasSearched(false);
              }}
              className="w-full bg-zinc-900/80 border-2 border-zinc-800 text-white pl-12 pr-10 py-4 rounded-2xl focus:outline-none focus:border-red-500/50 transition-all text-lg appearance-none cursor-pointer hover:bg-zinc-800/80"
            >
              <option value="STUDENT">Students</option>
              <option value="COMPANY">Companies</option>
              <option value="JOB">Jobs</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold transition-colors flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Search'}
          </button>
        </div>
      </form>

      {/* Results */}
      {hasSearched && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-zinc-400 mb-4 font-medium px-2">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </h3>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl mb-4">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {results.map((item) => (
              <div
                key={item._id}
                onClick={() => handleResultClick(item)}
                className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex items-center gap-5 cursor-pointer hover:bg-zinc-800/50 hover:border-red-500/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden border border-zinc-700/50">
                  {item.userProfile ? (
                    <img src={item.userProfile} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    getIcon()
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white truncate group-hover:text-red-400 transition-colors">
                      {searchType === 'JOB' ? item.title : item.name}
                    </h3>
                    
                    {item.isBlocked === true || item.isActive === false ? (
                      <span className="bg-red-500/10 text-red-500 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-red-500/20 font-bold whitespace-nowrap">
                        Blocked
                      </span>
                    ) : null}

                    {searchType === 'COMPANY' && item.isVerified && (
                      <span className="bg-emerald-500/10 text-emerald-500 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/20 font-bold whitespace-nowrap">
                        Verified
                      </span>
                    )}

                    {searchType === 'JOB' && (
                      <span className="bg-blue-500/10 text-blue-500 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/20 font-bold whitespace-nowrap">
                        {item.jobType}
                      </span>
                    )}
                  </div>
                  
                  {searchType === 'JOB' ? (
                    <p className="text-zinc-400 text-sm flex items-center gap-2 truncate">
                      <Building2 className="w-4 h-4" />
                      {item.user?.name || 'Unknown Company'}
                      <span className="text-zinc-700">•</span>
                      {item.location}
                    </p>
                  ) : (
                    <p className="text-zinc-400 text-sm truncate">{item.email}</p>
                  )}
                </div>
                
                <div className="hidden sm:flex flex-col items-end text-sm text-zinc-500">
                  <span>Joined</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}

            {results.length === 0 && !loading && !error && (
              <div className="text-center py-20 px-4">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-zinc-700" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                <p className="text-zinc-500 max-w-sm mx-auto">
                  We couldn't find any {searchType.toLowerCase()}s matching "{query}". Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

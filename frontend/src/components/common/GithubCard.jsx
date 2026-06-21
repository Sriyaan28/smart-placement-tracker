import React, { useEffect, useState } from 'react';
import { getGithubStats } from '../../api/userApi';
import { BookOpen, Users, Star, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GithubIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const GithubCard = ({ userId, isOwnStats }) => {
  const navigate = useNavigate();
  const [github, setGithub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getGithubStats(userId);
        if (res.success) {
          setGithub(res.payload);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("GitHub profile not linked.");
        } else {
          setError("Failed to load GitHub stats.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full bg-zinc-900/50 rounded-[2rem] border border-zinc-800/50 animate-pulse p-8 md:p-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-zinc-800" />
          <div className="w-24 h-8 rounded bg-zinc-800" />
        </div>
        <div className="flex gap-6 mb-10">
          <div className="w-20 h-20 rounded-2xl bg-zinc-800" />
          <div className="flex flex-col gap-2 mt-2">
            <div className="w-32 h-6 rounded bg-zinc-800" />
            <div className="w-24 h-4 rounded bg-zinc-800" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-auto">
          <div className="h-24 rounded-2xl bg-zinc-800" />
          <div className="h-24 rounded-2xl bg-zinc-800" />
          <div className="h-24 rounded-2xl bg-zinc-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:border-zinc-700 transition-colors h-full flex flex-col">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <GithubIcon className="w-8 h-8 text-white" />
          <h2 className="text-2xl font-bold text-white">GitHub</h2>
        </div>
        {github && (
          <a href={github.url} target="_blank" rel="noreferrer" className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors">
            <LinkIcon className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-between">
        {error ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-10">
            {error === "GitHub profile not linked." ? (
              <>
                <GithubIcon className="w-12 h-12 text-zinc-800 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No GitHub Linked</h3>
                <p className="text-zinc-500 text-sm max-w-[250px] mb-6">
                  {isOwnStats ? "Link your GitHub account in your profile to show off your repositories." : "This student hasn't linked a GitHub account yet."}
                </p>
                {isOwnStats && (
                  <button onClick={() => navigate('/home/profile')} className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">
                    Link Profile
                  </button>
                )}
              </>
            ) : (
              <>
                <AlertTriangle className="w-12 h-12 mb-3 text-zinc-500 opacity-20" />
                <p className="text-zinc-500">{error}</p>
              </>
            )}
          </div>
        ) : github ? (
          <>
            <div className="flex items-center gap-6 mb-10">
              <img src={github.avatar} alt="GitHub Avatar" className="w-20 h-20 rounded-2xl border-2 border-zinc-800" />
              <div>
                <h3 className="text-xl font-bold text-white">@{github.username}</h3>
                <p className="text-zinc-400 text-sm mt-1">Active Contributor</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-auto">
              <div className="bg-black/50 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <BookOpen className="w-5 h-5 text-zinc-500 mb-2" />
                <span className="text-2xl font-bold text-white mb-1">{github.publicRepos}</span>
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Repos</span>
              </div>
              <div className="bg-black/50 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <Users className="w-5 h-5 text-zinc-500 mb-2" />
                <span className="text-2xl font-bold text-white mb-1">{github.followers}</span>
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Followers</span>
              </div>
              <div className="bg-black/50 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <Star className="w-5 h-5 text-zinc-500 mb-2" />
                <span className="text-2xl font-bold text-white mb-1">{github.following}</span>
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Following</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-zinc-500">
            <p>No GitHub data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

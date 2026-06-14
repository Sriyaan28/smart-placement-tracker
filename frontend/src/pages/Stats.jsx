import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStats } from '../hooks/useStats';
import { useAuth } from '../hooks/useAuth';
import { Code2, Users, BookOpen, Star, AlertCircle, ChevronLeft, Link as LinkIcon, AlertTriangle } from 'lucide-react';

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

export const Stats = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { fetchStats, getStatsForUser } = useStats();
  
  const { data: stats, loading, error } = getStatsForUser(userId);

  const isOwnStats = user?.id === userId;

  useEffect(() => {
    if (userId) {
      fetchStats(userId);
    }
  }, [userId, fetchStats]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-10 px-4 animate-pulse">
        <div className="w-48 h-10 bg-zinc-800 rounded-xl mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full h-80 bg-zinc-900/50 rounded-3xl border border-zinc-800/50" />
          <div className="w-full h-80 bg-zinc-900/50 rounded-3xl border border-zinc-800/50" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Notice</h2>
        <p className="text-zinc-400 mb-8 max-w-md">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-full transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const { github, leetcode } = stats || {};

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            {isOwnStats ? "Your" : `${stats?.userName || 'Student'}'s`} Coding Stats
          </h1>
          <p className="text-zinc-400">
            {isOwnStats ? "A snapshot of your coding footprint across the web." : `Viewing ${stats?.userName || 'student'}'s coding footprint.`}
          </p>
        </div>
        
        {!isOwnStats && (
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* GITHUB CARD */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:border-zinc-700 transition-colors">
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

          {github ? (
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-10">
                <img src={github.avatar} alt="GitHub Avatar" className="w-20 h-20 rounded-2xl border-2 border-zinc-800" />
                <div>
                  <h3 className="text-xl font-bold text-white">@{github.username}</h3>
                  <p className="text-zinc-400 text-sm mt-1">Active Contributor</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center relative z-10">
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
            </div>
          )}
        </div>

        {/* LEETCODE CARD */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:border-emerald-900/50 transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <Code2 className="w-8 h-8 text-emerald-500" />
              <h2 className="text-2xl font-bold text-white">LeetCode</h2>
            </div>
            {leetcode && (
              <a href={leetcode.url} target="_blank" rel="noreferrer" className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors">
                <LinkIcon className="w-4 h-4" />
              </a>
            )}
          </div>

          {leetcode ? (
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-bold text-white">@{leetcode.username}</h3>
                  <p className="text-zinc-400 text-sm mt-1">Problem Solver</p>
                </div>
                <div className="text-right">
                  <span className="block text-4xl font-black text-emerald-500">{leetcode.totalSolved}</span>
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Total Solved</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Easy */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-emerald-400 font-medium">Easy</span>
                    <span className="text-white font-bold">{leetcode.easy}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${leetcode.totalSolved > 0 ? (leetcode.easy / leetcode.totalSolved) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                {/* Medium */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-yellow-400 font-medium">Medium</span>
                    <span className="text-white font-bold">{leetcode.medium}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full" 
                      style={{ width: `${leetcode.totalSolved > 0 ? (leetcode.medium / leetcode.totalSolved) * 100 : 0}%` }} 
                    />
                  </div>
                </div>

                {/* Hard */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-red-400 font-medium">Hard</span>
                    <span className="text-white font-bold">{leetcode.hard}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ width: `${leetcode.totalSolved > 0 ? (leetcode.hard / leetcode.totalSolved) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center relative z-10">
              <Code2 className="w-12 h-12 text-zinc-800 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No LeetCode Linked</h3>
              <p className="text-zinc-500 text-sm max-w-[250px] mb-6">
                {isOwnStats ? "Link your LeetCode account to showcase your problem-solving skills." : "This student hasn't linked a LeetCode account yet."}
              </p>
              {isOwnStats && (
                <button onClick={() => navigate('/home/profile')} className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">
                  Link Profile
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

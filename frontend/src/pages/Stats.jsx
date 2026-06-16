import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStats } from '../hooks/useStats';
import { useAuth } from '../hooks/useAuth';
import { AlertTriangle, ChevronLeft } from 'lucide-react';
import { GithubCard } from '../components/profile/stats/GithubCard';
import { LeetcodeCard } from '../components/profile/stats/LeetcodeCard';
import { ResumeStats } from '../components/profile/stats/ResumeStats';

export const Stats = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { fetchStats, getStatsForUser } = useStats();

  // This now only fetches basicStats (usernames) from StatsContext
  const { data: stats, loading, error } = getStatsForUser(userId);

  const isOwnStats = user?.id === userId;

  useEffect(() => {
    if (userId) {
      fetchStats(userId);
    }
  }, [userId, fetchStats]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto pb-20 pt-4 animate-in fade-in zoom-in-95 duration-300 relative">
        <div className="w-48 h-10 bg-zinc-800 rounded-xl mb-2 animate-pulse" />
        <div className="w-64 h-4 bg-zinc-800 rounded mb-10 animate-pulse" />

        {/* Placeholder layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="w-full h-[400px] bg-zinc-900/50 rounded-[2rem] border border-zinc-800/50 animate-pulse" />
          <div className="w-full h-[400px] bg-zinc-900/50 rounded-[2rem] border border-zinc-800/50 animate-pulse" />
        </div>
        
        <div className="w-full h-[800px] bg-zinc-900/50 rounded-[2rem] border border-zinc-800/50 animate-pulse" />
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
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-full font-bold transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 pt-4 animate-in fade-in zoom-in-95 duration-300 relative">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            {isOwnStats ? "Your Coding Stats" : `${stats?.userName}'s Stats`}
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
        <GithubCard userId={userId} isOwnStats={isOwnStats} />
        <LeetcodeCard userId={userId} isOwnStats={isOwnStats} />
      </div>

      <ResumeStats userId={userId} />

    </div>
  );
};

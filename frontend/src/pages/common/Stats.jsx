import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStats } from '../../hooks/common/useStats';
import { useAuth } from '../../hooks/auth/useAuth';
import { AlertTriangle, ChevronLeft, Ban } from 'lucide-react';
import { GithubCard } from '../../components/common/GithubCard';
import { LeetcodeCard } from '../../components/common/LeetcodeCard';
import { ResumeStats } from '../../components/common/ResumeStats';
import api from '../../api/axios';

export const Stats = ({ providedUserId }) => {
  const params = useParams();
  const userId = providedUserId || params.userId;
  const navigate = useNavigate();
  const { user } = useAuth();

  const { fetchStats, getStatsForUser } = useStats();

  // This now only fetches basicStats (usernames) from StatsContext
  const { data: stats, loading, error } = getStatsForUser(userId);

  const isOwnStats = user?.id === userId;

  const [confirmBlock, setConfirmBlock] = useState(false);
  const [isTogglingBlock, setIsTogglingBlock] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchStats(userId);
    }
  }, [userId, fetchStats]);

  const handleToggleBlock = async () => {
    setIsTogglingBlock(true);
    try {
      const res = await api.put(`/user/toggle-block/${userId}`);
      if (res.data.success) {
        fetchStats(userId, true); // Force refresh to get new isActive status
        setConfirmBlock(false);
      }
    } catch (err) {
      console.error('Failed to toggle block status:', err);
    } finally {
      setIsTogglingBlock(false);
    }
  };

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
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
            {isOwnStats ? "Your Coding Stats" : `${stats?.userName}'s Stats`}
            {user?.role === 'ADMIN' && stats && !stats.isActive && (
              <span className="text-sm font-medium bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20">
                Blocked
              </span>
            )}
          </h1>
          <p className="text-zinc-400">
            {isOwnStats ? "A snapshot of your coding footprint across the web." : `Viewing ${stats?.userName || 'student'}'s coding footprint.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'ADMIN' && stats && (
            <button
              onClick={() => setConfirmBlock(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !stats.isActive
                  ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500'
              }`}
              title="Toggle student block status"
            >
              <Ban className="w-4 h-4" />
              {!stats.isActive ? 'Unblock' : 'Block'}
            </button>
          )}

          {!isOwnStats && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GithubCard userId={userId} isOwnStats={isOwnStats} />
        <LeetcodeCard userId={userId} isOwnStats={isOwnStats} />
      </div>

      <ResumeStats userId={userId} />

      {/* Confirmation Modal */}
      {confirmBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2">
              Confirm Action
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              Are you sure you want to {!stats.isActive ? 'unblock' : 'block'} this student?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmBlock(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                disabled={isTogglingBlock}
              >
                Cancel
              </button>
              <button 
                onClick={handleToggleBlock}
                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors disabled:opacity-50"
                disabled={isTogglingBlock}
              >
                {isTogglingBlock ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

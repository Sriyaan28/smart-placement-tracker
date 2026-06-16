import React, { useEffect, useState } from 'react';
import { getLeetcodeStats } from '../../../api/userApi';
import { Code2, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LeetcodeCard = ({ userId, isOwnStats }) => {
  const navigate = useNavigate();
  const [leetcode, setLeetcode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getLeetcodeStats(userId);
        if (res.success) {
          setLeetcode(res.payload);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("LeetCode profile not linked.");
        } else {
          setError("Failed to load LeetCode stats.");
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
        <div className="flex justify-between mb-10">
          <div className="flex flex-col gap-2">
            <div className="w-32 h-6 rounded bg-zinc-800" />
            <div className="w-24 h-4 rounded bg-zinc-800" />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="w-12 h-10 rounded bg-zinc-800" />
            <div className="w-20 h-3 rounded bg-zinc-800" />
          </div>
        </div>
        <div className="space-y-4 mt-auto">
          <div className="h-6 rounded bg-zinc-800" />
          <div className="h-6 rounded bg-zinc-800" />
          <div className="h-6 rounded bg-zinc-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:border-emerald-900/50 transition-colors h-full flex flex-col">
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

      <div className="relative z-10 flex-1 flex flex-col justify-between">
        {error ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            {error === "LeetCode profile not linked." ? (
              <>
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
              </>
            ) : (
              <>
                <AlertTriangle className="w-12 h-12 mb-3 text-zinc-500 opacity-20" />
                <p className="text-zinc-500">{error}</p>
              </>
            )}
          </div>
        ) : leetcode ? (
          <>
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

            <div className="space-y-4 mt-auto">
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
          </>
        ) : null}
      </div>
    </div>
  );
};

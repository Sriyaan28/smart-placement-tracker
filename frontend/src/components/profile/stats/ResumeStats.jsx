import React, { useEffect, useState } from 'react';
import { getResumeStats } from '../../../api/userApi';
import { ReadOnlyResume } from '../ReadOnlyResume';

export const ResumeStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getResumeStats(userId);
        if (res.success) {
          setStats(res.payload);
        }
      } catch (err) {
        console.error("Failed to load resume stats", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full h-[800px] bg-zinc-900/50 rounded-3xl border border-zinc-800/50 animate-pulse mt-8" />
    );
  }

  if (!stats?.resumeUrl && !stats?.parsedResume) {
    return null;
  }

  return (
    <div className="mt-8">
      <ReadOnlyResume 
        resumeUrl={stats.resumeUrl} 
        parsedResume={stats.parsedResume} 
      />
    </div>
  );
};

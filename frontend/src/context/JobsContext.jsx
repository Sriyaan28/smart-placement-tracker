import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllJobs } from '../api/jobApi';
import { useAuth } from '../hooks/useAuth';

export const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetched, setLastFetched] = useState(null);

  const fetchJobs = useCallback(async (force = false) => {
    // Only fetch if forced or if we haven't fetched in the last 5 minutes
    const now = Date.now();
    if (!force && lastFetched && (now - lastFetched < 5 * 60 * 1000) && jobs.length > 0) {
      // Refresh silently in background if needed, but return immediately
      backgroundFetch();
      return;
    }

    setLoading(true);
    await backgroundFetch();
  }, [lastFetched, jobs.length]);

  const backgroundFetch = async () => {
    try {
      setError('');
      const res = await getAllJobs();
      if (res.success) {
        setJobs(res.payload);
        setLastFetched(Date.now());
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      if (jobs.length === 0) {
        setError("Failed to load jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'STUDENT') {
      fetchJobs();
    }
  }, [user, fetchJobs]);

  return (
    <JobsContext.Provider value={{ jobs, loading, error, refreshJobs: () => fetchJobs(true) }}>
      {children}
    </JobsContext.Provider>
  );
};

import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { getMyApplications } from '../../api/jobApi';
import { useAuth } from '../../hooks/auth/useAuth';

export const ApplicationsContext = createContext();

export const ApplicationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const lastFetchedRef = useRef(null);
  const applicationsLengthRef = useRef(0);

  const backgroundFetch = useCallback(async () => {
    try {
      setError('');
      const res = await getMyApplications();
      if (res.success) {
        setApplications(res.payload);
        lastFetchedRef.current = Date.now();
        applicationsLengthRef.current = res.payload.length;
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      if (applicationsLengthRef.current === 0) {
        setError("Failed to load applications.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async (force = false) => {
    const now = Date.now();
    const lastFetched = lastFetchedRef.current;
    const appLength = applicationsLengthRef.current;

    if (!force && lastFetched && (now - lastFetched < 5 * 60 * 1000) && appLength > 0) {
      // Prevent infinite loops by debouncing the silent refresh (e.g. 10 seconds)
      if (now - lastFetched > 10000) {
        backgroundFetch();
      }
      return;
    }

    setLoading(true);
    await backgroundFetch();
  }, [backgroundFetch]);

  useEffect(() => {
    if (user && user.role === 'STUDENT') {
      fetchApplications();
    } else if (!user) {
      setApplications([]);
      lastFetchedRef.current = null;
      applicationsLengthRef.current = 0;
    }
  }, [user, fetchApplications]);

  return (
    <ApplicationsContext.Provider value={{ applications, loading, error, fetchApplications, refreshApplications: () => fetchApplications(true) }}>
      {children}
    </ApplicationsContext.Provider>
  );
};

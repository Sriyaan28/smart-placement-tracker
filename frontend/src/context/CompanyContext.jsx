import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getJobsByCompany } from '../api/jobApi';
import { getAllCompanyApplications } from '../api/companyApi';
import { useAuth } from '../hooks/useAuth';

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const { user } = useAuth();

  // --- Company Jobs State ---
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetched, setLastFetched] = useState(null);

  // --- Company Applications State ---
  const [companyApplications, setCompanyApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState('');
  const appsLastFetchedRef = useRef(null);
  const appsLengthRef = useRef(0);

  // ========== JOBS ==========
  const fetchCompanyJobs = useCallback(async (force = false) => {
    if (!user || user.role !== 'COMPANY') return;

    // Only fetch if forced or if we haven't fetched in the last 5 minutes
    const now = Date.now();
    if (!force && lastFetched && (now - lastFetched < 5 * 60 * 1000) && companyJobs.length > 0) {
      backgroundFetch();
      return;
    }

    setLoading(true);
    await backgroundFetch();
  }, [user, lastFetched, companyJobs.length]);

  const backgroundFetch = async () => {
    try {
      setError('');
      const res = await getJobsByCompany(user.id);
      if (res.success) {
        setCompanyJobs(res.payload || []);
        setLastFetched(Date.now());
      }
    } catch (err) {
      console.error("Failed to fetch company jobs:", err);
      // Backend returns 404 if no jobs found, which is not strictly an error for UI
      if (err.response && err.response.status === 404) {
        setCompanyJobs([]);
      } else {
        if (companyJobs.length === 0) {
          setError("Failed to load jobs");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // ========== APPLICATIONS ==========
  const backgroundFetchApps = useCallback(async () => {
    try {
      setAppsError('');
      const res = await getAllCompanyApplications();
      if (res.success) {
        setCompanyApplications(res.payload);
        appsLastFetchedRef.current = Date.now();
        appsLengthRef.current = res.payload.length;
      }
    } catch (err) {
      console.error("Failed to fetch company applications:", err);
      if (appsLengthRef.current === 0) {
        setAppsError("Failed to load applications.");
      }
    } finally {
      setAppsLoading(false);
    }
  }, []);

  const fetchCompanyApplications = useCallback(async (force = false) => {
    const now = Date.now();
    const lastFetchedApps = appsLastFetchedRef.current;
    const appLength = appsLengthRef.current;

    if (!force && lastFetchedApps && (now - lastFetchedApps < 5 * 60 * 1000) && appLength > 0) {
      // Silently refresh in background if stale enough (10s debounce)
      if (now - lastFetchedApps > 10000) {
        backgroundFetchApps();
      }
      return;
    }

    setAppsLoading(true);
    await backgroundFetchApps();
  }, [backgroundFetchApps]);

  // ========== EFFECTS ==========
  useEffect(() => {
    if (user && user.role === 'COMPANY') {
      fetchCompanyJobs();
      fetchCompanyApplications();
    } else if (!user) {
      setCompanyJobs([]);
      setCompanyApplications([]);
      appsLastFetchedRef.current = null;
      appsLengthRef.current = 0;
    }
  }, [user, fetchCompanyJobs, fetchCompanyApplications]);

  return (
    <CompanyContext.Provider value={{
      companyJobs, loading, error,
      refreshCompanyJobs: () => fetchCompanyJobs(true),
      companyApplications, appsLoading, appsError,
      refreshCompanyApplications: () => fetchCompanyApplications(true),
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

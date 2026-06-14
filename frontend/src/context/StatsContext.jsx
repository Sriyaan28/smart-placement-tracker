import React, { createContext, useState, useCallback, useRef } from 'react';
import { getCodingStats } from '../api/userApi';

export const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  // Cache structure: { [userId]: { data: {...}, lastFetched: timestamp } }
  const [statsCache, setStatsCache] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const statsCacheRef = useRef({});

  const backgroundFetch = useCallback(async (userId) => {
    try {
      const res = await getCodingStats(userId);
      if (res.success) {
        const now = Date.now();
        statsCacheRef.current[userId] = { data: res.payload, lastFetched: now };
        
        setStatsCache(prev => ({
          ...prev,
          [userId]: { data: res.payload, lastFetched: now }
        }));
        return res.payload;
      } else {
        throw new Error('Failed to load stats');
      }
    } catch (err) {
      let errorMessage = "An error occurred while fetching stats.";
      if (err.response?.status === 403) {
        errorMessage = "You cannot view coding stats for a company account.";
      } else if (err.response?.status === 404) {
        errorMessage = "User not found.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setErrorMap(prev => ({ ...prev, [userId]: errorMessage }));
      return null;
    } finally {
      setLoadingMap(prev => ({ ...prev, [userId]: false }));
    }
  }, []);

  const fetchStats = useCallback(async (userId, force = false) => {
    if (!userId) return null;

    const cached = statsCacheRef.current[userId];
    const now = Date.now();

    // Return cached if not forced and within 5 minutes, but trigger silent refresh
    if (!force && cached && (now - cached.lastFetched < 5 * 60 * 1000)) {
      // Prevent infinite loop by not refreshing if we fetched less than 10 seconds ago
      if (now - cached.lastFetched > 10000) {
        backgroundFetch(userId); // Silent refresh
      }
      return cached.data;
    }

    setLoadingMap(prev => ({ ...prev, [userId]: true }));
    setErrorMap(prev => ({ ...prev, [userId]: '' }));

    return await backgroundFetch(userId);
  }, [backgroundFetch]);

  const getStatsForUser = useCallback((userId) => {
    return {
      data: statsCache[userId]?.data || null,
      loading: loadingMap[userId] || false,
      error: errorMap[userId] || '',
    };
  }, [statsCache, loadingMap, errorMap]);

  return (
    <StatsContext.Provider value={{ fetchStats, getStatsForUser }}>
      {children}
    </StatsContext.Provider>
  );
};

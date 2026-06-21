import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../../api/axios';

const AdminReportsContext = createContext();

export const AdminReportsProvider = ({ children }) => {
  // Dictionary cache: { 'USER_PENDING': [...], 'JOB_REVIEWED': [...] }
  const [reportsCache, setReportsCache] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Keep track of the active tab and status across navigations
  const [activeTab, setActiveTab] = useState('USER');
  const [statusFilter, setStatusFilter] = useState('PENDING');

  const fetchReports = useCallback(async (targetType, status, forceRefresh = false) => {
    const cacheKey = `${targetType}_${status}`;
    const hasCachedData = reportsCache[cacheKey] !== undefined;

    // Only show loading skeleton on first visit to this specific tab/status combination
    if (!hasCachedData || forceRefresh) {
      setLoading(true);
    }

    try {
      const res = await api.get(`/report/all?targetType=${targetType}&status=${status}`);
      if (res.data.success) {
        setReportsCache(prev => ({
          ...prev,
          [cacheKey]: res.data.payload
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch reports for ${cacheKey}:`, err);
    } finally {
      if (!hasCachedData || forceRefresh) {
        setLoading(false);
      }
    }
  }, [reportsCache]);

  const invalidateReportCache = useCallback(() => {
    // Completely wipe the cache so next visit fetches fresh data
    setReportsCache({});
  }, []);

  return (
    <AdminReportsContext.Provider value={{
      reportsCache,
      loading,
      activeTab,
      setActiveTab,
      statusFilter,
      setStatusFilter,
      fetchReports,
      invalidateReportCache
    }}>
      {children}
    </AdminReportsContext.Provider>
  );
};

export const useAdminReports = () => {
  return useContext(AdminReportsContext);
};

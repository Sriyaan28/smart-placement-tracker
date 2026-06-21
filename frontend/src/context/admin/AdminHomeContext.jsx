import React, { createContext, useState, useEffect } from 'react';
import api from '../../api/axios';

export const AdminHomeContext = createContext();

export const AdminHomeProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    // We do NOT set loading to true unconditionally here,
    // so that when we navigate back to AdminHome it can fetch silently
    // in the background without causing a UI flash, giving a "cached" feel.
    setError('');
    try {
      const res = await api.get('/user/users');
      if (res.data.success) {
        setStudents(res.data.payload.students);
        setCompanies(res.data.payload.companies);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminHomeContext.Provider value={{ students, companies, loading, error, fetchUsers }}>
      {children}
    </AdminHomeContext.Provider>
  );
};

import { useContext } from 'react';
import { AdminHomeContext } from '../../context/admin/AdminHomeContext';

export const useAdminHome = () => {
  const context = useContext(AdminHomeContext);
  if (!context) {
    throw new Error('useAdminHome must be used within an AdminHomeProvider');
  }
  return context;
};

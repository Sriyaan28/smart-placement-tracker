import { useContext } from 'react';
import { StatsContext } from '../../context/common/StatsContext';

export const useStats = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

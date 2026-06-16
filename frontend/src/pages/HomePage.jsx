import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { StudentHome } from './StudentHome';
import { CompanyHome } from './CompanyHome';

export const HomePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {user.role === 'STUDENT' && <StudentHome />}
      {user.role === 'COMPANY' && <CompanyHome />}
      {/* Fallbacks can be added for Admin */}
    </>
  );
};

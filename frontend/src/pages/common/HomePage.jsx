import React from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { StudentHome } from '../student/StudentHome';
import { CompanyHome } from '../company/CompanyHome';

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

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { Loading } from '../components/utils/Loading';

// Import Role Views
import { StudentProfileView } from '../components/profile/student/StudentProfileView';
import { CompanyProfileView } from '../components/profile/company/CompanyProfileView';
import { AdminProfileView } from '../components/profile/admin/AdminProfileView';

export const ProfilePage = () => {
  const { profile, loadingProfile, profileError } = useProfile();

  if (loadingProfile) {
    return <Loading />;
  }

  if (profileError || !profile) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
        <p className="text-zinc-400">{profileError || "Failed to load profile"}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      {profile.role === 'STUDENT' && <StudentProfileView />}
      {profile.role === 'COMPANY' && <CompanyProfileView />}
      {profile.role === 'ADMIN' && <AdminProfileView />}
    </div>
  );
};

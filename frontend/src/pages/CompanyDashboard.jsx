import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const CompanyDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-white">Company Dashboard</h2>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Welcome, {user.name}!</h3>
        <p className="text-slate-400">Manage your job postings and review applications from top students.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col items-center justify-center min-h-[200px]">
          <h3 className="text-xl font-bold text-slate-300 mb-2">Active Jobs</h3>
          <p className="text-4xl font-black text-blue-400">0</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition">Post a Job</button>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col items-center justify-center min-h-[200px]">
          <h3 className="text-xl font-bold text-slate-300 mb-2">Total Applications</h3>
          <p className="text-4xl font-black text-blue-400">0</p>
          <button className="mt-4 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition">Review Applications</button>
        </div>
      </div>
    </div>
  );
};

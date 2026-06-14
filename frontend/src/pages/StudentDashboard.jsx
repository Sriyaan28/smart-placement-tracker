import React, { useEffect, useState } from 'react';
import { getMyApplications } from '../api/jobApi';
import { useAuth } from '../hooks/useAuth';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getMyApplications();
        if (data.success) {
          setApplications(data.payload);
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-white">Student Dashboard</h2>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Welcome, {user.name}!</h3>
        <p className="text-slate-400 mb-4">View your active job applications and resume status below.</p>
      </div>

      <h3 className="text-2xl font-bold mb-4 text-white">My Applications</h3>
      {loading ? (
        <p className="text-slate-400">Loading applications...</p>
      ) : applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map(app => (
            <div key={app._id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
              <h4 className="text-lg font-bold text-white mb-2">{app.jobId?.title || 'Unknown Job'}</h4>
              <p className="text-sm text-slate-400 mb-2">Status: <span className="text-blue-400 font-semibold">{app.status}</span></p>
              <p className="text-sm text-slate-500">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 bg-slate-800 p-4 rounded-lg border border-slate-700">You haven't applied to any jobs yet.</p>
      )}
    </div>
  );
};

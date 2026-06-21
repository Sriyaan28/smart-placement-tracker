import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileWarning, CheckCircle2, XCircle, Trash2, ShieldAlert } from 'lucide-react';
import api from '../../api/axios';

export const AdminJobAnalytics = ({ jobId }) => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/user/admin/job-analytics/${jobId}`);
        if (res.data.success) {
          setAnalytics(res.data.payload);
        }
      } catch (err) {
        setError('Failed to load admin analytics');
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchAnalytics();
  }, [jobId]);

  const handleDeleteJob = async () => {
    setIsDeleting(true);
    try {
      const res = await api.delete(`/company/deletejob/${jobId}`);
      if (res.data.success) {
        navigate('/home/search');
      }
    } catch (err) {
      console.error('Failed to delete job:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 w-72 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 rounded bg-zinc-800" />
          <div className="w-24 h-4 rounded bg-zinc-800" />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="h-16 bg-zinc-800/50 rounded-xl" />
          <div className="h-16 bg-zinc-800/50 rounded-xl" />
        </div>
        <div className="h-16 bg-zinc-800/50 rounded-xl mb-4" />
        <div className="h-10 bg-zinc-800 rounded-xl" />
      </div>
    );
  }

  if (error || !analytics) return null;

  const reportPercentage = analytics.totalApplications > 0 
    ? Math.round((analytics.totalReports / analytics.totalApplications) * 100) 
    : 0;

  return (
    <>
      <div className="flex flex-col bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 w-72 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 z-20">
        
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/50">
          <h3 className="text-zinc-300 font-bold text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            Admin Tools
          </h3>
        </div>

        <div className="space-y-2 mb-4">
          {/* Reports Card */}
          <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-3 flex flex-col justify-center items-center group relative cursor-help">
            <FileWarning className="w-5 h-5 text-yellow-500 mb-1" />
            <span className="text-xl font-black text-white">{analytics.totalReports}</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Reports</span>
            
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg shadow-xl border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Reported by {reportPercentage}% of {analytics.totalApplications} applicants
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Accepted Card */}
            <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-3 flex flex-col justify-center items-center group relative cursor-help">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
              <span className="text-lg font-black text-white">{analytics.totalAccepted}</span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Accepted</span>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg shadow-xl border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Total accepted candidates
              </div>
            </div>

            {/* Rejected Card */}
            <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-3 flex flex-col justify-center items-center group relative cursor-help">
              <XCircle className="w-4 h-4 text-red-500 mb-1" />
              <span className="text-lg font-black text-white">{analytics.totalRejected}</span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Rejected</span>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg shadow-xl border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Total rejected candidates
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => setConfirmDelete(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-500 hover:text-white rounded-xl text-sm font-bold transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Delete Job
        </button>

      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-2 text-center">
              Force Delete Job
            </h3>
            <p className="text-zinc-400 text-sm mb-8 text-center">
              As an Admin, you are about to permanently delete this job and all its applications. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setConfirmDelete(false)}
                className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteJob}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, Trash2, ExternalLink, User, Briefcase, Calendar, Loader2, ChevronLeft } from 'lucide-react';
import api from '../../api/axios';
import { Stats } from '../common/Stats';
import { JobDetails } from '../common/JobDetails';
import { useAdminReports } from '../../context/admin/AdminReportsContext';

export const AdminReportDetails = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { invalidateReportCache } = useAdminReports();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const res = await api.get(`/report/${reportId}`);
      if (res.data.success) {
        setReport(res.data.payload);
      }
    } catch (err) {
      console.error('Failed to fetch report:', err);
      setError('Report not found or has been deleted.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReviewed = async () => {
    setActionLoading(true);
    try {
      await api.put(`/report/${reportId}/status`, { status: 'REVIEWED' });
      invalidateReportCache(); // Invalidate cache so main dashboard pulls fresh data
      fetchReport();
    } catch (err) {
      console.error('Failed to update report:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeleteReport = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/report/${reportId}`);
      invalidateReportCache(); // Invalidate cache before navigating back
      navigate('/home/reports');
    } catch (err) {
      console.error('Failed to delete report:', err);
      setActionLoading(false);
    }
  };

  // Removed getTargetUrl since we are using components directly

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto pb-20 pt-4 px-4 xl:px-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="w-32 h-6 bg-zinc-800/50 rounded animate-pulse" />
          <div className="w-24 h-8 bg-zinc-800/50 rounded-full animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Details Skeleton */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 animate-pulse" />
                <div className="flex flex-col gap-2">
                  <div className="w-24 h-4 bg-zinc-800/50 rounded animate-pulse" />
                  <div className="w-48 h-6 bg-zinc-800/50 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex gap-4 mb-8">
                <div className="w-24 h-6 bg-zinc-800/50 rounded-full animate-pulse" />
                <div className="w-32 h-6 bg-zinc-800/50 rounded-full animate-pulse" />
              </div>
              <div className="w-full h-40 bg-zinc-800/30 rounded-2xl animate-pulse" />
            </div>
          </div>

          {/* Actions Sidebar Skeleton */}
          <div className="md:col-span-1">
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 h-64 animate-pulse" />
          </div>
        </div>

        {/* Preview Skeleton */}
        <div className="mt-8 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl h-[400px] animate-pulse" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center max-w-md">
          <h3 className="text-xl font-bold mb-2">Error</h3>
          <p>{error || 'Report details not available'}</p>
          <button
            onClick={() => navigate('/home/reports')}
            className="mt-6 px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors"
          >
            Go Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const isUserTarget = report.targetType === 'USER';
  const targetName = report.targetId?.name || report.targetId?.title || 'Unknown Target';

  return (
    <div className="w-full max-w-7xl mx-auto pb-20 pt-4 px-4 xl:px-8 animate-in fade-in zoom-in-95 duration-300">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <button
          onClick={() => navigate('/home/reports')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors self-start md:self-auto"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Reports
        </button>

        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border 
          ${report.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}
        `}>
          Status: {report.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                {isUserTarget ? <User className="w-8 h-8 text-zinc-400" /> : <Briefcase className="w-8 h-8 text-zinc-400" />}
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-semibold uppercase tracking-wider mb-1">Targeted {isUserTarget ? 'User' : 'Job'}</p>
                <h1 className="text-2xl font-black text-white">{targetName}</h1>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <span className="bg-zinc-800 px-3 py-1 rounded-full font-semibold uppercase tracking-wider text-zinc-300 border border-zinc-700">
                  {report.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-sm bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">
                <Calendar className="w-4 h-4" />
                {new Date(report.createdAt).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-zinc-800/50 relative overflow-hidden">
              <ShieldAlert className="absolute -right-6 -top-6 w-32 h-32 text-white/[0.02]" />
              <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Report Details & Reasoning</h4>
              <p className="text-zinc-300 leading-relaxed text-lg italic relative z-10">"{report.reason}"</p>

              <div className="mt-6 pt-4 border-t border-zinc-800/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                  {report.reportedBy?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Submitted by</p>
                  <p className="text-sm font-bold text-zinc-300">{report.reportedBy?.name || 'Unknown User'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 sticky top-8">
            <h3 className="text-lg font-bold text-white mb-4">Moderation Actions</h3>
            <div className="flex flex-col gap-3">



              {report.status === 'PENDING' && (
                <button
                  onClick={handleMarkReviewed}
                  disabled={actionLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {actionLoading ? 'Processing...' : 'Mark as Reviewed'}
                </button>
              )}

              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={actionLoading}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Report
              </button>

            </div>
            <p className="text-xs text-zinc-500 mt-6 text-center">
              Note: Reviewing keeps the report in records, deleting removes it completely.
            </p>
          </div>
        </div>
      </div>

      {/* Target Preview */}
      <div className="mt-8 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden flex flex-col">
        <div className="bg-zinc-800/50 px-6 py-4 border-b border-zinc-700/50 flex items-center justify-between shrink-0">
          <h3 className="text-white font-bold flex items-center gap-2">
            Preview
          </h3>
        </div>
        <div className="flex-1 w-full relative p-4 max-h-[800px] overflow-y-auto custom-scrollbar">
          {report.targetType === 'USER' ? (
            <Stats providedUserId={report.targetId?._id} />
          ) : (
            <JobDetails providedJobId={report.targetId?._id} />
          )}
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2">Delete Report</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Are you sure you want to delete this report permanently? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteReport}
                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors disabled:opacity-50"
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

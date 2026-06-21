import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Briefcase, Eye, MailCheck, ShieldAlert, CheckCircle, Ban, AlertTriangle } from 'lucide-react';
import { Loading } from '../common/Loading';

export const AdminCompanyAnalytics = ({ profile, companyId, onStatusChange }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/user/admin/company-analytics/${companyId}`);
        if (res.data.success) {
          setStats(res.data.payload);
        }
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [companyId]);

  const executeAction = async () => {
    try {
      if (confirmAction === 'VERIFY') {
        await api.put(`/user/toggle-verified/${companyId}`);
      } else if (confirmAction === 'BLOCK') {
        await api.put(`/user/toggle-block/${companyId}`);
      }
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmAction(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-4 w-full animate-pulse flex flex-col justify-center">
        <div className="flex justify-between items-center mb-3 gap-4">
          <div className="w-32 h-6 bg-zinc-800 rounded"></div>
          <div className="flex gap-2">
            <div className="w-20 h-8 bg-zinc-800 rounded-xl"></div>
            <div className="w-20 h-8 bg-zinc-800 rounded-xl"></div>
          </div>
        </div>
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 h-[5.5rem] bg-black/40 rounded-2xl border border-zinc-800/50"></div>
          ))}
          <div className="flex-[1.5] h-[5.5rem] bg-black/40 rounded-2xl border border-zinc-800/50"></div>
        </div>
      </div>
    );
  }
  if (error || !stats) return null;

  const total = stats.totalApplications || 1; // avoid division by zero
  const acceptedRate = ((stats.totalAccepted / total) * 100).toFixed(1);
  const rejectedRate = ((stats.totalRejected / total) * 100).toFixed(1);

  return (
    <>
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-4 w-full animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex justify-between items-center mb-3 gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <h2 className="text-base font-bold text-white">Admin Analytics</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setConfirmAction('VERIFY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                profile.isVerified 
                  ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20' 
                  : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
              }`}
              title="Toggle company verification status"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {profile.isVerified ? 'Unverify' : 'Verify'}
            </button>
            
            <button 
              onClick={() => setConfirmAction('BLOCK')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                !profile.isActive 
                  ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                  : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500'
              }`}
              title="Toggle company block status"
            >
              <Ban className="w-3.5 h-3.5" />
              {!profile.isActive ? 'Unblock' : 'Block'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Simple Stats Cards */}
          <div title="Total number of jobs posted by this company" className="flex-1 bg-black/40 border border-zinc-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors cursor-help min-w-[70px]">
            <Briefcase className="w-5 h-5 text-blue-500 mb-1" />
            <p className="text-xl font-black text-white">{stats.totalJobs}</p>
            <p className="text-[9px] text-zinc-500 font-medium uppercase mt-0.5">Jobs Posted</p>
          </div>
          
          <div title="Total number of applications viewed by this company" className="flex-1 bg-black/40 border border-zinc-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors cursor-help min-w-[70px]">
            <Eye className="w-5 h-5 text-purple-500 mb-1" />
            <p className="text-xl font-black text-white">{stats.totalViewed}</p>
            <p className="text-[9px] text-zinc-500 font-medium uppercase mt-0.5">Viewed</p>
          </div>

          <div title="Total number of applications accepted by this company" className="flex-1 bg-black/40 border border-zinc-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors cursor-help min-w-[70px]">
            <MailCheck className="w-5 h-5 text-emerald-500 mb-1" />
            <p className="text-xl font-black text-white">{stats.totalAccepted}</p>
            <p className="text-[9px] text-zinc-500 font-medium uppercase mt-0.5">Accepted</p>
          </div>

          <div title="Total number of reports filed against jobs from this company" className="flex-1 bg-black/40 border border-zinc-800/50 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:border-zinc-700 transition-colors cursor-help min-w-[70px]">
            <AlertTriangle className="w-5 h-5 text-amber-500 mb-1" />
            <p className="text-xl font-black text-white">{stats.totalReports}</p>
            <p className="text-[9px] text-zinc-500 font-medium uppercase mt-0.5">Reports</p>
          </div>

          {/* Donut Chart */}
          <div title={`${acceptedRate}% Accepted | ${rejectedRate}% Rejected`} className="flex-[1.5] bg-black/40 border border-zinc-800/50 p-3 rounded-2xl flex items-center justify-center gap-3 cursor-help min-w-[140px]">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-lg"
              style={{
                background: `conic-gradient(
                  #10b981 0% ${acceptedRate}%, 
                  #ef4444 ${acceptedRate}% ${Number(acceptedRate) + Number(rejectedRate)}%, 
                  #27272a ${Number(acceptedRate) + Number(rejectedRate)}% 100%
                )`
              }}
            >
              <div className="w-12 h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center flex-col">
                <span className="text-xs font-bold text-white">{acceptedRate}%</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] text-zinc-400 font-medium uppercase tracking-wider">Accepted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[9px] text-zinc-400 font-medium uppercase tracking-wider">Rejected</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-[90%] max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2">
              Confirm Action
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              Are you sure you want to {confirmAction === 'VERIFY' ? (profile.isVerified ? 'unverify' : 'verify') : (profile.isActive ? 'block' : 'unblock')} this company?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeAction}
                className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors ${
                  confirmAction === 'BLOCK' 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

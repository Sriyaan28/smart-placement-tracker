import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, Trash2, ExternalLink, User, Briefcase, Calendar, Loader2, FileText, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useAdminReports } from '../../context/admin/AdminReportsContext';

export const AdminReports = () => {
  const navigate = useNavigate();
  
  const {
    reportsCache,
    loading,
    activeTab,
    setActiveTab,
    statusFilter,
    setStatusFilter,
    fetchReports
  } = useAdminReports();

  const cacheKey = `${activeTab}_${statusFilter}`;
  const reports = reportsCache[cacheKey] || [];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
    fetchReports(activeTab, statusFilter);
  }, [activeTab, statusFilter, fetchReports]);

  const navigateToDetails = (reportId) => {
    navigate(`/home/report/${reportId}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReports = reports.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'REVIEWED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-500" />
          Reports Dashboard
        </h1>
        <p className="text-zinc-400">Review and moderate reported users and job postings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        {/* Main Tabs */}
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-1 rounded-full flex items-center relative w-fit">
          <div
            className="absolute top-1 bottom-1 w-[200px] bg-zinc-800 rounded-full shadow-sm transition-all duration-300 ease-in-out"
            style={{
              left: '4px',
              transform: `translateX(${activeTab === 'USER' ? 0 : 200}px)`
            }}
          />

          <button
            onClick={() => setActiveTab('USER')}
            className={`relative z-10 w-[200px] py-2.5 text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'USER' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <User className="w-4 h-4" /> User Reports
          </button>

          <button
            onClick={() => setActiveTab('JOB')}
            className={`relative z-10 w-[200px] py-2.5 text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'JOB' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Job Reports
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
              statusFilter === 'PENDING' 
                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('REVIEWED')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
              statusFilter === 'REVIEWED' 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                : 'bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            Reviewed
          </button>
        </div>
      </div>

      {/* Reports Content */}
      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/50">
                <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Target</th>
                <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</th>
                <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                // Skeleton Rows
                [...Array(5)].map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td className="p-5"><div className="h-5 bg-zinc-800/80 rounded w-48"></div></td>
                    <td className="p-5"><div className="h-6 bg-zinc-800/80 rounded-full w-24"></div></td>
                    <td className="p-5"><div className="h-5 bg-zinc-800/80 rounded w-32"></div></td>
                    <td className="p-5"><div className="h-6 bg-zinc-800/80 rounded-full w-20"></div></td>
                    <td className="p-5 text-right flex justify-end"><div className="h-9 bg-zinc-800/80 rounded-full w-28"></div></td>
                  </tr>
                ))
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">All Clear!</h2>
                      <p className="text-zinc-400 max-w-md mx-auto">
                        There are no {statusFilter.toLowerCase()} {activeTab === 'USER' ? 'user' : 'job'} reports to show at this time.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                  currentReports.map((report) => (
                    <tr 
                      key={report._id} 
                      onClick={() => navigateToDetails(report._id)}
                      className="hover:bg-zinc-800/20 transition-colors group cursor-pointer"
                    >
                      <td className="p-5 align-middle">
                        <span className="font-bold text-white block">
                          {report.targetId?.name || report.targetId?.title || 'Unknown Target'}
                        </span>
                      </td>
                      <td className="p-5 align-middle">
                        <span className="bg-zinc-800 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider text-zinc-300">
                          {report.category}
                        </span>
                      </td>
                      <td className="p-5 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(report.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="p-5 align-middle">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="p-5 align-middle text-right">
                        <button
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 rounded-full text-sm font-bold transition-colors"
                        >
                          Review
                          <ChevronRightIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl">
              <p className="text-sm text-zinc-400">
                Showing <span className="font-bold text-white">{startIndex + 1}</span> to <span className="font-bold text-white">{Math.min(startIndex + itemsPerPage, reports.length)}</span> of <span className="font-bold text-white">{reports.length}</span> entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1 hidden sm:flex">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-blue-600 text-white border-transparent' 
                          : 'bg-transparent text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-800'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
      )}
    </div>
  );
};

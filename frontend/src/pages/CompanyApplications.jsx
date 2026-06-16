import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../hooks/useCompany';
import { Search, Filter, ChevronRight, FileText, Calendar, Loader2, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';

export const CompanyApplications = () => {
  const navigate = useNavigate();
  const { companyJobs, companyApplications, appsLoading, appsError, refreshCompanyApplications } = useCompany();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedJob, selectedStatus, searchQuery]);

  // Trigger a background refresh when the page mounts
  useEffect(() => {
    refreshCompanyApplications();
  }, []);

  const getPriority = (app) => {
    // Action Required
    if (app.status === 'APPLIED') return 1;
    if (app.status === 'INTERVIEW') return 2;
    if (!app.emailSent && (app.status === 'SELECTED' || app.status === 'REJECTED')) return 3;
    
    // Action Completed (Email Sent)
    if (app.emailSent && app.status === 'SELECTED') return 4;
    if (app.emailSent && app.status === 'REJECTED') return 5;
    
    return 6;
  };

  const filteredApplications = companyApplications
    .filter(app => {
      const matchJob = selectedJob === 'ALL' || String(app.jobId?._id || app.jobId) === String(selectedJob);
      let matchStatus = true;
      if (selectedStatus === 'EMAILED') {
        matchStatus = app.emailSent;
      } else if (selectedStatus === 'NOT_EMAILED') {
        matchStatus = !app.emailSent;
      } else if (selectedStatus !== 'ALL') {
        matchStatus = app.status === selectedStatus;
      }
      return matchJob && matchStatus;
    })
    .filter(app => {
      if (!searchQuery.trim()) return true;
      return app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const priorityA = getPriority(a);
      const priorityB = getPriority(b);
      
      // First sort by action priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      // Then sort by date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'INTERVIEW': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'SELECTED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  if (appsLoading && companyApplications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Job Applications</h1>
          <p className="text-zinc-400">Manage all incoming applications across your active jobs.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full sm:w-48 bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-500 transition-colors appearance-none"
            >
              <option value="ALL">All Jobs</option>
              {companyJobs?.map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-48 bg-zinc-900 border border-zinc-800 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-500 transition-colors appearance-none"
            >
              <option value="ALL">All Status</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
              <option value="NOT_EMAILED">Mail Pending</option>
              <option value="EMAILED">Mail Sent</option>
            </select>
          </div>
        </div>
      </div>

      {appsError ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-center">
          {appsError}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 text-center">
          <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No applications found</h3>
          <p className="text-zinc-500">Try adjusting your filters or wait for more students to apply.</p>
        </div>
      ) : (
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Applicant</th>
                  <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Job Role</th>
                  <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Applied Date</th>
                  <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="p-5 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {currentApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="p-5">
                      <span className="font-semibold text-white">{app.user?.name || 'Unknown User'}</span>
                    </td>
                    <td className="p-5">
                      <span className="text-zinc-300">{app.jobTitle || 'Unknown Job'}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(app.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => navigate(`/home/company-application/${app._id}`)}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 font-bold text-sm rounded-full transition-colors ${
                          app.emailSent 
                            ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border border-blue-500/20' 
                            : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                      >
                        {app.emailSent ? 'Reviewed' : 'Review'}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-2xl">
          <p className="text-sm text-zinc-400">
            Showing <span className="font-bold text-white">{startIndex + 1}</span> to <span className="font-bold text-white">{Math.min(startIndex + itemsPerPage, filteredApplications.length)}</span> of <span className="font-bold text-white">{filteredApplications.length}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
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

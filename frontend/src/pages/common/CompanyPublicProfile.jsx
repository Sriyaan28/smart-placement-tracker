import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyPublicProfile } from '../../api/userApi';
import { getJobsByCompany } from '../../api/jobApi';
import { Mail, Building2, Link as LinkIcon, ChevronLeft, ChevronRight, AlertCircle, MapPin, IndianRupee, Clock, Briefcase, BadgeCheck } from 'lucide-react';
import { Loading } from '../../components/common/Loading';
import { useAuth } from '../../hooks/auth/useAuth';
import { AdminCompanyAnalytics } from '../../components/admin/AdminCompanyAnalytics';

const LinkedinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const CompanyPublicProfile = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState('');

  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const fetchCompanyProfileAndJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCompanyPublicProfile(companyId);
      if (res.success) {
        setProfile(res.payload);
      } else {
        setError(res.message || 'Failed to load company profile.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching company details.');
    } finally {
      setLoading(false);
    }

    // Fetch jobs asynchronously
    setLoadingJobs(true);
    setJobsError('');
    try {
      const jobsRes = await getJobsByCompany(companyId);
      if (jobsRes.success) {
        setJobs(jobsRes.payload);
      } else {
        setJobsError(jobsRes.message || 'Failed to load jobs.');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setJobs([]); // No jobs found, which is fine
      } else {
        setJobsError('An error occurred while fetching jobs.');
      }
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchCompanyProfileAndJobs();
  }, [companyId]);

  const handleProfileRefresh = async () => {
    try {
      const res = await getCompanyPublicProfile(companyId);
      if (res.success) setProfile(res.payload);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto pb-20 pt-4 px-4 xl:px-8 animate-in fade-in duration-500">
        <div className="w-24 h-8 bg-zinc-800/50 rounded-full animate-pulse mb-8" />
        <div className="mb-8">
          <div className="w-64 h-8 bg-zinc-800/50 rounded animate-pulse mb-2" />
          <div className="w-48 h-4 bg-zinc-800/50 rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-zinc-800/50 animate-pulse mb-4" />
              <div className="w-32 h-6 bg-zinc-800/50 rounded animate-pulse mb-4" />
              <div className="w-24 h-4 bg-zinc-800/50 rounded animate-pulse mb-4" />
              <div className="w-full h-px bg-zinc-800 my-4" />
              <div className="w-full space-y-4">
                <div className="w-full h-5 bg-zinc-800/50 rounded animate-pulse" />
                <div className="w-3/4 h-5 bg-zinc-800/50 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-8">
              <div className="w-32 h-6 bg-zinc-800/50 rounded animate-pulse mb-6" />
              <div className="space-y-3">
                <div className="w-full h-4 bg-zinc-800/50 rounded animate-pulse" />
                <div className="w-full h-4 bg-zinc-800/50 rounded animate-pulse" />
                <div className="w-5/6 h-4 bg-zinc-800/50 rounded animate-pulse" />
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-8 overflow-hidden">
              <div className="w-48 h-6 bg-zinc-800/50 rounded animate-pulse mb-6" />
              <div className="flex gap-4">
                <div className="w-72 h-48 bg-zinc-800/50 rounded-2xl animate-pulse shrink-0" />
                <div className="w-72 h-48 bg-zinc-800/50 rounded-2xl animate-pulse shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-zinc-400 mb-8">{error || 'Company not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-full transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 animate-in fade-in duration-500 relative">

      {/* Absolute positioned Admin Analytics to fill empty right space without pushing content down */}
      {user?.role === 'ADMIN' && (
        <div className="hidden lg:block absolute -top-4 right-0 w-[550px] xl:w-[620px] z-10">
          <AdminCompanyAnalytics
            profile={profile}
            companyId={companyId}
            onStatusChange={handleProfileRefresh}
          />
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group relative z-20 w-fit"
      >
        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-zinc-600 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </div>
        <span className="font-medium">Back</span>
      </button>

      <div className="mb-8 w-fit relative z-20">
        <h1 className="text-3xl font-black text-white mb-2">Company Profile</h1>
        <p className="text-zinc-400">View public details about {profile.name}.</p>
      </div>

      {/* Mobile view for Admin Analytics */}
      {user?.role === 'ADMIN' && (
        <div className="block lg:hidden mb-8">
          <AdminCompanyAnalytics
            profile={profile}
            companyId={companyId}
            onStatusChange={handleProfileRefresh}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">

        {/* Left Column - Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-4xl mb-4 shadow-inner">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{profile.name}</h2>
              {profile.isVerified && (
                <div className="relative flex items-center group">
                  <BadgeCheck className="w-5 h-5 text-blue-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-3 py-2 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-lg shadow-xl border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 text-center">
                    This company is verified and trusted by our administration.
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-4 flex items-center justify-center gap-1">
              <Building2 className="w-4 h-4" />
              {profile.role?.replace('_', ' ')}
            </p>

            <div className="w-full h-px bg-zinc-800 my-4" />

            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 text-zinc-400">
                <Mail className="w-5 h-5 text-zinc-500" />
                <span className="text-sm truncate">{profile.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Bio & Links */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-4">About Company</h3>
            <p className="text-zinc-400 leading-relaxed min-h-[100px] whitespace-pre-wrap">
              {profile.bio || "No company description provided."}
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white mb-6">Connected Platforms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* LinkedIn */}
              <div className="p-4 rounded-2xl border border-zinc-800 bg-black/50 flex items-center justify-between group hover:border-zinc-700 transition-colors sm:col-span-2">
                <div className="flex items-center gap-3">
                  <LinkedinIcon className="w-6 h-6 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                  <div>
                    <p className="text-sm text-zinc-500">LinkedIn</p>
                    <p className="text-white font-medium truncate max-w-[250px]">{profile.linkedinUrl || 'Not connected'}</p>
                  </div>
                </div>
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 bg-blue-500/10 p-2 rounded-full">
                    <LinkIcon className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Jobs Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">More jobs from {profile.name}</h2>

          {!loadingJobs && !jobsError && jobs.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {loadingJobs ? (
          <div className="flex gap-6 overflow-x-hidden">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-3xl min-w-[300px] w-[300px] h-[300px] animate-pulse" />
            ))}
          </div>
        ) : jobsError ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
            {jobsError}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-3xl text-center text-zinc-400">
            This company hasn't posted any other jobs yet.
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 hide-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {jobs.map(job => (
              <div
                key={job._id || job.id}
                onClick={() => navigate(`/home/job/${job._id || job.id}`)}
                className="min-w-[300px] w-[300px] bg-zinc-900/40 border border-zinc-800/50 hover:border-blue-500/30 p-6 rounded-3xl transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.05)] hover:-translate-y-1 cursor-pointer flex flex-col gap-4 group snap-start shrink-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-700">
                    <span className="text-xl font-bold text-blue-500">
                      {profile.name?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">
                    {job.jobType?.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-xl group-hover:text-blue-400 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-zinc-400 mt-1 font-medium text-sm">
                    <Building2 className="w-4 h-4" />
                    <span className="truncate">{profile.name}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-zinc-500 mt-auto pt-4 border-t border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span className="truncate">{job.location?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-zinc-400" />
                    <span className="truncate">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span className="truncate">{job.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

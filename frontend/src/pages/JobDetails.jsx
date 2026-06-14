import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobDetails, applyForJob } from '../api/jobApi';
import { MapPin, IndianRupee, Clock, Briefcase, Building2, ChevronLeft, CalendarDays, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  
  // Track if user has applied natively on frontend as well to update UI immediately
  const [hasAppliedLocally, setHasAppliedLocally] = useState(false);
  const [applicationId, setApplicationId] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getJobDetails(jobId);
        if (res.success) {
          setJob(res.payload);
          if (res.payload.hasApplied) {
            setHasAppliedLocally(true);
            setApplicationId(res.payload.applicationId);
          }
        } else {
          setError('Failed to load job details.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching job details.');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const handleApply = async () => {
    setApplyLoading(true);
    setApplyError('');
    try {
      const res = await applyForJob(jobId);
      if (res.success) {
        setHasAppliedLocally(true);
        // Res might return application ID in payload
        if (res.payload && res.payload._id) {
          setApplicationId(res.payload._id);
        }
      } else {
        setApplyError(res.message);
      }
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to apply for job.');
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already applied')) {
        setHasAppliedLocally(true);
        setApplyError(''); // Clear error if it's just "already applied" state syncing
      }
    } finally {
      setApplyLoading(false);
    }
  };

  const isApplied = job?.hasApplied || hasAppliedLocally;

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 animate-pulse">
        <div className="w-24 h-8 bg-zinc-800 rounded-lg mb-8" />
        <div className="w-full h-64 bg-zinc-900/50 rounded-3xl mb-8 border border-zinc-800/50" />
        <div className="w-3/4 h-8 bg-zinc-900/50 rounded-lg mb-4" />
        <div className="w-full h-32 bg-zinc-900/50 rounded-lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-zinc-400 mb-8">{error || 'Job not found'}</p>
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
    <div className="w-full max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
      >
        <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-zinc-600 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </div>
        <span className="font-medium">Back</span>
      </button>

      {/* Header Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-8 md:p-10 rounded-[2rem] mb-8 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
          
          <div className="flex gap-6">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center border border-zinc-800 shadow-xl shrink-0">
              <span className="text-4xl font-black text-emerald-500">
                {job.user?.name?.charAt(0) || 'C'}
              </span>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{job.title}</h1>
              <div className="flex items-center gap-2 text-zinc-400 font-medium text-lg mb-4">
                <Building2 className="w-5 h-5" />
                {job.user?.name || 'Company Name'}
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-semibold">
                  {job.jobType?.replace('_', ' ')}
                </span>
                <span className="bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {job.location?.replace('_', ' ')}
                </span>
                <span className="bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4" /> {job.salary}
                </span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-3 mt-4 md:mt-0">
            {user?.role === 'STUDENT' && (
              <div className="flex flex-col items-center w-full md:w-auto">
                {isApplied ? (
                  <button 
                    disabled
                    className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 w-full md:w-48 cursor-default"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Applied
                  </button>
                ) : (
                  <button 
                    onClick={handleApply}
                    disabled={applyLoading}
                    className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] w-full md:w-48 flex items-center justify-center"
                  >
                    {applyLoading ? 'Applying...' : 'Apply Now'}
                  </button>
                )}
                
                {isApplied && applicationId && (
                  <button 
                    onClick={() => navigate(`/home/applications/${applicationId}`)}
                    className="text-zinc-400 hover:text-white text-sm font-medium transition-colors text-center mt-3"
                  >
                    View Application Status
                  </button>
                )}
                
                {applyError && <p className="text-red-400 text-sm text-center mt-2 w-full max-w-[200px]">{applyError}</p>}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col - Description */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-500" />
              Job Description
            </h2>
            <div className="text-zinc-300 leading-relaxed space-y-4 whitespace-pre-wrap">
              {job.description}
            </div>
          </section>

          {job.skills && job.skills.length > 0 && (
            <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-3xl">
              <h2 className="text-xl font-bold text-white mb-6">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="bg-black border border-zinc-800 text-zinc-300 px-4 py-2 rounded-xl text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Col - Additional Info */}
        <div className="space-y-6">
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-3xl space-y-6">
            <h3 className="font-bold text-white mb-2">Job Overview</h3>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-medium">Duration</p>
                <p className="text-white font-medium">{job.duration || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-medium">Experience Needed</p>
                <p className="text-white font-medium">{job.experience ? `${job.experience} Years` : 'Fresher'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                <CalendarDays className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-medium">Posted On</p>
                <p className="text-white font-medium">
                  {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

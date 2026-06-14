import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationById, deleteApplication } from '../api/jobApi';
import { ChevronLeft, Building2, MapPin, IndianRupee, Clock, Briefcase, Calendar, Link as LinkIcon, AlertTriangle, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [showConfirmWithdraw, setShowConfirmWithdraw] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getApplicationById(id);
        if (res.success) {
          setApplication(res.payload);
        } else {
          setError('Failed to load application details.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching application details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplication();
  }, [id]);

  const handleWithdraw = async () => {
    setWithdrawLoading(true);
    try {
      const res = await deleteApplication(id);
      if (res.success) {
        navigate('/home', { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application.');
    } finally {
      setWithdrawLoading(false);
      setShowConfirmWithdraw(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 animate-pulse">
        <div className="w-24 h-8 bg-zinc-800 rounded-lg mb-8" />
        <div className="w-full h-48 bg-zinc-900/50 rounded-3xl mb-8 border border-zinc-800/50" />
        <div className="w-full h-32 bg-zinc-900/50 rounded-2xl mb-8 border border-zinc-800/50" />
        <div className="w-full h-64 bg-zinc-900/50 rounded-3xl" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-zinc-400 mb-8">{error || 'Application not found'}</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-full transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const job = application.jobId;
  const company = job?.user;
  const status = application.status;

  // Status Styling Configuration
  const statusConfig = {
    APPLIED: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Clock },
    INTERVIEW: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Calendar },
    SELECTED: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 },
    REJECTED: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle }
  };
  const StatusIcon = statusConfig[status]?.icon || Clock;

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
      <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] mb-8 relative overflow-hidden flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex gap-6 z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-2xl flex items-center justify-center border border-zinc-800 shadow-xl shrink-0">
            <span className="text-3xl md:text-4xl font-black text-emerald-500">
              {company?.name?.charAt(0) || 'C'}
            </span>
          </div>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">{job?.title}</h1>
            <div className="flex items-center gap-2 text-zinc-400 font-medium mb-2">
              <Building2 className="w-4 h-4" />
              {company?.name || 'Company Name'}
            </div>
            <p className="text-zinc-500 text-sm">
              Applied on {new Date(application.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="z-10 flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig[status]?.bg} ${statusConfig[status]?.border} ${statusConfig[status]?.color}`}>
            <StatusIcon className="w-5 h-5" />
            <span className="font-bold tracking-wide">{status}</span>
          </div>
        </div>
      </div>

      {/* Status Timeline / Details Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* Main Content (Timeline & Interviews) */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Visual Timeline */}
          <section className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-3xl">
            <h2 className="text-xl font-bold text-white mb-8">Application Status</h2>
            
            <div className="relative flex justify-between items-center mb-4">
              {/* Connecting Line Background */}
              <div className="absolute left-0 top-5 w-full h-1 bg-zinc-800 rounded-full z-0 -translate-y-1/2" />
              {/* Connecting Line Active */}
              <div 
                className="absolute left-0 top-5 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-1000 -translate-y-1/2"
                style={{ 
                  width: status === 'APPLIED' ? '0%' : 
                         status === 'INTERVIEW' ? '50%' : 
                         '100%' 
                }}
              />

              {/* Node: Applied */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${
                  status === 'APPLIED' || status === 'INTERVIEW' || status === 'SELECTED' || status === 'REJECTED' 
                  ? 'bg-emerald-500 border-zinc-900 text-black' 
                  : 'bg-zinc-800 border-zinc-900 text-zinc-500'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-white">Applied</span>
              </div>

              {/* Node: Interview */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${
                  status === 'INTERVIEW' || status === 'SELECTED' || status === 'REJECTED'
                  ? 'bg-emerald-500 border-zinc-900 text-black' 
                  : 'bg-zinc-800 border-zinc-900 text-zinc-500'
                }`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <span className={`text-sm font-semibold ${status === 'INTERVIEW' || status === 'SELECTED' || status === 'REJECTED' ? 'text-white' : 'text-zinc-500'}`}>Interview</span>
              </div>

              {/* Node: Decision */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${
                  status === 'SELECTED' ? 'bg-emerald-500 border-zinc-900 text-black' : 
                  status === 'REJECTED' ? 'bg-red-500 border-zinc-900 text-black' :
                  'bg-zinc-800 border-zinc-900 text-zinc-500'
                }`}>
                  {status === 'REJECTED' ? <XCircle className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                </div>
                <span className={`text-sm font-semibold ${status === 'SELECTED' ? 'text-emerald-400' : status === 'REJECTED' ? 'text-red-400' : 'text-zinc-500'}`}>
                  {status === 'SELECTED' ? 'Selected' : status === 'REJECTED' ? 'Rejected' : 'Decision'}
                </span>
              </div>
            </div>
          </section>

          {/* Interview Details (If Any) */}
          {status === 'INTERVIEW' && application.interview && application.interview.length > 0 && (
            <section className="bg-yellow-500/5 border border-yellow-500/20 p-8 rounded-3xl">
              <h2 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Scheduled Interviews
              </h2>
              
              <div className="space-y-4">
                {application.interview.map((intv, idx) => (
                  <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        {intv.date ? new Date(intv.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Clock className="w-4 h-4" />
                        {intv.time || 'Time TBD'}
                      </div>
                    </div>
                    
                    {intv.link && (
                      <a 
                        href={intv.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm justify-center"
                      >
                        <LinkIcon className="w-4 h-4" /> Join Link
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Decision Messages */}
          {status === 'SELECTED' && (
            <section className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-emerald-400 mb-1">Congratulations! 🎉</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  You have been selected for this role! The company will reach out to you via email shortly regarding your offer letter and the next steps.
                </p>
              </div>
            </section>
          )}

          {status === 'REJECTED' && (
            <section className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-red-400 mb-1">Better luck next time!</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Unfortunately, the company has decided to move forward with other candidates at this time. Don't be discouraged—keep applying and expanding your skills!
                </p>
              </div>
            </section>
          )}

        </div>

        {/* Right Col - Job Summary & Actions */}
        <div className="space-y-8">
          
          <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-3xl space-y-6">
            <h3 className="font-bold text-white">Job Summary</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-zinc-800/30 px-4 py-3 rounded-xl border border-zinc-800/50">
                <Briefcase className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Type</p>
                  <p className="text-sm text-zinc-300 font-medium">{job?.jobType?.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-zinc-800/30 px-4 py-3 rounded-xl border border-zinc-800/50">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Location</p>
                  <p className="text-sm text-zinc-300 font-medium">{job?.location?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-zinc-800/30 px-4 py-3 rounded-xl border border-zinc-800/50">
                <IndianRupee className="w-4 h-4 text-emerald-500" />
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Salary</p>
                  <p className="text-sm text-zinc-300 font-medium">{job?.salary}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/home/job/${job?._id || job?.id}`)}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-colors text-sm"
            >
              View Full Job Description
            </button>
          </div>

          {/* Withdraw Application */}
          {(status === 'APPLIED' || status === 'INTERVIEW') && (
            <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-3xl text-center">
              {showConfirmWithdraw ? (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <h4 className="text-white font-bold mb-2">Are you sure?</h4>
                  <p className="text-zinc-400 text-xs mb-4">This action cannot be undone. You will lose your application status.</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowConfirmWithdraw(false)}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                      disabled={withdrawLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleWithdraw}
                      disabled={withdrawLoading}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      {withdrawLoading ? 'Wait...' : 'Confirm'}
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowConfirmWithdraw(true)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Withdraw Application
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

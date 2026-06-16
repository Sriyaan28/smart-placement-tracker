import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyApplicationById, scheduleInterview, toggleApplicationStatus, markEmailSent } from '../api/companyApi';
import { useAuth } from '../hooks/useAuth';
import { ResumeStats } from '../components/profile/stats/ResumeStats';
import { ChevronLeft, User, Mail, Briefcase, Calendar, Clock, Video, Loader2, Send, Code2, ExternalLink, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

const GithubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const CompanyApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user: companyUser } = useAuth();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Interview form state
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewLink, setInterviewLink] = useState('');

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const res = await getCompanyApplicationById(applicationId);
      if (res.success) {
        setApplication(res.payload);
      }
    } catch (err) {
      setError('Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleInterview = async () => {
    setSuccessMsg('');
    setError('');
    if (!interviewDate || !interviewTime || !interviewLink) {
      setError('Please fill in all interview details');
      return;
    }
    try {
      const res = await scheduleInterview({
        applicationId,
        date: interviewDate,
        time: interviewTime,
        link: interviewLink
      });
      if (res.success) {
        setSuccessMsg('Interview scheduled successfully');
        fetchApplication();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const handleToggleStatus = async (newStatus) => {
    setSuccessMsg('');
    setError('');
    try {
      const res = await toggleApplicationStatus({ applicationId, status: newStatus });
      if (res.success) {
        setSuccessMsg(`Application marked as ${newStatus}`);
        fetchApplication();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleSendMail = () => {
    if (!application || !companyUser) return;
    
    const { user, jobId, status } = application;
    const companyName = companyUser.name;
    const candidateName = user.name;
    const role = jobId.title;
    
    const subject = `Update on your application for ${role} at ${companyName}`;
    let body = '';

    if (status === 'SELECTED') {
      body = `Dear ${candidateName},

We are thrilled to inform you that you have been selected for the ${role} position at ${companyName}!

Your skills and experience really stood out to us, and we are excited to welcome you to the team. We will be in touch shortly with the next steps regarding your offer and onboarding process.

Congratulations again, and we look forward to working with you.

Best regards,
${companyName}`;
    } else if (status === 'REJECTED') {
      body = `Dear ${candidateName},

Thank you for taking the time to apply for the ${role} position at ${companyName} and for speaking with our team.

While we were impressed with your background, we have decided to move forward with other candidates whose qualifications more closely match our current needs for this particular role.

We appreciate your interest in our company and wish you the best of luck in your job search and future career endeavors.

Best regards,
${companyName}`;
    }

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(user.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
    setShowEmailModal(true);
  };

  const handleConfirmEmailSent = async () => {
    try {
      const res = await markEmailSent(applicationId);
      if (res.success) {
        setSuccessMsg('Email status updated successfully');
        fetchApplication();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update email status');
    } finally {
      setShowEmailModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center max-w-md">
          <h3 className="text-xl font-bold mb-2">Error</h3>
          <p>{error || 'Application not found'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { user, jobId, status, interview } = application;
  const isApplied = status === 'APPLIED';
  const isInterview = status === 'INTERVIEW';
  const isCompleted = status === 'SELECTED' || status === 'REJECTED';

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-4 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors self-start md:self-auto"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Applications
        </button>
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border 
          ${status === 'APPLIED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
          ${status === 'INTERVIEW' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
          ${status === 'SELECTED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}
          ${status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
        `}>
          Status: {status}
        </span>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl text-center font-medium">
          {successMsg}
        </div>
      )}
      {error && !loading && application && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-center font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Applicant Details */}
        <div className="md:col-span-2 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-3xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight truncate">{user.name}</h1>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span className="truncate">Applied for: <strong className="text-white">{jobId.title}</strong></span>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6 p-4 bg-black/30 rounded-2xl border border-zinc-800/50">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">About</h4>
                {user.bio ? (
                  <p className="text-zinc-300 text-sm leading-relaxed max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                    {user.bio}
                  </p>
                ) : (
                  <p className="text-zinc-500 text-sm italic">
                    This candidate hasn't added a bio yet.
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div className="mt-6 flex flex-wrap gap-3">
                {user.githubUsername && (
                  <a href={`https://github.com/${user.githubUsername}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm rounded-full transition-colors border border-zinc-700/50">
                    <GithubIcon className="w-4 h-4" />
                    <span>{user.githubUsername}</span>
                  </a>
                )}
                {user.leetcodeUsername && (
                  <a href={`https://leetcode.com/u/${user.leetcodeUsername}/`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm rounded-full transition-colors border border-zinc-700/50">
                    <Code2 className="w-4 h-4 text-emerald-500" />
                    <span>{user.leetcodeUsername}</span>
                  </a>
                )}
                {user.linkedinUrl && (
                  <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 text-sm rounded-full transition-colors border border-blue-500/20">
                    <LinkedinIcon className="w-4 h-4" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </div>

              {/* Stats Link */}
              <div className="mt-6">
                <button 
                  onClick={() => navigate(`/home/stats/${user._id}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  View Candidate Stats
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 flex flex-col justify-center gap-4">
          <h3 className="text-lg font-bold text-white mb-2">Actions</h3>
          
          {isApplied && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 p-4 bg-black/50 rounded-2xl border border-zinc-800/50">
                <h4 className="text-sm font-semibold text-zinc-300">Schedule Interview</h4>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input type="time" value={interviewTime} onChange={e => setInterviewTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input type="url" placeholder="Meeting Link" value={interviewLink} onChange={e => setInterviewLink(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                  </div>
                  <button onClick={handleScheduleInterview} className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors text-sm">
                    Confirm Schedule
                  </button>
                </div>
              </div>
              <button onClick={() => handleToggleStatus('REJECTED')} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold py-3 rounded-xl transition-colors">
                Reject Candidate
              </button>
            </div>
          )}

          {isInterview && (
            <div className="flex flex-col gap-3">
              {interview && interview.length > 0 && (
                <div className="mb-4 p-4 bg-black/50 rounded-2xl border border-zinc-800/50">
                  <h4 className="text-sm font-semibold text-zinc-400 mb-2">Scheduled Interview</h4>
                  <div className="text-white text-sm flex items-center gap-2 mb-1"><Calendar className="w-4 h-4 text-zinc-500"/> {interview[interview.length-1].date}</div>
                  <div className="text-white text-sm flex items-center gap-2 mb-1"><Clock className="w-4 h-4 text-zinc-500"/> {interview[interview.length-1].time}</div>
                  <div className="text-blue-400 text-sm flex items-center gap-2 truncate"><Video className="w-4 h-4 text-zinc-500"/> <a href={interview[interview.length-1].link} target="_blank" rel="noreferrer" className="hover:underline">Join Meeting</a></div>
                </div>
              )}
              <button onClick={() => handleToggleStatus('SELECTED')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Select Candidate
              </button>
              <button onClick={() => handleToggleStatus('REJECTED')} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold py-3 rounded-xl transition-colors">
                Reject Candidate
              </button>
            </div>
          )}

          {isCompleted && (
            <div className="flex flex-col gap-3">
              {application.emailSent ? (
                <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-default">
                  <CheckCircle2 className="w-5 h-5" />
                  Mail Sent
                </div>
              ) : (
                <button 
                  onClick={handleSendMail}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                >
                  <Send className="w-4 h-4" />
                  Send Mail
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resume Section */}
      <div className="border-t border-zinc-800/50 pt-10 mt-10">
        <h2 className="text-2xl font-black text-white mb-6">Candidate Profile</h2>
        <ResumeStats userId={user._id} />
      </div>

      {/* Email Confirmation Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-8 h-8 ml-1" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Did you send the email?</h3>
            <p className="text-zinc-400 text-sm mb-8">
              Confirming this will mark the application's communication status as "Mail Sent".
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmEmailSent}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Yes, I sent it
              </button>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-xl transition-colors"
              >
                No, maybe later
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

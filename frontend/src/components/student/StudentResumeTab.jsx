import React, { useState, useRef } from 'react';
import { useProfile } from '../../hooks/common/useProfile';
import { Upload, Trash2, FileText, CheckCircle2, Loader2, AlertCircle, Edit3, Briefcase, Code, GraduationCap, ExternalLink } from 'lucide-react';
import { ResumeReview } from './ResumeReview';
import { PdfViewer } from '../common/PdfViewer';

const ExpandableExperience = ({ exp }) => {
  const [expanded, setExpanded] = useState(false);

  // Format subtitle carefully to avoid stray dots
  const subtitleParts = [];
  if (exp.company) subtitleParts.push(exp.company);
  if (exp.duration) subtitleParts.push(exp.duration);
  const subtitle = subtitleParts.join(' • ');

  return (
    <div onClick={() => setExpanded(!expanded)} className="border-l-2 border-zinc-800 pl-4 pb-4 last:pb-0 cursor-pointer group">
      <h4 className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors">{exp.jobTitle}</h4>
      {subtitle && <p className="text-zinc-400 text-xs mb-1">{subtitle}</p>}
      {exp.description && (
        <p className={`text-zinc-500 text-xs mt-2 ${expanded ? '' : 'line-clamp-2'}`}>
          {exp.description}
        </p>
      )}
    </div>
  );
};

const ExpandableProject = ({ proj }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div onClick={() => setExpanded(!expanded)} className="bg-black border border-zinc-800 p-3 rounded-xl cursor-pointer group hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors pr-2">{proj.title}</h4>
        <div className="flex gap-2 shrink-0">
          {proj.github && (
            <a
              href={proj.github}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 px-1 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-md text-[10px] font-medium transition-colors border border-zinc-800"
            >
              <Code className="w-3 h-3" />
            </a>
          )}
          {proj.link && (
            <a
              href={proj.link}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 px-1 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-md text-[10px] font-medium transition-colors border border-emerald-500/20"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
      {proj.description && (
        <p className={`text-zinc-500 text-xs ${expanded ? '' : 'line-clamp-2'}`}>
          {proj.description}
        </p>
      )}
    </div>
  );
};

export const ResumeTab = () => {
  const { resume, uploadedResume, parsedResume, setParsedResume, handleUploadResume, handleAnalyzeResume, handleDeleteResume } = useProfile();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError("Only PDF files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be under 5MB.");
      return;
    }

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('resume', file);

    const res = await handleUploadResume(formData);
    if (!res.success) {
      setUploadError(res.message);
    } else {
      // Trigger AI analysis asynchronously
      handleAnalyzeResume(res.payload.resumeText);
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) return;

    setIsDeleting(true);
    await handleDeleteResume();
    setIsDeleting(false);
  };

  // State 2: Review/Analyze State
  if (uploadedResume || parsedResume) {
    return <ResumeReview />;
  }

  // State 1: Upload State
  if (!resume && !uploadedResume && !parsedResume) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 md:p-16 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <Upload className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
        <p className="text-zinc-400 max-w-md mb-8">
          Upload your latest resume in PDF format. We will automatically parse it and extract your skills to match you with the best opportunities.
        </p>

        {uploadError && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-3 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isUploading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
          ) : (
            <>Select PDF File</>
          )}
        </button>
      </div>
    );
  }

  // Resume Exists
  const { resumeUrl, atsScore, resumeData } = resume;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">

      {/* PDF Viewer */}
      <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span className="text-white font-medium">resume.pdf</span>
          </div>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-colors"
            title="Delete Resume"
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          </button>
        </div>
        <div className="flex-1 bg-zinc-950 relative">
          {resumeUrl ? (
            <PdfViewer url={resumeUrl} />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 p-8 text-center">
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <p>Resume file is not available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Resume Data */}
      <div className="space-y-6 overflow-y-auto custom-scrollbar h-[600px] pr-2">

        {/* ATS Score */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CheckCircle2 className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-bold mb-2 relative z-10">ATS Score</h3>
                <p className="text-zinc-400 text-sm mb-4 relative z-10">Based on standard formatting and keyword matching.</p>
              </div>
              <button
                onClick={() => setParsedResume(resume)}
                className="relative z-10 text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
              >
                <Edit3 size={14} /> Edit
              </button>
            </div>
            <div className="flex items-end gap-2 relative z-10">
              <span className={`text-5xl font-black ${atsScore >= 75 ? 'text-emerald-500' : atsScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {atsScore}
              </span>
              <span className="text-zinc-500 font-bold mb-1">/ 100</span>
            </div>
          </div>
        </div>

        {/* Extracted Skills */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-emerald-500" /> Skills</h3>
          {resumeData?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-full text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">No skills extracted.</p>
          )}
        </div>

        {/* Experience */}
        {resumeData?.experience?.length > 0 && (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-emerald-500" /> Experience</h3>
            <div className="space-y-4">
              {resumeData.experience.map((exp, i) => (
                <ExpandableExperience key={i} exp={exp} />
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resumeData?.projects?.length > 0 && (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-emerald-500" /> Projects</h3>
            <div className="space-y-4">
              {resumeData.projects.map((proj, i) => (
                <ExpandableProject key={i} proj={proj} />
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resumeData?.education?.length > 0 && (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-emerald-500" /> Education</h3>
            <div className="space-y-3">
              {resumeData.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start border-b border-zinc-800/50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <h4 className="text-white font-medium text-sm">{edu.degree}</h4>
                    <p className="text-zinc-400 text-xs">{edu.institution}</p>
                  </div>
                  <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-md">{edu.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

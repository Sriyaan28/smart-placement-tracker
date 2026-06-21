import React, { useState, useEffect } from 'react';
import { FileText, Code, ExternalLink, Maximize, Minimize } from 'lucide-react';
import { PdfViewer } from './PdfViewer';

const ExpandableExperience = ({ exp }) => {
  const [expanded, setExpanded] = useState(false);

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
      {exp.technologies && exp.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {exp.technologies.map(tech => (
            <span key={tech} className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px]">{tech}</span>
          ))}
        </div>
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
      {proj.technologies && proj.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {proj.technologies.map(tech => (
            <span key={tech} className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px]">{tech}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export const ReadOnlyResume = ({ resumeUrl, parsedResume }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setIsDarkMode(true);
      }
    };
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    const nextState = !isFullscreen;
    setIsFullscreen(nextState);
    setIsDarkMode(!nextState); // false if entering fullscreen, true if exiting
  };

  if (!resumeUrl && !parsedResume) return null;

  const data = parsedResume?.resumeData || {};

  return (
    <div className={isFullscreen 
      ? "fixed inset-0 z-[100] bg-zinc-950 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen w-screen overflow-hidden" 
      : "grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px] mt-8"
    }>
      
      {/* Left: PDF Viewer */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span className="text-white font-medium">Uploaded Resume</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-medium">Dark Mode</span>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${isDarkMode ? 'bg-emerald-500' : 'bg-zinc-700'}`}
              >
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform duration-200 ${isDarkMode ? 'translate-x-5' : 'translate-x-[3px]'}`} />
              </button>
            </div>
            <button
              onClick={toggleFullscreen}
              className="text-zinc-400 hover:text-white transition-colors p-1"
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="flex-1 bg-zinc-950 relative">
          {resumeUrl ? (
            <PdfViewer url={resumeUrl} isDarkMode={isDarkMode} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
              No PDF available
            </div>
          )}
        </div>
      </div>

      {/* Right: Parsed Data */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl flex flex-col h-full overflow-hidden relative">
        <div className="p-4 border-b border-zinc-800 bg-black/50 space-y-3 shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold">Resume Profile</h3>
              <p className="text-zinc-500 text-xs">AI-extracted resume data</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* SKILLS */}
          {data.skills && data.skills.length > 0 && (
            <section className="space-y-4">
              <h4 className="text-emerald-500 font-bold tracking-wide uppercase text-sm flex items-center gap-2">
                <span className="w-6 h-px bg-emerald-500/30"></span> Core Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                  <span key={skill} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium px-3 py-1.5 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* EXPERIENCE */}
          {data.experience && data.experience.length > 0 && (
            <section className="space-y-4">
              <h4 className="text-emerald-500 font-bold tracking-wide uppercase text-sm flex items-center gap-2">
                <span className="w-6 h-px bg-emerald-500/30"></span> Experience
              </h4>
              <div className="bg-black/50 border border-zinc-800/50 p-4 rounded-2xl">
                {data.experience.map((exp, i) => (
                  <ExpandableExperience key={i} exp={exp} />
                ))}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {data.projects && data.projects.length > 0 && (
            <section className="space-y-4">
              <h4 className="text-emerald-500 font-bold tracking-wide uppercase text-sm flex items-center gap-2">
                <span className="w-6 h-px bg-emerald-500/30"></span> Projects
              </h4>
              <div className="grid gap-3">
                {data.projects.map((proj, i) => (
                  <ExpandableProject key={i} proj={proj} />
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {data.education && data.education.length > 0 && (
            <section className="space-y-4">
              <h4 className="text-emerald-500 font-bold tracking-wide uppercase text-sm flex items-center gap-2">
                <span className="w-6 h-px bg-emerald-500/30"></span> Education
              </h4>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <div key={i} className="bg-black border border-zinc-800 p-4 rounded-xl">
                    <h4 className="text-white font-medium text-sm">{edu.degree}</h4>
                    <p className="text-zinc-400 text-xs">{edu.institution}</p>
                    {edu.score && <p className="text-emerald-400 text-xs mt-1 font-medium">{edu.score}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(!data.skills?.length && !data.experience?.length && !data.projects?.length && !data.education?.length) && (
             <div className="text-center text-zinc-500 py-10">
               No structured data available.
             </div>
          )}
        </div>
      </div>

    </div>
  );
};

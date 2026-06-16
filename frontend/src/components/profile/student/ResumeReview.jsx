import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '../../../hooks/useProfile';
import { Save, Loader2, FileText, AlertCircle, Plus, Trash2, Check, ChevronsUpDown, X, BrainCircuit, Maximize, Minimize } from 'lucide-react';
import { SKILLS } from '../../../utils/skills';
import { PdfViewer } from '../PdfViewer';

// --- Custom MultiSelect Autocomplete Component ---
const SkillsMultiSelect = ({ selectedSkills, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSkills = SKILLS.filter(skill => 
    skill.toLowerCase().includes(query.toLowerCase()) && 
    !selectedSkills.includes(skill)
  );

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter(s => s !== skill));
    } else {
      onChange([...selectedSkills, skill]);
      setQuery('');
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className="min-h-[48px] w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 flex flex-wrap gap-2 items-center cursor-text focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        {selectedSkills.map(skill => (
          <span key={skill} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
            {skill}
            <X size={14} className="cursor-pointer hover:text-emerald-300" onClick={(e) => { e.stopPropagation(); toggleSkill(skill); }} />
          </span>
        ))}
        <div className="flex-1 min-w-[120px] flex items-center">
          <input 
            type="text" 
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            placeholder={selectedSkills.length === 0 ? "Select skills..." : ""}
            className="w-full bg-transparent text-sm text-white focus:outline-none"
          />
          <ChevronsUpDown size={16} className="text-zinc-500 ml-auto cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
        </div>
      </div>

      {isOpen && (query.length > 0 || filteredSkills.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden">
          {filteredSkills.length === 0 ? (
            <div className="p-3 text-sm text-zinc-500 text-center">No skills found.</div>
          ) : (
            filteredSkills.map(skill => (
              <div 
                key={skill} 
                className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer flex items-center justify-between"
                onClick={() => { toggleSkill(skill); setIsOpen(false); }}
              >
                {skill}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};


export const ResumeReview = () => {
  const { uploadedResume, parsedResume, isAnalyzing, setParsedResume, handleSaveResume, handleDiscardResume } = useProfile();
  
  // Form State
  const [formData, setFormData] = useState({
    skills: [],
    experience: [],
    projects: [],
    education: []
  });
  
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
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

  // Initialize form when parsedResume changes
  useEffect(() => {
    if (parsedResume?.resumeData) {
      
      // Sanitize AI hallucinated links before putting them in state
      const sanitizedProjects = (parsedResume.resumeData.projects || []).map(proj => {
        let github = proj.github || '';
        let link = proj.link || '';
        
        if (github && !/^https?:\/\/(www\.)?github\.com\/.+/i.test(github)) {
          github = '';
        }
        if (link && !/^https?:\/\/.+/i.test(link)) {
          link = '';
        }
        
        return { ...proj, github, link };
      });

      setFormData({
        skills: parsedResume.resumeData.skills || [],
        experience: parsedResume.resumeData.experience || [],
        projects: sanitizedProjects,
        education: parsedResume.resumeData.education || []
      });
    }
  }, [parsedResume]);

  // Handle Array Updates
  const updateArrayItem = (type, index, field, value) => {
    const updated = [...formData[type]];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, [type]: updated });
  };

  const removeArrayItem = (type, index) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  const addArrayItem = (type, emptyObject) => {
    setFormData({ ...formData, [type]: [...formData[type], emptyObject] });
  };

  const onSave = async () => {
    setSaveError('');
    setIsSaving(true);
    
    // Validate Project URLs with Regex
    for (const proj of formData.projects) {
      if (proj.github && !/^https?:\/\/(www\.)?github\.com\/.+/i.test(proj.github)) {
        setSaveError(`Invalid GitHub URL in project: "${proj.title || 'Untitled'}". Please provide a valid URL starting with https://github.com/`);
        setIsSaving(false);
        return;
      }
      if (proj.link && !/^https?:\/\/.+/i.test(proj.link)) {
        setSaveError(`Invalid Live Link in project: "${proj.title || 'Untitled'}". Please provide a valid URL starting with http:// or https://`);
        setIsSaving(false);
        return;
      }
    }
    
    const payload = {
      resumeUrl: uploadedResume?.resumeUrl || parsedResume?.resumeUrl,
      atsScore: parsedResume?.atsScore || 0,
      resumeData: formData
    };
    
    const res = await handleSaveResume(payload);
    if (!res.success) {
      setSaveError(res.message);
      setIsSaving(false);
    }
    // Context automatically clears state and redirects on success
  };

  const onCancel = async () => {
    if (window.confirm("Are you sure you want to cancel?")) {
      if (uploadedResume) {
        await handleDiscardResume(uploadedResume.resumeUrl);
      } else {
        // Just an edit of existing data, discard changes
        setParsedResume(null);
      }
    }
  };

  if (!uploadedResume && !parsedResume) return null;

  return (
    <div className={isFullscreen 
      ? "fixed inset-0 z-[100] bg-zinc-950 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen w-screen overflow-hidden" 
      : "grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300 h-[800px]"
    }>
      
      {/* Left: PDF Viewer */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span className="text-white font-medium">Uploaded PDF</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Toggle Switch */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-medium hidden sm:block">Dark Mode</span>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${isDarkMode ? 'bg-emerald-500' : 'bg-zinc-700'}`}
              >
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform duration-200 ${isDarkMode ? 'translate-x-5' : 'translate-x-[3px]'}`} />
              </button>
            </div>
            
            <button
              onClick={toggleFullscreen}
              className="text-zinc-400 hover:text-white transition-colors p-1 hidden sm:block"
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
            
            {isAnalyzing ? (
               <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-full border border-purple-500/20 flex items-center gap-2 animate-pulse">
                 <BrainCircuit className="w-4 h-4" /> Analyzing AI...
               </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20">
                Review Mode
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 bg-zinc-950 relative">
          <PdfViewer url={uploadedResume?.resumeUrl || parsedResume?.resumeUrl} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Right: Analyzer Loading State OR Form */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl flex flex-col h-full overflow-hidden relative">
        
        {isAnalyzing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-zinc-950/80 backdrop-blur-sm z-10 animate-in fade-in">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
              <BrainCircuit className="w-20 h-20 text-emerald-500 relative z-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">AI is analyzing your resume...</h3>
            <p className="text-zinc-400 max-w-sm">We are extracting your skills, experience, and calculating your ATS score. This usually takes about 5 seconds.</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-zinc-800 bg-black/50 space-y-3 shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold">Review Extracted Data</h3>
                  <p className="text-zinc-500 text-xs">Verify the AI-extracted data. Fill in missing details.</p>
                </div>
                <div className="flex items-center gap-2 text-sm bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-full">
                  <span className="text-zinc-400">ATS Score:</span>
                  <span className={`font-bold ${parsedResume?.atsScore >= 75 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                    {parsedResume?.atsScore}%
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-yellow-500/90 text-xs leading-relaxed">
                  <strong>AI Disclaimer:</strong> The data below is auto-generated by AI and may contain inaccuracies. Please carefully verify and correct all fields before saving to ensure your profile is accurate.
                </p>
              </div>

              {saveError && (
                <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}
            </div>
            
            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* SKILLS */}
              <section className="space-y-4">
                <h4 className="text-emerald-500 font-bold tracking-wide uppercase text-sm flex items-center gap-2">
                  <span className="w-6 h-px bg-emerald-500/30"></span> Core Skills
                </h4>
                <SkillsMultiSelect 
                  selectedSkills={formData.skills} 
                  onChange={(newSkills) => setFormData({...formData, skills: newSkills})} 
                />
              </section>

              {/* EXPERIENCE */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-emerald-500 font-bold tracking-wide uppercase text-sm flex items-center gap-2">
                    <span className="w-6 h-px bg-emerald-500/30"></span> Experience
                  </h4>
                  <button onClick={() => addArrayItem('experience', { jobTitle: '', company: '', duration: '', description: '', technologies: [] })} className="text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
                    <Plus size={14} /> Add
                  </button>
                </div>
                {formData.experience.map((exp, i) => (
                  <div key={i} className="bg-black border border-zinc-800 p-4 rounded-2xl relative group">
                    <button onClick={() => removeArrayItem('experience', i)} className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-400 pl-1">Job Title</label>
                        <input placeholder="e.g. Software Engineer" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" value={exp.jobTitle} onChange={(e) => updateArrayItem('experience', i, 'jobTitle', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-400 pl-1">Company</label>
                        <input placeholder="e.g. Google" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" value={exp.company} onChange={(e) => updateArrayItem('experience', i, 'company', e.target.value)} />
                      </div>
                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs text-zinc-400 pl-1">Duration</label>
                        <input placeholder="e.g. Jan 2020 - Present" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" value={exp.duration} onChange={(e) => updateArrayItem('experience', i, 'duration', e.target.value)} />
                      </div>
                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs text-zinc-400 pl-1">Description</label>
                        <textarea placeholder="Describe your responsibilities and achievements..." rows={2} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 resize-none" value={exp.description} onChange={(e) => updateArrayItem('experience', i, 'description', e.target.value)} />
                      </div>
                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs text-zinc-500 mb-1 block">Technologies Used:</label>
                        <SkillsMultiSelect selectedSkills={exp.technologies || []} onChange={(newTech) => updateArrayItem('experience', i, 'technologies', newTech)} />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* PROJECTS */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-emerald-500 font-bold tracking-wide uppercase text-sm flex items-center gap-2">
                    <span className="w-6 h-px bg-emerald-500/30"></span> Projects
                  </h4>
                  <button onClick={() => addArrayItem('projects', { title: '', description: '', github: '', link: '', technologies: [] })} className="text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
                    <Plus size={14} /> Add
                  </button>
                </div>
                {formData.projects.map((proj, i) => (
                  <div key={i} className="bg-black border border-zinc-800 p-4 rounded-2xl relative group">
                    <button onClick={() => removeArrayItem('projects', i)} className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs text-zinc-400 pl-1">Project Title</label>
                        <input placeholder="e.g. Smart Placement Tracker" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" value={proj.title} onChange={(e) => updateArrayItem('projects', i, 'title', e.target.value)} />
                      </div>
                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs text-zinc-400 pl-1">Description</label>
                        <textarea placeholder="Describe the project..." rows={2} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 resize-none" value={proj.description} onChange={(e) => updateArrayItem('projects', i, 'description', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-400 pl-1">GitHub URL</label>
                        <input placeholder="https://github.com/..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" value={proj.github} onChange={(e) => updateArrayItem('projects', i, 'github', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-400 pl-1">Live Link</label>
                        <input placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" value={proj.link} onChange={(e) => updateArrayItem('projects', i, 'link', e.target.value)} />
                      </div>
                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs text-zinc-500 mb-1 block">Technologies Used:</label>
                        <SkillsMultiSelect selectedSkills={proj.technologies || []} onChange={(newTech) => updateArrayItem('projects', i, 'technologies', newTech)} />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* EDUCATION */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-emerald-500 font-bold tracking-wide uppercase text-sm flex items-center gap-2">
                    <span className="w-6 h-px bg-emerald-500/30"></span> Education
                  </h4>
                  <button onClick={() => addArrayItem('education', { degree: '', institution: '', score: '' })} className="text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
                    <Plus size={14} /> Add
                  </button>
                </div>
                {formData.education.map((edu, i) => (
                  <div key={i} className="bg-black border border-zinc-800 p-4 rounded-2xl relative group">
                    <button onClick={() => removeArrayItem('education', i)} className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 flex flex-col gap-1">
                        <label className="text-xs text-zinc-400 pl-1">Degree</label>
                        <input placeholder="e.g. B.Tech Computer Science" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" value={edu.degree} onChange={(e) => updateArrayItem('education', i, 'degree', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-400 pl-1">Institution</label>
                        <input placeholder="e.g. MIT" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" value={edu.institution} onChange={(e) => updateArrayItem('education', i, 'institution', e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-zinc-400 pl-1">Score (GPA/Percentage)</label>
                        <input placeholder="e.g. 3.8 GPA" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" value={edu.score} onChange={(e) => updateArrayItem('education', i, 'score', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

            </div>

            <div className="p-4 border-t border-zinc-800 bg-black/50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={onCancel}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-medium disabled:opacity-50"
              >
                Discard
              </button>
              <button 
                onClick={onSave}
                disabled={isSaving}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-2.5 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save & Publish
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

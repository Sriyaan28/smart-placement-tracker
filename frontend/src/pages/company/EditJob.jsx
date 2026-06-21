import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit3, MapPin, IndianRupee, Clock, ChevronDown, Check, X, AlertCircle } from 'lucide-react';
import { updateJob } from '../../api/companyApi';
import { getJobDetails } from '../../api/jobApi';
import { useCompany } from '../../hooks/company/useCompany';
import { SKILLS } from '../../utils/skills';

export const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { refreshCompanyJobs } = useCompany();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: 'FULL_TIME',
    duration: '',
    experience: 0,
    location: 'ON_SITE',
    salary: '',
    skills: []
  });

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Custom multi-select state
  const [skillInput, setSkillInput] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const skillInputRef = useRef(null);

  // Fetch existing job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobDetails(jobId);
        if (res.success) {
          const job = res.payload;
          setFormData({
            title: job.title || '',
            description: job.description || '',
            jobType: job.jobType || 'FULL_TIME',
            duration: job.duration || '',
            experience: job.experience || 0,
            location: job.location || 'ON_SITE',
            salary: job.salary || '',
            skills: job.skills || []
          });
        } else {
          setError('Failed to load job details');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch job data');
      } finally {
        setIsLoadingData(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Enforce description max length locally by truncating
    if (name === 'description' && value.length > 500) {
      setFormData(prev => ({ ...prev, [name]: value.slice(0, 500) }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setSkillInput('');
    setShowSkillDropdown(false);
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const filteredSkills = SKILLS.filter(s => 
    s.toLowerCase().includes(skillInput.toLowerCase()) && !formData.skills.includes(s)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillInputRef.current && !skillInputRef.current.contains(event.target)) {
        setShowSkillDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Frontend validation
    if (formData.skills.length === 0) {
      setError("Please select at least one required skill.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await updateJob(jobId, formData);
      if (res.success) {
        // Refresh context to show updated job instantly
        await refreshCompanyJobs();
        navigate(`/home/job/${jobId}`);
      } else {
        setError(res.message || "Failed to update job");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-4 animate-pulse space-y-6">
        <div className="w-48 h-10 bg-zinc-800 rounded-lg" />
        <div className="w-full h-[500px] bg-zinc-900/40 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Edit3 className="text-blue-500 w-8 h-8" />
          Edit Job Posting
        </h1>
        <p className="text-zinc-400">Update the details of your job opportunity.</p>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 md:p-10">
        {error && (
          <div className="mb-8 px-4 py-3 rounded-xl flex items-center gap-2 text-sm border bg-red-500/10 border-red-500/20 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Job Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="title" 
              required
              value={formData.title} 
              onChange={handleChange} 
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none placeholder:text-zinc-600" 
              placeholder="e.g. Senior Frontend Developer" 
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Description <span className="text-red-500">*</span></label>
              <span className={`text-xs font-medium ${formData.description.length >= 500 ? 'text-red-400' : 'text-zinc-500'}`}>
                {formData.description.length}/500
              </span>
            </div>
            <textarea 
              name="description" 
              required
              value={formData.description} 
              onChange={handleChange} 
              className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none resize-none placeholder:text-zinc-600 h-32" 
              placeholder="Brief overview of the role..." 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Job Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Job Type <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  name="jobType" 
                  required
                  value={formData.jobType} 
                  onChange={handleChange} 
                  className="w-full appearance-none bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="RESEARCH">Research</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                Work Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  name="location" 
                  required
                  value={formData.location} 
                  onChange={handleChange} 
                  className="w-full appearance-none bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
                >
                  <option value="ON_SITE">On Site</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Duration <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Clock className="w-4 h-4 text-zinc-500" />
                </div>
                <input 
                  type="text" 
                  name="duration" 
                  required
                  value={formData.duration} 
                  onChange={handleChange} 
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none placeholder:text-zinc-600" 
                  placeholder="e.g. 6 Months" 
                />
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Salary <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <IndianRupee className="w-4 h-4 text-zinc-500" />
                </div>
                <input 
                  type="text" 
                  name="salary" 
                  required
                  value={formData.salary} 
                  onChange={handleChange} 
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none placeholder:text-zinc-600" 
                  placeholder="e.g. 10 LPA or ₹50,000/month" 
                />
              </div>
            </div>
            
            {/* Experience (Optional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                Experience (Years) 
                <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Optional</span>
              </label>
              <input 
                type="number" 
                name="experience" 
                min="0"
                max="50"
                value={formData.experience} 
                onChange={handleChange} 
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none placeholder:text-zinc-600" 
              />
            </div>
          </div>

          {/* Skills Multi-Select */}
          <div className="space-y-3 pt-4 border-t border-zinc-800/50">
            <label className="text-sm font-medium text-zinc-300">Required Skills <span className="text-red-500">*</span></label>
            
            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map(skill => (
                <span key={skill} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                  {skill}
                  <button type="button" onClick={() => handleSkillRemove(skill)} className="hover:text-red-400 hover:bg-blue-500/20 rounded-full p-0.5 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Skill Input with Dropdown */}
            <div className="relative" ref={skillInputRef}>
              <input 
                type="text" 
                value={skillInput} 
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  setShowSkillDropdown(true);
                }}
                onFocus={() => setShowSkillDropdown(true)}
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none placeholder:text-zinc-600" 
                placeholder="Type to search and add skills..." 
              />
              
              {showSkillDropdown && skillInput.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillAdd(skill)}
                        className="w-full text-left px-4 py-2.5 text-zinc-300 hover:bg-blue-500 hover:text-white transition-colors"
                      >
                        {skill}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-zinc-500 text-sm text-center">
                      No matching skills found
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-500">Select at least one skill. These will be used to automatically notify relevant students.</p>
          </div>

          <div className="pt-6 flex items-center gap-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-[2] bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

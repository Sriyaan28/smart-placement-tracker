import React, { useState } from 'react';
import { ArrowRight, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { checkEmail } from '../../api/authApi';
import { register } from '../../api/authApi';
import { useSearchParams } from 'react-router-dom';

export const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    bio: '',
    userProfile: '',
    githubUsername: '',
    leetcodeUsername: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when typing
  };

  const handleNextStep1 = () => {
    if (!formData.role) {
      setError("Please select a role to continue");
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e) => {
    e?.preventDefault();
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (formData.name.length > 30) {
      setError("Name cannot exceed 30 characters");
      return;
    }
    if (!/^[a-zA-Z ]+$/.test(formData.name)) {
      setError("Name can only contain letters and spaces");
      return;
    }
    setStep(3);
  };

  const handleNextStep3 = async (e) => {
    e?.preventDefault();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await checkEmail(formData.email);
      if (res.exists) {
        setError("This email is already registered");
      } else {
        setStep(4);
      }
    } catch (err) {
      setError("Failed to verify email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep4 = (e) => {
    e?.preventDefault();
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (formData.role === 'COMPANY') {
      submitRegistration(true); // Skip optional fields
    } else {
      setStep(5);
    }
  };

  const submitRegistration = async (skipOptional = false) => {
    setLoading(true);
    setError('');

    // Clean payload: remove empty strings
    const payload = { ...formData };
    if (skipOptional) {
      delete payload.bio;
      delete payload.userProfile;
      delete payload.githubUsername;
      delete payload.leetcodeUsername;
    } else {
      Object.keys(payload).forEach(key => {
        if (payload[key] === '') {
          delete payload[key];
        }
      });
    }

    try {
      const res = await register(payload);
      if (res.success) {
        setSearchParams({ mode: 'login', email: payload.email });
        // Don't set loading false here so buttons remain disabled while transitioning
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  // Step Renders
  const renderStep1 = () => (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-xl font-bold text-white mb-2">How do you want to use Placio?</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
          className={`p-6 rounded-2xl border transition-all ${formData.role === 'STUDENT' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
        >
          <div className="text-lg font-bold mb-1">Student</div>
          <div className="text-xs opacity-70">I want to apply for jobs</div>
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, role: 'COMPANY' })}
          className={`p-6 rounded-2xl border transition-all ${formData.role === 'COMPANY' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
        >
          <div className="text-lg font-bold mb-1">Company</div>
          <div className="text-xs opacity-70">I want to hire talent</div>
        </button>
      </div>
      <NextButton onClick={handleNextStep1} />
    </div>
  );

  const renderStep2 = () => (
    <form onSubmit={handleNextStep2} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-xl font-bold text-white mb-2">
        {formData.role === 'STUDENT' ? "What's your full name?" : "What's the company name?"}
      </h3>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        autoFocus
        placeholder={formData.role === 'STUDENT' ? "John Doe" : "Acme Corp"}
        className="bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500/50 text-white px-4 py-4 rounded-2xl outline-none transition-all text-lg"
      />
      <NextButton loading={false} />
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handleNextStep3} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-xl font-bold text-white mb-2">What's your email address?</h3>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        autoFocus
        placeholder="name@example.com"
        className="bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500/50 text-white px-4 py-4 rounded-2xl outline-none transition-all text-lg"
      />
      <NextButton loading={loading} />
    </form>
  );

  const renderStep4 = () => (
    <form onSubmit={handleNextStep4} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-xl font-bold text-white mb-2">Create a secure password</h3>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoFocus
          placeholder="••••••••"
          className="bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500/50 text-white px-4 py-4 rounded-2xl outline-none transition-all text-lg w-full pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-emerald-500 transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {formData.role === 'COMPANY' ? (
        <div className="flex justify-end mt-4">
          <button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            Complete
          </button>
        </div>
      ) : (
        <NextButton loading={false} />
      )}
    </form>
  );

  const renderStep5 = () => (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <h3 className="text-xl font-bold text-white mb-2">Almost done! Add some details.</h3>
      
      {formData.role === 'STUDENT' && (
        <>
          <input type="text" name="githubUsername" value={formData.githubUsername} onChange={handleChange} placeholder="GitHub Username" className="bg-zinc-900/50 border border-zinc-800 text-white px-4 py-3 rounded-xl outline-none focus:border-emerald-500/50" />
          <input type="text" name="leetcodeUsername" value={formData.leetcodeUsername} onChange={handleChange} placeholder="LeetCode Username" className="bg-zinc-900/50 border border-zinc-800 text-white px-4 py-3 rounded-xl outline-none focus:border-emerald-500/50" />
        </>
      )}

      <div className="flex items-center justify-between mt-4">
        <button type="button" onClick={() => submitRegistration(true)} disabled={loading} className="text-zinc-500 hover:text-white font-medium px-4 py-2 transition-colors">
          Skip for now
        </button>
        <button type="button" onClick={() => submitRegistration(false)} disabled={loading} className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          Complete
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Progress Indicator & Back Button */}
      {step > 1 && (
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => { setStep(step - 1); setError(''); }} className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2 flex-1">
            {(formData.role === 'COMPANY' ? [1, 2, 3, 4] : [1, 2, 3, 4, 5]).map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm font-medium mb-4 animate-pulse">{error}</p>}

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
    </div>
  );
};

// Reusable Next Button
const NextButton = ({ onClick, loading }) => (
  <div className="flex justify-end mt-4">
    <button 
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={loading}
      className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 rounded-full flex items-center justify-center transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] group"
    >
      {loading ? (
        <Loader2 className="w-6 h-6 text-black animate-spin" />
      ) : (
        <ArrowRight className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" />
      )}
    </button>
  </div>
);

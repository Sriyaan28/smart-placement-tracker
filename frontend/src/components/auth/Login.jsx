import React, { useState } from 'react';
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { login } from '../../api/authApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        setUser(res.payload || res.user); // Depending on exactly how the backend sends the user object
        navigate('/home');
      }
    } catch (err) {
      if (err.response?.data?.isBlocked) {
        window.location.href = '/blocked';
      } else {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-2">
        <label className="text-zinc-400 text-sm font-medium ml-1">Email Address</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@university.edu"
          className="bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500/50 text-white px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-zinc-600"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-zinc-400 text-sm font-medium ml-1">Password</label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500/50 text-white px-4 py-3 rounded-2xl outline-none transition-all placeholder:text-zinc-600 w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-emerald-500 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm text-center font-medium animate-pulse">{error}</p>}

      <div className="flex justify-end mt-4">
        <button 
          type="submit" 
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
    </form>
  );
};

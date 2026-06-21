import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Login } from '../../components/auth/Login';
import { Register } from '../../components/auth/Register';

export const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  const toggleMode = (loginMode) => {
    setIsLogin(loginMode);
    setSearchParams({ mode: loginMode ? 'login' : 'register' });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-sans selection:bg-emerald-500/30">
      
      <Link to="/" className="absolute top-8 left-8 text-white font-bold text-xl flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-black rounded-full" />
        </div>
        Placio
      </Link>

      <div className="w-full max-w-md relative z-10">
        
        {/* Header Text */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            {isLogin ? "Welcome back" : "Join Placio"}
          </h1>
          <p className="text-zinc-400">
            {isLogin ? "Enter your details to access your dashboard." : "Create an account to kickstart your journey."}
          </p>
        </div>

        {/* Pill Slider */}
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-1 rounded-full flex items-center mb-8 relative">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-zinc-800 rounded-full shadow-sm transition-all duration-300 ease-in-out ${isLogin ? 'left-1' : 'left-[calc(50%+2px)]'}`} 
          />
          
          <button 
            onClick={() => toggleMode(true)}
            className={`flex-1 relative z-10 py-3 text-sm font-semibold rounded-full transition-colors ${isLogin ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Log In
          </button>
          
          <button 
            onClick={() => toggleMode(false)}
            className={`flex-1 relative z-10 py-3 text-sm font-semibold rounded-full transition-colors ${!isLogin ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Register
          </button>
        </div>

        {/* Auth Forms */}
        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 p-8 rounded-[2rem] shadow-2xl overflow-hidden">
          {isLogin ? <Login /> : <Register />}
        </div>
      </div>

      {/* Abstract Background Elements */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-900/20 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
};

import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Building2, GraduationCap, ShieldCheck } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-emerald-500/30">

      {/* Navigation - Completely rounded pill shape */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl shadow-2xl">
          {/* Logo */}
          <a href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full" />
            </div>
            Placio
          </a>



          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <Link to="/auth?mode=login" className="text-sm font-semibold text-zinc-300 hover:bg-emerald-500 hover:text-black px-5 py-2 rounded-full transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              Log in
            </Link>
            <Link to="/auth?mode=register" className="text-sm font-semibold text-zinc-300 hover:bg-emerald-500 hover:text-black px-5 py-2 rounded-full transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              Register
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 max-w-6xl mx-auto relative">
        {/* Abstract Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center relative z-10 max-w-4xl mx-auto mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Smart Placement Tracker
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[1.1] mb-8">
            Land your dream role <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              without the chaos.
            </span>
          </h1>

          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Placio connects top students with elite companies. Manage applications, schedule interviews, and track your campus placement journey all in one sleek platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?mode=register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black text-lg font-bold px-8 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="mt-40 grid md:grid-cols-3 gap-8 relative z-10">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-emerald-500/30 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">For Students</h3>
            <p className="text-zinc-400 leading-relaxed">
              Upload your resume, parse it with ATS logic, and apply to top-tier companies with a single click. Keep track of every interview round instantly.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-emerald-500/30 transition-colors md:-translate-y-8">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">For Companies</h3>
            <p className="text-zinc-400 leading-relaxed">
              Post job openings, review structured student profiles, and schedule interviews seamlessly. Say goodbye to messy email threads and spreadsheets.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-emerald-500/30 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Platform Moderation</h3>
            <p className="text-zinc-400 leading-relaxed">
              Our dedicated moderation team filters out spam jobs and unauthorized accounts, ensuring a secure and high-quality environment for everyone.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black mt-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
            Placio
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Placio Placement Solutions. All rights reserved.
          </p>

        </div>
      </footer>
    </div>
  );
};

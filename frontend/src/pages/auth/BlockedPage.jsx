import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BlockedPage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900/50 border border-red-900/50 rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-black text-white mb-4">Account Blocked</h1>

        <p className="text-zinc-400 mb-8 leading-relaxed">
          Your account has been suspended by the administrator due to a violation of our terms of service or suspicious activity. You no longer have access to the platform.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => {
              const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=admin1@gmail.com&su=${encodeURIComponent('Account Blocked Appeal')}`;
              window.open(gmailUrl, '_blank');
            }}
            className="block w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-200"
          >
            Contact Administrator
          </button>

          <Link
            to="/auth?mode=login"
            className="block w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors duration-200"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ fullScreen = true, size = 'w-12 h-12', color = 'text-emerald-500' }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className={`${size} ${color} animate-spin`} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={`${size} ${color} animate-spin`} />
    </div>
  );
};

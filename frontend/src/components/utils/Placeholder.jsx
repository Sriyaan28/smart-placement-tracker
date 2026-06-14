import React from 'react';

export const Placeholder = ({ title }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="w-16 h-16 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin mb-6" />
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-zinc-400">This feature is currently under development.</p>
    </div>
  );
};

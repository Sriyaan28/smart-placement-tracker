import React, { useState } from 'react';
import { X, Flag, AlertTriangle, Loader2, ChevronDown } from 'lucide-react';
import { submitReport } from '../../api/reportApi';

export const ReportModal = ({ isOpen, onClose, targetType, targetId, targetName }) => {
    const JOB_CATEGORIES = ["Fake or Fraudulent Job", "Spam or Scams", "Offensive Content", "Discriminatory Requirements", "Other"];
    const STUDENT_CATEGORIES = ["Fake Profile", "Inappropriate Behavior", "Spam or Scams", "Offensive Content", "Other"];

    const categories = targetType === 'JOB' ? JOB_CATEGORIES : STUDENT_CATEGORIES;

    const [category, setCategory] = useState("Other");
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (reason.trim().length < 5) {
            setError("Please provide a reason with at least 5 characters.");
            return;
        }

        setLoading(true);
        setError('');
        
        const res = await submitReport({ targetType, targetId, category, reason });
        
        if (res.success) {
            setSuccess(res.message);
            setTimeout(() => {
                setSuccess('');
                setReason('');
                setCategory("Other");
                onClose();
            }, 2000);
        } else {
            setError(res.message);
        }
        
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-zinc-800/50">
                    <div className="flex items-center gap-3 text-red-400">
                        <Flag className="w-5 h-5" />
                        <h2 className="text-xl font-bold">Report {targetType === 'JOB' ? 'Job' : 'Student'}</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        disabled={loading || success}
                        className="text-zinc-500 hover:text-white transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {success ? (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-3">
                                <Flag className="w-6 h-6" />
                            </div>
                            <h3 className="text-green-400 font-bold mb-1">Report Submitted</h3>
                            <p className="text-sm text-green-400/80">Thank you. Our admins will review this shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <p className="text-zinc-400 text-sm mb-4">
                                    You are reporting <span className="text-white font-semibold">{targetName}</span>. 
                                    Please provide specific details about why you are reporting this {targetType === 'JOB' ? 'job' : 'student'}.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                                    Category
                                </label>
                                <div className="relative mb-4">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all appearance-none pr-10"
                                    >
                                        {categories.map((cat, idx) => (
                                            <option key={idx} value={cat} className="bg-zinc-900 text-white">
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                        <ChevronDown className="w-5 h-5" />
                                    </div>
                                </div>

                                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                                    Additional details (Reason)
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder={targetType === 'JOB' 
                                        ? "e.g., Fake job posting, spam, inappropriate content..." 
                                        : "e.g., Fake profile, inappropriate behavior, spam..."}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 text-white rounded-xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all resize-none"
                                    maxLength={500}
                                    required
                                />
                                <div className="text-right mt-1">
                                    <span className="text-xs text-zinc-500">{reason.length}/500</span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || reason.trim().length < 5}
                                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />}
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

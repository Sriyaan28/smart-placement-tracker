import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { deleteAccount } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, AlertCircle, AlertTriangle, Save, Trash2, X, CheckCircle2 } from 'lucide-react';

export const SettingsTab = () => {
  const { profile, handleUpdateProfile } = useProfile();
  const { handleLogout } = useAuth();
  
  // Settings Form State
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    number: profile?.number || '',
    bio: profile?.bio || '',
    githubUsername: profile?.githubUsername || '',
    leetcodeUsername: profile?.leetcodeUsername || '',
    linkedinUrl: profile?.linkedinUrl || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

  // Delete Account State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    
    const payload = { ...formData };
    if (payload.linkedinUrl && !/^https?:\/\//i.test(payload.linkedinUrl)) {
      payload.linkedinUrl = 'https://' + payload.linkedinUrl;
    }
    
    const res = await handleUpdateProfile(payload);
    
    if (res.success) {
      setSaveMessage({ type: 'success', text: "Profile updated successfully." });
    } else {
      setSaveMessage({ type: 'error', text: res.message });
    }
    setIsSaving(false);
  };

  const onDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteError("Password is required to delete account.");
      return;
    }
    
    setIsDeleting(true);
    setDeleteError('');
    
    try {
      const res = await deleteAccount(deletePassword);
      if (res.success) {
        handleLogout();
      } else {
        setDeleteError(res.message || "Failed to delete account.");
        setIsDeleting(false);
      }
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete account.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Profile Settings */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
        
        {saveMessage.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl flex items-center gap-2 text-sm border ${
            saveMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {saveMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{saveMessage.text}</span>
          </div>
        )}

        <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Locked Fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Email Address</label>
            <input type="email" value={profile?.email || ''} disabled className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed focus:outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Role</label>
            <input type="text" value={profile?.role?.replace('_', ' ') || ''} disabled className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed focus:outline-none" />
          </div>

          {/* Editable Fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Phone Number</label>
            <input type="tel" name="number" value={formData.number} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors outline-none" />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-zinc-400">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors outline-none resize-none" placeholder="Tell us a bit about yourself..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">GitHub Username</label>
            <input type="text" name="githubUsername" value={formData.githubUsername} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors outline-none" placeholder="e.g. Sriyaan28" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">LeetCode Username</label>
            <input type="text" name="leetcodeUsername" value={formData.leetcodeUsername} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors outline-none" placeholder="e.g. Sriyaan28" />
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-zinc-400">LinkedIn Profile URL</label>
            <input type="text" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors outline-none" placeholder="https://www.linkedin.com/in/username" />
          </div>

          <div className="md:col-span-2 pt-4 flex justify-end">
            <button type="submit" disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 py-3 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-950/20 border border-red-900/30 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <h2 className="text-xl font-bold text-red-500 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" /> Danger Zone
            </h2>
            <p className="text-zinc-400 text-sm max-w-xl">
              Permanently delete your account and all associated data. This action cannot be undone and you will lose access immediately.
            </p>
          </div>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="shrink-0 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold px-6 py-3 rounded-full transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-zinc-500 hover:text-white transition-colors p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Delete Account</h2>
            <p className="text-zinc-400 text-sm mb-6">
              This action is permanent and cannot be undone. Please enter your password to confirm you would like to delete your account.
            </p>

            {deleteError && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {deleteError}
              </div>
            )}

            <form onSubmit={onDeleteAccount} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Confirm Password</label>
                <input 
                  type="password" 
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors outline-none" 
                />
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 rounded-full text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors font-bold disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

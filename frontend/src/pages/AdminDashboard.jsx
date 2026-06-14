import React, { useState, useEffect } from 'react';
import { getAllProfiles, toggleBlockUser } from '../api/userApi';
import { useAuth } from '../hooks/useAuth';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllProfiles();
        if (data.success) {
          setUsers(data.payload);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId) => {
    try {
      const data = await toggleBlockUser(userId);
      if (data.success) {
        // Update local state to reflect change without full reload
        setUsers(users.map(u => u._id === userId ? { ...u, isActive: data.payload.isActive } : u));
      }
    } catch (err) {
      console.error("Failed to toggle block", err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h2>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Welcome, {user.name}!</h3>
        <p className="text-slate-400">System administration and user moderation.</p>
      </div>

      <h3 className="text-2xl font-bold mb-4 text-white">User Moderation</h3>
      {loading ? (
        <p className="text-slate-400">Loading users...</p>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700">
                <th className="p-4 font-semibold text-slate-300">Name</th>
                <th className="p-4 font-semibold text-slate-300">Email</th>
                <th className="p-4 font-semibold text-slate-300">Role</th>
                <th className="p-4 font-semibold text-slate-300">Status</th>
                <th className="p-4 font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                  <td className="p-4 text-slate-300">{u.name}</td>
                  <td className="p-4 text-slate-400">{u.email}</td>
                  <td className="p-4">
                    <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs font-medium tracking-wide">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium tracking-wide ${u.isActive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                      {u.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.role !== 'ADMIN' && (
                      <button 
                        onClick={() => handleToggleBlock(u._id)}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${u.isActive ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                      >
                        {u.isActive ? 'Block' : 'Unblock'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react'

const roleBadgeColors = {
  STUDENT: 'bg-blue-100 text-blue-700',
  MENTOR: 'bg-purple-100 text-purple-700',
  COMPANY: 'bg-amber-100 text-amber-700',
  ADMIN: 'bg-red-100 text-red-700',
}

function App() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/test")
        const json = await res.json()
        console.log(json)
        if (json.success) setUsers(json.payload)
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <h1 className='text-3xl font-bold text-center text-gray-800 mb-8'>
        SMART PLACEMENT TRACKER
      </h1>

      {loading ? (
        <p className='text-center text-gray-500'>Loading...</p>
      ) : users.length === 0 ? (
        <p className='text-center text-gray-500'>No users found</p>
      ) : (
        <div className='max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4'>
          {users.map((user) => (
            <div key={user._id} className='bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex gap-4 items-start hover:shadow-md transition-shadow'>
              {/* Avatar */}
              <img
                src={user.userProfile}
                alt={user.name}
                className='w-12 h-12 rounded-full object-cover flex-shrink-0'
              />

              {/* Info */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <h2 className='text-lg font-semibold text-gray-800 truncate'>{user.name}</h2>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadgeColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                    {user.role}
                  </span>
                </div>

                <p className='text-sm text-gray-500 truncate'>📧 {user.email}</p>
                <p className='text-sm text-gray-500'>📱 {user.number}</p>

                {user.bio && (
                  <p className='text-sm text-gray-400 mt-1 italic'>"{user.bio}"</p>
                )}

                <div className='mt-2 flex items-center gap-1.5'>
                  <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  <span className='text-xs text-gray-400'>{user.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default App
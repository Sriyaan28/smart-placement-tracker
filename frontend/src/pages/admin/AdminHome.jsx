import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, User, UserMinus, ChevronDown, BadgeCheck } from 'lucide-react';
import { Loading } from '../../components/common/Loading';
import { useAdminHome } from '../../hooks/admin/useAdminHome';

export const AdminHome = () => {
  const { students, companies, loading, error, fetchUsers } = useAdminHome();
  
  React.useEffect(() => {
    fetchUsers();
  }, []);
  
  const [studentSearch, setStudentSearch] = useState('');
  const [companySearch, setCompanySearch] = useState('');

  const [visibleStudentsCount, setVisibleStudentsCount] = useState(10);
  const [visibleCompaniesCount, setVisibleCompaniesCount] = useState(10);

  const navigate = useNavigate();

  const handleSeeMoreStudents = () => {
    setVisibleStudentsCount(prev => prev + 10);
  };

  const handleSeeMoreCompanies = () => {
    setVisibleCompaniesCount(prev => prev + 10);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-4 animate-pulse">
        <div className="mb-6">
          <div className="w-64 h-10 bg-zinc-800 rounded-lg mb-3"></div>
          <div className="w-96 h-5 bg-zinc-800/50 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {[1, 2].map((col) => (
            <div key={col} className="flex flex-col bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-[2rem] h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <div className="w-32 h-8 bg-zinc-800 rounded-lg"></div>
              </div>
              
              <div className="w-full h-10 bg-zinc-800/80 rounded-2xl mb-6"></div>

              <div className="flex-1 space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800/50 p-3 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-1/2 h-4 bg-zinc-800 rounded"></div>
                      <div className="w-3/4 h-3 bg-zinc-800/50 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-red-500 text-center py-20">{error}</div>;
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(companySearch.toLowerCase()) || 
    c.email.toLowerCase().includes(companySearch.toLowerCase())
  );

  const displayStudents = filteredStudents.slice(0, visibleStudentsCount);
  const displayCompanies = filteredCompanies.slice(0, visibleCompaniesCount);

  const UserListItem = ({ user, type }) => (
    <div 
      onClick={() => navigate(type === 'STUDENT' ? `/home/stats/${user._id}` : `/home/company/${user._id}`)}
      className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-zinc-800/50 hover:border-red-500/30 transition-all group shrink-0"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
        {user.userProfile ? (
          <img src={user.userProfile} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            {type === 'STUDENT' ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-white text-sm font-medium truncate group-hover:text-red-400 transition-colors flex items-center gap-1">
            {user.name}
            {type === 'COMPANY' && user.isVerified && (
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            )}
          </h3>
          {!user.isActive && (
            <span className="bg-red-500/10 text-red-500 text-[9px] px-1.5 py-0.5 rounded border border-red-500/20 whitespace-nowrap">
              Blocked
            </span>
          )}
        </div>
        <p className="text-zinc-500 text-xs truncate">{user.email}</p>
      </div>
      <div className="text-[10px] text-zinc-600 hidden md:block">
        {new Date(user.createdAt).toLocaleDateString()}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-4">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white mb-2">Platform Overview</h1>
        <p className="text-zinc-400">Manage all registered students and companies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Students List */}
        <div className="flex flex-col bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-[2rem] max-h-[calc(100vh-14rem)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-red-500" />
              Students <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full">{students.length}</span>
            </h2>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search students by name or email..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-800 text-sm text-white pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:border-red-500/50 transition-colors shadow-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {displayStudents.length > 0 ? (
              displayStudents.map(student => <UserListItem key={student._id} user={student} type="STUDENT" />)
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-zinc-500 space-y-2">
                <UserMinus className="w-8 h-8 opacity-50" />
                <p>No students found.</p>
              </div>
            )}

            {filteredStudents.length > visibleStudentsCount && (
              <button 
                onClick={handleSeeMoreStudents}
                className="w-full mt-3 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 hover:border-red-500/30 rounded-xl text-sm text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2 font-medium"
              >
                See More <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Companies List */}
        <div className="flex flex-col bg-zinc-900/30 border border-zinc-800/50 p-5 rounded-[2rem] max-h-[calc(100vh-14rem)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-500" />
              Companies <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full">{companies.length}</span>
            </h2>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search companies by name or email..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-800 text-sm text-white pl-10 pr-4 py-2.5 rounded-2xl focus:outline-none focus:border-red-500/50 transition-colors shadow-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {displayCompanies.length > 0 ? (
              displayCompanies.map(company => <UserListItem key={company._id} user={company} type="COMPANY" />)
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-zinc-500 space-y-2">
                <Building2 className="w-8 h-8 opacity-50" />
                <p>No companies found.</p>
              </div>
            )}

            {filteredCompanies.length > visibleCompaniesCount && (
              <button 
                onClick={handleSeeMoreCompanies}
                className="w-full mt-4 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 hover:border-red-500/30 rounded-xl text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2 font-medium"
              >
                See More <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

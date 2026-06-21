// --- Core React & Router ---
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- Context Providers ---
import { AuthProvider } from './context/auth/AuthContext';
import { JobsProvider } from './context/student/JobsContext';
import { ApplicationsProvider } from './context/student/ApplicationsContext';
import { StatsProvider } from './context/common/StatsContext';
import { ProfileProvider } from './context/common/ProfileContext';
import { CompanyProvider } from './context/company/CompanyContext';

// --- Hooks & Shared Components ---
import { useAuth } from './hooks/auth/useAuth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Loading } from './components/common/Loading';
import { Placeholder } from './components/common/Placeholder';

// --- Layouts ---
import { StudentLayout } from './layouts/StudentLayout';
import { CompanyLayout } from './layouts/CompanyLayout';

// --- Pages: Common & Public ---
import { LandingPage } from './pages/common/LandingPage';
import { HomePage } from './pages/common/HomePage';
import { JobDetails } from './pages/common/JobDetails';
import { Stats } from './pages/common/Stats';
import { ProfilePage } from './pages/common/ProfilePage';
import { CompanyPublicProfile } from './pages/common/CompanyPublicProfile';

// --- Pages: Auth ---
import { AuthPage } from './pages/auth/AuthPage';

// --- Pages: Student ---
import { SearchJobs } from './pages/student/SearchJobs';
import { ApplicationDetails } from './pages/student/ApplicationDetails';
import { MyApplications } from './pages/student/MyApplications';

// --- Pages: Company ---
import { PostJob } from './pages/company/PostJob';
import { EditJob } from './pages/company/EditJob';
import { CompanyApplications } from './pages/company/CompanyApplications';
import { CompanyApplicationDetails } from './pages/company/CompanyApplicationDetails';
import { SearchStudents } from './pages/company/SearchStudents';

// --- Pages: Admin ---
import { AdminHome } from './pages/admin/AdminHome';
import { AdminSearch } from './pages/admin/AdminSearch';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminReportDetails } from './pages/admin/AdminReportDetails';

import { BlockedPage } from './pages/auth/BlockedPage';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminHomeProvider } from './context/admin/AdminHomeContext';
import { AdminReportsProvider } from './context/admin/AdminReportsContext';

// Helper component to redirect logged-in users away from public pages
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return null;
  
  if (user.role === 'STUDENT') {
    return <StudentLayout />;
  }
  
  if (user.role === 'COMPANY') {
    return <CompanyLayout />;
  }
  
  if (user.role === 'ADMIN') {
    return (
      <AdminHomeProvider>
        <AdminReportsProvider>
          <AdminLayout />
        </AdminReportsProvider>
      </AdminHomeProvider>
    );
  }
  
  return <Outlet />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <LandingPage />
        </PublicRoute>
      } />
      
      <Route path="/auth" element={
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      } />

      <Route path="/blocked" element={<BlockedPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<DashboardRouter />}>
          {/* Default Index Route - will render role-specific home page inside the Layout */}
          <Route index element={
            <RoleBasedHome />
          } />
          
          <Route path="search" element={<RoleBasedSearch />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="report/:reportId" element={<AdminReportDetails />} />
          <Route path="job/:jobId" element={<JobDetails />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="applications/:id" element={<ApplicationDetails />} />
          <Route path="stats/:userId" element={<Stats />} />
          <Route path="profile" element={<ProfilePage />} />
          
          {/* Company-specific routes mapped to the same layout */}
          <Route path="company-applications" element={<CompanyApplications />} />
          <Route path="company-application/:applicationId" element={<CompanyApplicationDetails />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="edit-job/:jobId" element={<EditJob />} />
          <Route path="search-students" element={<SearchStudents />} />
          <Route path="company/:companyId" element={<CompanyPublicProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}

// Helper component for Role-based Home routing
const RoleBasedHome = () => {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') return <AdminHome />;
  return <HomePage />;
};

// Helper component for Role-based Search routing
const RoleBasedSearch = () => {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') return <AdminSearch />;
  return <SearchJobs />;
};

function App() {
  return (
    <AuthProvider>
      <JobsProvider>
        <ApplicationsProvider>
          <StatsProvider>
            <ProfileProvider>
              <CompanyProvider>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </CompanyProvider>
            </ProfileProvider>
          </StatsProvider>
        </ApplicationsProvider>
      </JobsProvider>
    </AuthProvider>
  );
}

export default App;

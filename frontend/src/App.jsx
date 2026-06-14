import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { SearchJobs } from './pages/SearchJobs';
import { JobDetails } from './pages/JobDetails';
import { ApplicationDetails } from './pages/ApplicationDetails';
import { MyApplications } from './pages/MyApplications';
import { Stats } from './pages/Stats';
import { AuthProvider } from './context/AuthContext';
import { JobsProvider } from './context/JobsContext';
import { ApplicationsProvider } from './context/ApplicationsContext';
import { StatsProvider } from './context/StatsContext';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Loading } from './components/utils/Loading';
import { StudentLayout } from './layouts/StudentLayout';
import { Placeholder } from './components/utils/Placeholder';
import { Outlet } from 'react-router-dom';

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
  
  // Fallback for other roles (Company, Admin)
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

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<DashboardRouter />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchJobs />} />
          <Route path="job/:jobId" element={<JobDetails />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="applications/:id" element={<ApplicationDetails />} />
          <Route path="stats/:userId" element={<Stats />} />
          <Route path="profile" element={<Placeholder title="Profile" />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <JobsProvider>
        <ApplicationsProvider>
          <StatsProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </StatsProvider>
        </ApplicationsProvider>
      </JobsProvider>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { ProtectedRoute, RoleProtectedRoute } from './components/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import SeekerLogin from './pages/seeker/SeekerLogin';
import EmployerLogin from './pages/employer/EmployerLogin';

// Job Seeker pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import MyApplications from './pages/seeker/MyApplications';
import ApplyJob from './pages/seeker/ApplyJob';

// Employer pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import MyJobs from './pages/employer/MyJobs';
import PostJob from './pages/employer/PostJob';
import EditJob from './pages/employer/EditJob';
import EmployerApplications from './pages/employer/EmployerApplications';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/seeker/login" element={<SeekerLogin />} />
            <Route path="/employer/login" element={<EmployerLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Job Seeker protected */}
            <Route path="/seeker/dashboard" element={
              <RoleProtectedRoute role="jobseeker">
                <SeekerDashboard />
              </RoleProtectedRoute>
            } />
            <Route path="/seeker/applications" element={
              <RoleProtectedRoute role="jobseeker">
                <MyApplications />
              </RoleProtectedRoute>
            } />
            <Route path="/apply/:id" element={
              <RoleProtectedRoute role="jobseeker">
                <ApplyJob />
              </RoleProtectedRoute>
            } />

            {/* Employer protected */}
            <Route path="/employer/dashboard" element={
              <RoleProtectedRoute role="employer">
                <EmployerDashboard />
              </RoleProtectedRoute>
            } />
            <Route path="/employer/my-jobs" element={
              <RoleProtectedRoute role="employer">
                <MyJobs />
              </RoleProtectedRoute>
            } />
            <Route path="/employer/post-job" element={
              <RoleProtectedRoute role="employer">
                <PostJob />
              </RoleProtectedRoute>
            } />
            <Route path="/employer/edit-job/:id" element={
              <RoleProtectedRoute role="employer">
                <EditJob />
              </RoleProtectedRoute>
            } />
            <Route path="/employer/applications" element={
              <RoleProtectedRoute role="employer">
                <EmployerApplications />
              </RoleProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <div style={{ fontSize: '5rem' }}>404</div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Page Not Found</h1>
                <a href="/" style={{ color: 'var(--clr-primary)' }}>← Go Home</a>
              </div>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

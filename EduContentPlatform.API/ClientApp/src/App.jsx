
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import { UploadProvider } from './context/UploadContext'

// Layouts
import MainLayout from './components/common/Layout/MainLayout'
import DashboardLayout from './components/common/Layout/DashboardLayout'

// Pages
import HomePage from './pages/Home/HomePage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ForgotPassword from './pages/Auth/ForgotPassword'
import BrowsePage from './pages/Browse/BrowsePage'
import ContentViewer from './pages/Content/ContentViewer'
import ContentRead from './pages/Content/ContentRead'
import UploadPage from './pages/Upload/UploadPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import MyContent from './pages/Dashboard/MyContent'
import MyPublications from './pages/Dashboard/MyPublications'
import Settings from './pages/Dashboard/Settings'
import TeacherUpload from './pages/Upload/TeacherUpload'
import ScholarUpload from './pages/Upload/ScholarUpload'
import TeacherCourses from './pages/Teacher/TeacherCourses'
import CourseEdit from './pages/Teacher/CourseEdit'
import AdminDashboard from './pages/Admin/AdminDashboard'
import EditorialDashboard from './pages/Editorial/EditorialDashboard'
import { de } from 'date-fns/locale'

// --- Protected Route Logic ---
// role synonyms mapping
const roleSynonyms = {
  scholar: 'publisher',
  publisher: 'scholar',
}

const normalizeRole = (r) => (r ? String(r).toLowerCase() : '')

// Use AuthContext to determine auth state & user
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  debugger;
  // useAuth must be used inside AuthProvider; App wraps children with AuthProvider below
  const { user, isAuthenticated } = useAuth() || {};

  // If not authenticated -> redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check them
  if (allowedRoles.length > 0) {
    debugger;
    const userRole = normalizeRole(user.displayName || (Array.isArray(user.displayName) ? user.roles[0] : undefined));
    const normalizedAllowed = allowedRoles.map(normalizeRole);

    const allowed = normalizedAllowed.some(ar => {
      debugger;
      if (ar === userRole) return true;
      if (roleSynonyms[userRole] === ar) return true;
      if (roleSynonyms[ar] === userRole) return true;
      return false;
    });

    if (!allowed) {
      // user is authenticated but not authorized for this route
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <UploadProvider>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/browse" element={<BrowsePage />} />

            <Route
              path="/content/:id"
              element={<MainLayout><ContentViewer /></MainLayout>}
            />
            <Route
              path="/content/read/:id"
              element={<MainLayout><ContentRead /></MainLayout>}
            />

            {/* Upload Routes */}
            <Route
              path="/upload"
              element={
                <ProtectedRoute allowedRoles={['teacher', 'scholar', 'editor', 'reviewer', 'admin']}>
                  <MainLayout><UploadPage /></MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/upload"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <MainLayout><TeacherUpload /></MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/courses"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <MainLayout><TeacherCourses /></MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/courses/:id"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <MainLayout><CourseEdit /></MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/scholar/upload"
              element={
                <ProtectedRoute allowedRoles={['scholar']}>
                  <MainLayout><ScholarUpload /></MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout><DashboardPage /></DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/content"
              element={
                <ProtectedRoute allowedRoles={['teacher', 'scholar', 'editor', 'reviewer', 'admin']}>
                  <DashboardLayout><MyContent /></DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/publications"
              element={
                <ProtectedRoute allowedRoles={['scholar', 'editor', 'reviewer', 'admin']}>
                  <DashboardLayout><MyPublications /></DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout><Settings /></DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout><AdminDashboard /></DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Editorial Routes */}
            <Route
              path="/editorial"
              element={
                <ProtectedRoute allowedRoles={['editor', 'reviewer']}>
                  <DashboardLayout><EditorialDashboard /></DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </UploadProvider>
      </ContentProvider>
    </AuthProvider>
  )
}

export default App

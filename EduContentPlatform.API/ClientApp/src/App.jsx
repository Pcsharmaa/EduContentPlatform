import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import { UploadProvider } from './context/UploadContext'
import RoleBasedDashboard from './components/common/RoleBasedDashboard'

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

// --- Protected Route Logic ---
const roleSynonyms = {
  scholar: 'publisher',
  publisher: 'scholar',
}

const normalizeRole = (r) => (r ? String(r).toLowerCase() : '')

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const rawUser = localStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null
  const token = localStorage.getItem('token')

  if (!token || !user) {
    return <Navigate to="/login" />
  }

  if (allowedRoles.length > 0) {
    const userRole = normalizeRole(user.displayName || user.roles?.[0])
    const normalizedAllowed = allowedRoles.map(normalizeRole)

    const allowed = normalizedAllowed.some(ar => {
      if (ar === userRole) return true
      if (roleSynonyms[userRole] === ar) return true
      if (roleSynonyms[ar] === userRole) return true
      return false
    })

    if (!allowed) return <Navigate to="/" />
  }

  return children
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
                <ProtectedRoute allowedRoles={['Teacher', 'Scholar', 'Editor', 'Reviewer', 'Admin']}>
                  <MainLayout><UploadPage /></MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/upload"
              element={
                <ProtectedRoute allowedRoles={['Teacher']}>
                  <MainLayout><TeacherUpload /></MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/courses"
              element={
                <ProtectedRoute allowedRoles={['Teacher']}>
                  <MainLayout><TeacherCourses /></MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/teacher/courses/:id"
              element={
                <ProtectedRoute allowedRoles={['Teacher']}>
                  <MainLayout><CourseEdit /></MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/scholar/upload"
              element={
                <ProtectedRoute allowedRoles={['Scholar']}>
                  <MainLayout><ScholarUpload /></MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Dashboard Routes */}
                    <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleBasedDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/content"
              element={
                <ProtectedRoute allowedRoles={['Teacher', 'Scholar', 'Editor', 'Reviewer', 'Admin']}>
                  <DashboardLayout><MyContent /></DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/publications"
              element={
                <ProtectedRoute allowedRoles={['Scholar', 'Editor', 'Reviewer', 'Admin']}>
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
                <ProtectedRoute allowedRoles={['Admin']}>
                  <DashboardLayout><AdminDashboard /></DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Editorial Routes */}
            <Route
              path="/editorial"
              element={
                <ProtectedRoute allowedRoles={['Editor', 'Reviewer']}>
                  <DashboardLayout><EditorialDashboard /></DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </UploadProvider>
      </ContentProvider>
    </AuthProvider>
  )
}

export default App

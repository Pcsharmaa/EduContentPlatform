import React from 'react';
import Sidebar from './Sidebar';
import Header from '../Header/Header';
import { useAuth } from '../../../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = ({ children, role }) => {
  const { user } = useAuth();
  
  const dashboardTitle = {
    student: 'Student Dashboard',
    teacher: 'Teacher Dashboard',
    scholar: 'Scholar Dashboard',
    editor: 'Editor Dashboard',
    reviewer: 'Reviewer Dashboard',
    admin: 'Admin Dashboard'
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={role || user?.displayName} />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          <div className="dashboard-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
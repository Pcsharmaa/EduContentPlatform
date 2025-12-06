import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  const { user } = useAuth();
  
  const studentMenu = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/dashboard/my-library', label: 'My Library', icon: '📚' },
    { path: '/dashboard/bookmarks', label: 'Bookmarks', icon: '🔖' },
    { path: '/dashboard/progress', label: 'Learning Progress', icon: '📈' },
    { path: '/dashboard/history', label: 'History', icon: '🕐' },
  ];
  
  const teacherMenu = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/dashboard/my-content', label: 'My Content', icon: '📄' },
    { path: '/dashboard/upload', label: 'Upload Content', icon: '⬆️' },
    { path: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
    { path: '/dashboard/students', label: 'My Students', icon: '👥' },
  ];
  
  const scholarMenu = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/dashboard/publications', label: 'Publications', icon: '📄' },
    { path: '/dashboard/research-tools', label: 'Research Tools', icon: '🔬' },
    { path: '/dashboard/collaborations', label: 'Collaborations', icon: '👥' },
  ];
  
  const editorMenu = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/dashboard/content-queue', label: 'Content Queue', icon: '🕐' },
    { path: '/dashboard/assign-reviewers', label: 'Assign Reviewers', icon: '👥' },
    { path: '/dashboard/calendar', label: 'Editorial Calendar', icon: '📅' },
    { path: '/dashboard/approval', label: 'Content Approval', icon: '✓' },
  ];
  
  const reviewerMenu = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    { path: '/dashboard/review-queue', label: 'Review Queue', icon: '🕐' },
    { path: '/dashboard/review-history', label: 'Review History', icon: '📄' },
    { path: '/dashboard/feedback', label: 'Feedback', icon: '💬' },
  ];
  
  const adminMenu = [
    { path: '/admin', label: 'Overview', icon: '📊' },
    { path: '/admin/users', label: 'User Management', icon: '👥' },
    { path: '/admin/content', label: 'Content Moderation', icon: '📄' },
    { path: '/admin/analytics', label: 'System Analytics', icon: '📈' },
    { path: '/admin/settings', label: 'System Settings', icon: '⚙️' },
  ];
  
  const getMenuByRole = () => {
    switch(role || user?.displayName) {
      case 'Student': return studentMenu;
      case 'Teacher': return teacherMenu;
      case 'Scholar': return scholarMenu;
      case 'Editor': return editorMenu;
      case 'Reviewer': return reviewerMenu;
      case 'Admin': return adminMenu;
      default: return [];
    }
  };
  
  const menuItems = getMenuByRole();
  
  const commonMenu = [
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/help', label: 'Help & Support', icon: '❓' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // initialize from localStorage
    const saved = localStorage.getItem('sidebar-collapsed');
    const isCollapsed = saved === 'true';
    setCollapsed(isCollapsed);
    document.documentElement.classList.toggle('sidebar-collapsed', isCollapsed);
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar-collapsed', next ? 'true' : 'false');
    document.documentElement.classList.toggle('sidebar-collapsed', next);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''}`} aria-expanded={!collapsed}>
      <div className="sidebar-header">
        <button
          className="collapse-toggle"
          onClick={toggleCollapse}
          aria-pressed={collapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '▶' : '◀'}
        </button>
        <h2>EduPlatform</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="sidebar-divider"></div>
        
        <ul className="nav-menu">
          {commonMenu.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <h4>{user?.name || 'User'}</h4>
            <p className="user-role">{role || user?.displayName}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
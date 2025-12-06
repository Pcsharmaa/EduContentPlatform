import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../UI/Button/Button';
import './header.css';
// Dev-only impersonation helper (shows only in dev)
import DevImpersonate from '../../dev/DevImpersonate';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, toggleTheme, isDarkMode } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">EduContent</span>
        </Link>

        {/* Navigation Links */}
        <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/browse" className="nav-link">
            Browse
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/upload" className="nav-link">
                Upload
              </Link>
            </>
          )}
        </nav>

        {/* Right Section */}
        <div className="header-right">
          {!isAuthenticated ? (
            <div className="header-actions">
              <Button variant="ghost" to="/login" className="nav-link">
                Sign In
              </Button>
              <Button variant="primary" to="/register">
                Sign Up
              </Button>
            </div>
          ) : (
            <div className="header-user">
              <div className="user-menu-trigger" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <div className="user-avatar">
                  {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="user-name">{user?.firstName}</span>
                <span className={`dropdown-icon ${isUserMenuOpen ? 'open' : ''}`}>▼</span>
              </div>

              {isUserMenuOpen && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-header">
                    <p className="user-email">{user?.email}</p>
                    <p className="user-role">
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
                    </p>
                  </div>

                  <div className="user-menu-divider" />

                  <Link to="/dashboard" className="menu-item" onClick={() => setIsUserMenuOpen(false)}>
                    <span className="menu-icon">📊</span>
                    Dashboard
                  </Link>

                  <Link to="/dashboard/settings" className="menu-item" onClick={() => setIsUserMenuOpen(false)}>
                    <span className="menu-icon">⚙️</span>
                    Settings
                  </Link>

                  {user?.role === 'admin' && (
                    <Link to="/admin" className="menu-item" onClick={() => setIsUserMenuOpen(false)}>
                      <span className="menu-icon">👑</span>
                      Admin Panel
                    </Link>
                  )}

                  {['editor', 'reviewer'].includes(user?.role) && (
                    <Link to="/editorial" className="menu-item" onClick={() => setIsUserMenuOpen(false)}>
                      <span className="menu-icon">✏️</span>
                      Editorial
                    </Link>
                  )}

                  <div className="user-menu-divider" />

                  <button className="menu-item menu-item--logout" onClick={handleLogout}>
                    <span className="menu-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
        {/* Dev impersonation widget - only visible in development */}
        <div style={{ marginLeft: 12 }}>
          <DevImpersonate />
        </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/common/Layout/MainLayout';
import LoginForm from '../../components/user/Auth/LoginForm';
import { useAuth } from '../../context/AuthContext';
import './auth.css';

const LoginPage = () => {
  const { login, user, error: authError } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (credentials) => {
    try {
      setError('');
      setSuccess('');
      await login(credentials);
      setSuccess('Login successful! Redirecting...');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="auth-page">
        <div className="container">
          <div className="card auth-container mx-auto" role="main" aria-labelledby="login-heading">
            <div className="auth-header">
              <h1 id="login-heading" className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Sign in to your account to continue</p>
            </div>

          {authError && (
            <div className="auth-error">
              {authError}
            </div>
          )}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

            <LoginForm onSubmit={handleLogin} />

          <div className="auth-links">
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
            <div className="auth-divider">|</div>
            <Link to="/register" className="auth-link">
              Don't have an account? Sign up
            </Link>
          </div>

            <div className="auth-footer">
              <p className="auth-footer-text">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="auth-footer-link">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="auth-footer-link">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
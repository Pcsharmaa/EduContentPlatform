import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/common/Layout/MainLayout';
import RegisterForm from '../../components/user/Auth/RegisterForm';
import { useAuth } from '../../context/AuthContext';
import './auth.css';

const RegisterPage = () => {
  const { register, user, error: authError } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRegister = async (userData) => {
    try {
      setError('');
      setSuccess('');
      await register(userData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join our platform to share and discover educational content</p>
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

          <RegisterForm onSubmit={handleRegister} />

          <div className="auth-links">
            <p className="auth-text">Already have an account?</p>
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </div>

          <div className="auth-footer">
            <p className="auth-footer-text">
              By creating an account, you agree to our{' '}
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
    </MainLayout>
  );
};

export default RegisterPage;

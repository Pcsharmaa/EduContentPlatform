import React, { useState } from 'react';
import Modal from '../../common/UI/Modal/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { useAuth } from '../../../context/AuthContext';
import './auth.css';

const AuthModal = ({ isOpen, onClose, defaultView = 'login' }) => {
  const { login, register, forgotPassword } = useAuth();
  const [currentView, setCurrentView] = useState(defaultView);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError('');
      await login(credentials);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      setError('');
      await register(userData);
      // After successful registration, switch to login view
      setCurrentView('login');
      setError('Registration successful! Please check your email to verify your account.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      setLoading(true);
      setError('');
      await forgotPassword(email);
      setError('If an account exists with this email, you will receive password reset instructions.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return (
          <>
            <div className="modal-header">
              <h2 className="modal-title">Welcome Back</h2>
              <p className="modal-subtitle">Sign in to your account to continue</p>
            </div>
            
            <LoginForm
              onSubmit={handleLogin}
              loading={loading}
              error={error}
            />
            
            <div className="modal-footer">
              <p className="modal-footer-text">
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setCurrentView('register');
                    setError('');
                  }}
                  className="modal-footer-link"
                >
                  Sign up
                </button>
              </p>
              <button
                onClick={() => {
                  setCurrentView('forgot');
                  setError('');
                }}
                className="modal-footer-link forgot-link"
              >
                Forgot password?
              </button>
            </div>
          </>
        );

      case 'register':
        return (
          <>
            <div className="modal-header">
              <h2 className="modal-title">Create Account</h2>
              <p className="modal-subtitle">Join our community of educators and learners</p>
            </div>
            
            <RegisterForm
              onSubmit={handleRegister}
              loading={loading}
              error={error}
            />
            
            <div className="modal-footer">
              <p className="modal-footer-text">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setCurrentView('login');
                    setError('');
                  }}
                  className="modal-footer-link"
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        );

      case 'forgot':
        return (
          <>
            <div className="modal-header">
              <h2 className="modal-title">Reset Password</h2>
              <p className="modal-subtitle">
                Enter your email address and we'll send you reset instructions
              </p>
            </div>
            
            <ForgotPasswordForm
              onSubmit={handleForgotPassword}
              loading={loading}
              error={error}
            />
            
            <div className="modal-footer">
              <button
                onClick={() => {
                  setCurrentView('login');
                  setError('');
                }}
                className="modal-footer-link"
              >
                Back to login
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="medium"
      showClose={true}
    >
      <div className="auth-modal">
        {renderContent()}
      </div>
    </Modal>
  );
};

const ForgotPasswordForm = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail() && onSubmit) {
      onSubmit(email);
    }
  };

  return (
    <div className="forgot-password-form">
      {error && (
        <div className={`form-error-message ${error.includes('successful') ? 'success' : ''}`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          placeholder="Enter your email"
          required
          error={emailError}
          disabled={loading}
          icon="✉️"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Send Reset Instructions
        </Button>
      </form>
    </div>
  );
};

export default AuthModal;
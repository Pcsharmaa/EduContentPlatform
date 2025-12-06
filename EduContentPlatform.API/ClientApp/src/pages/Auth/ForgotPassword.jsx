import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/common/Layout/MainLayout';
import Button from '../../components/common/UI/Button/Button';
import FormInput from '../../components/common/Forms/FormInput';
import { useAuth } from '../../context/AuthContext';
import './auth.css';

const ForgotPassword = () => {
  const { forgotPassword, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const navigate = useNavigate();

  const validateEmail = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setSuccess('Password reset link has been sent to your email!');
      setStep('reset');
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">
              {step === 'email' 
                ? 'Enter your email to receive a password reset link' 
                : 'Check your email for further instructions'}
            </p>
          </div>

          {authError && <div className="auth-error">{authError}</div>}
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="auth-form">
              <FormInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
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
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="reset-success">
              <div className="success-icon">✓</div>
              <p className="reset-message">
                A password reset link has been sent to <strong>{email}</strong>
              </p>
              <p className="reset-instruction">
                Please check your email and click the link to reset your password.
              </p>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </div>
          )}

          <div className="auth-links">
            <Link to="/login" className="auth-link">
              Remember your password? Sign in
            </Link>
            <div className="auth-divider">|</div>
            <Link to="/register" className="auth-link">
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;

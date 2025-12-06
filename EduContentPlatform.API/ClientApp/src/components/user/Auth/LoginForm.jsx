import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../../common/Forms/FormInput';
import Button from '../../common/UI/Button/Button';
import './auth.css';

const LoginForm = ({ onSubmit, loading = false, error = '' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (onSubmit) {
        onSubmit({
          email: formData.email,
          password: formData.password,
        });
      }
    }
  };

  const handleSocialLogin = (provider) => {
    // This would integrate with social login APIs
    console.log(`Social login with ${provider}`);
  };

  return (
    <div className="login-form">
      {/* Social Login Options */}
      <div className="social-login">
        <h3 className="social-title">Or continue with</h3>
        <div className="social-buttons">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="social-button google"
          >
            <span className="social-icon">G</span>
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            className="social-button github"
          >
            <span className="social-icon">Git</span>
            GitHub
          </button>
        </div>
      </div>

      <div className="divider">
        <span className="divider-text">or</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="form-error-message">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          error={errors.email}
          disabled={loading}
          icon="✉️"
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          error={errors.password}
          disabled={loading}
          icon="🔒"
        />

        <div className="form-options">
          <label className="checkbox-option">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
            />
            <span className="checkbox-label">Remember me</span>
          </label>

          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Sign In
        </Button>
      </form>

      {/* Terms and Privacy */}
      <div className="form-footer">
        <p className="terms-text">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="footer-link">Terms of Service</Link> and{' '}
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
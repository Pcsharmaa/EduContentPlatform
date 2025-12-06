import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../../common/Forms/FormInput';
import FormSelect from '../../common/Forms/FormSelect';
import Button from '../../common/UI/Button/Button';
import { USER_ROLES } from '../../../constants/userRoles';
import './auth.css';

const RegisterForm = ({ onSubmit, loading = false, error = '' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.STUDENT,
    institution: '',
    department: '',
    agreeToTerms: false,
    receiveUpdates: true,
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const roles = [
    { value: USER_ROLES.STUDENT, label: 'Student' },
    { value: USER_ROLES.TEACHER, label: 'Teacher' },
    { value: USER_ROLES.SCHOLAR, label: 'Scholar' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password is too weak';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(newValue);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength++;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Contains numbers
    if (/[0-9]/.test(password)) strength++;
    
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    setPasswordStrength(Math.min(strength, 5));
  };

  const getPasswordStrengthLabel = () => {
    const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
    return labels[passwordStrength];
  };

  const getPasswordStrengthColor = () => {
    const colors = ['#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981', '#059669'];
    return colors[passwordStrength];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (onSubmit) {
        onSubmit({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          institution: formData.institution,
          department: formData.department,
        });
      }
    }
  };

  return (
    <div className="register-form">
      {/* Error Message */}
      {error && (
        <div className="form-error-message">
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-row">
          <FormInput
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
            error={errors.firstName}
            disabled={loading}
          />

          <FormInput
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
            error={errors.lastName}
            disabled={loading}
          />
        </div>

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

        <FormSelect
          label="I am a"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={roles}
          required
          disabled={loading}
        />

        <FormInput
          label="Institution/Organization"
          type="text"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          placeholder="e.g., University of Education"
          disabled={loading}
        />

        <FormInput
          label="Department"
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="e.g., Computer Science"
          disabled={loading}
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password (min. 8 characters)"
          required
          error={errors.password}
          disabled={loading}
          icon="🔒"
        />

        {/* Password Strength Meter */}
        {formData.password && (
          <div className="password-strength">
            <div className="strength-meter">
              <div 
                className="strength-bar"
                style={{
                  width: `${(passwordStrength / 5) * 100}%`,
                  backgroundColor: getPasswordStrengthColor(),
                }}
              />
            </div>
            <div className="strength-info">
              <span className="strength-label">Password strength:</span>
              <span className="strength-value" style={{ color: getPasswordStrengthColor() }}>
                {getPasswordStrengthLabel()}
              </span>
            </div>
            <div className="strength-requirements">
              <span className={`requirement ${formData.password.length >= 8 ? 'met' : ''}`}>
                At least 8 characters
              </span>
              <span className={`requirement ${/[a-z]/.test(formData.password) ? 'met' : ''}`}>
                Lowercase letter
              </span>
              <span className={`requirement ${/[A-Z]/.test(formData.password) ? 'met' : ''}`}>
                Uppercase letter
              </span>
              <span className={`requirement ${/[0-9]/.test(formData.password) ? 'met' : ''}`}>
                Number
              </span>
            </div>
          </div>
        )}

        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
          error={errors.confirmPassword}
          disabled={loading}
          icon="🔒"
        />

        <div className="form-options">
          <label className={`checkbox-option ${errors.agreeToTerms ? 'error' : ''}`}>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              disabled={loading}
            />
            <span className="checkbox-label">
              I agree to the{' '}
              <Link to="/terms" className="inline-link">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="inline-link">Privacy Policy</Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <div className="checkbox-error">{errors.agreeToTerms}</div>
          )}

          <label className="checkbox-option">
            <input
              type="checkbox"
              name="receiveUpdates"
              checked={formData.receiveUpdates}
              onChange={handleChange}
              disabled={loading}
            />
            <span className="checkbox-label">
              I want to receive updates and announcements
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Create Account
        </Button>
      </form>

      {/* Already have account */}
      <div className="form-footer">
        <p className="have-account">
          Already have an account?{' '}
          <Link to="/login" className="footer-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
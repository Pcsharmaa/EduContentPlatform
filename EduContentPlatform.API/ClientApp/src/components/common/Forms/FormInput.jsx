import React, { useState } from 'react';
import './form.css';

const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  icon,
  hint,
  autoComplete = 'off',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`form-group ${error ? 'form-group--error' : ''} ${isFocused ? 'form-group--focused' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className="form-input"
          required={required}
        />
      </div>

      {error && <span className="form-error">{error}</span>}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
};

export default FormInput;

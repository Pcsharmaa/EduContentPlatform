import React from 'react';
import './form.css';

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  hint,
}) => {
  return (
    <div className={`form-group ${error ? 'form-group--error' : ''}`}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="form-select"
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <span className="form-error">{error}</span>}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
};

export default FormSelect;

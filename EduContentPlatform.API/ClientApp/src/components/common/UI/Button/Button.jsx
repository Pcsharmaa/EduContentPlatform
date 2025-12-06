import React from 'react';
import { Link } from 'react-router-dom';
import './button.css';

export const Button = React.forwardRef(({
  
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  to,
  href,
  className = '',
  icon,
  ...props
}, ref) => {
  const baseClass = `btn btn-${variant} btn-${size}`;
  const classes = `${baseClass} ${fullWidth ? 'btn-full-width' : ''} ${className}`;

  const isDisabled = disabled || loading;

  // If it's a link
  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        ref={ref}
        {...props}
      >
        {loading && <span className="btn-loader" />}
        {icon && <span className="btn-icon">{icon}</span>}
        {children}
      </Link>
    );
  }

  // If it's an external link
  if (href) {
    debugger;
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        ref={ref}
        {...props}
      >
        {loading && <span className="btn-loader" />}
        {icon && <span className="btn-icon">{icon}</span>}
        {children}
      </a>
    );
  }

  // Default button
  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      onClick={onClick}
      ref={ref}
      {...props}
    >
      {loading && <span className="btn-loader" />}
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Premium Form Input component with label, error states, and icon slots.
 */
const Input = React.forwardRef(({
  label,
  error,
  helperText,
  iconLeft = null,
  iconRight = null,
  required = false,
  disabled = false,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const baseInputStyles = 'w-full rounded-xl bg-dark-950 border text-sm text-neutral-100 placeholder-neutral-500 transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const normalState = 'border-dark-800 focus:border-accent-500 focus:ring-accent-500/20';
  const errorState = 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20 text-rose-100';

  const stateStyle = error ? errorState : normalState;

  const paddingLeft = iconLeft ? 'pl-11' : 'pl-4';
  const paddingRight = (iconRight && error) ? 'pr-16' : (iconRight || error) ? 'pr-11' : 'pr-4';

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-xs font-semibold tracking-wide text-neutral-300 select-none"
        >
          {label}
          {required && <span className="text-accent-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {iconLeft && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-neutral-400">
            {iconLeft}
          </div>
        )}

        <input
          ref={ref}
          id={generatedId}
          type={type}
          disabled={disabled}
          className={`${baseInputStyles} ${stateStyle} ${paddingLeft} ${paddingRight} py-2.5 ${className}`}
          {...props}
        />

        <div className="absolute right-3.5 flex items-center gap-2">
          {error && (
            <div className="flex items-center pointer-events-none text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {iconRight && (
            <div className="flex items-center text-neutral-400">
              {iconRight}
            </div>
          )}
        </div>
      </div>

      {error ? (
        <p className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-neutral-400 mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

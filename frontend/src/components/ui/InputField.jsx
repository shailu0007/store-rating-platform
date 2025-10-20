import React from 'react';
import clsx from 'clsx';

const InputField = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
  error,
  startIcon,
  endIcon,
  className = '',
  ...rest
}) => {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {startIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{startIcon}</div>}
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={clsx(
            'w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500',
            startIcon ? 'pl-10' : '',
            endIcon ? 'pr-10' : ''
          )}
          aria-invalid={!!error}
          {...rest}
        />
        {endIcon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">{endIcon}</div>}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;

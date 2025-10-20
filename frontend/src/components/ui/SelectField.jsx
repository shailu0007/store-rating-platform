import React from 'react';
import clsx from 'clsx';

const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  required = false,
  error,
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
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
        aria-invalid={!!error}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField;

import React from 'react';

const Loader = ({ size = 48, label = 'Loading...' }) => {
  const stroke = Math.max(2, Math.floor(size / 12));
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={stroke}
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
};

export default Loader;

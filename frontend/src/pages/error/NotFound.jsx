import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mx-auto">
          <AlertCircle className="text-red-600" size={36} />
        </div>

        <h1 className="mt-6 text-4xl font-bold text-gray-800">Page not found</h1>
        <p className="mt-2 text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Go to home
          </Link>

          <Link
            to="/auth/login"
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

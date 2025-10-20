import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-50 mx-auto">
          <Lock className="text-yellow-600" size={36} />
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-gray-800">Unauthorized</h1>
        <p className="mt-2 text-gray-600">
          You do not have permission to view this page. Please sign in with an account that has access.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/auth/login"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Sign in
          </Link>

          <Link
            to="/"
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            Go to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

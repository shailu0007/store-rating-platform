import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          © {year} Store Rating — Built with care.
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/about" className="text-gray-600 hover:text-indigo-600">About</Link>
          <Link to="/terms" className="text-gray-600 hover:text-indigo-600">Terms</Link>
          <Link to="/privacy" className="text-gray-600 hover:text-indigo-600">Privacy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

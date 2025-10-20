import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';
import { useAuth } from '../../context/AuthContext';

const roleToPath = {
  NORMAL_USER: '/',
  SYSTEM_ADMIN: '/admin/dashboard',
  STORE_OWNER: '/owner/dashboard',
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const info = location.state?.info || '';

  const handleLogin = async (payload) => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await login(payload); 
      const user = res?.user ?? res?.data?.user ?? res?.userData ?? null;
      const role = (user && user.role) ? user.role : (res?.role ?? null);

      const dest = roleToPath[role] || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      console.error('Login failed', err);
      const message = err?.response?.data?.message || err?.message || 'Login failed';
      setErrorMessage(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        {info && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
            {info}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <LoginForm onSubmit={handleLogin} />

        <div className="mt-4 text-sm text-center text-gray-600">
          Don't have an account? <Link to="/auth/signup" className="text-indigo-600 hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

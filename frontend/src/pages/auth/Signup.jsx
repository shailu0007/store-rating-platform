import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SignupForm from '../../components/forms/SignupForm';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async (payload) => {
    setErrorMessage('');
    setSubmitting(true);
    try {
      const res = await signup(payload);
      navigate('/auth/login', { state: { info: 'Signup successful — please login.' }});
    } catch (err) {
      console.error('Signup failed', err);
      const message = err?.response?.data?.message || err?.message || 'Signup failed';
      setErrorMessage(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-lg">
        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        <SignupForm onSubmit={handleSignup} />

        <div className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <Link to="/auth/login" className="text-indigo-600 hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

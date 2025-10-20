import React, { useState } from 'react';
import PasswordUpdateForm from '../../components/forms/PasswordUpdateForm';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
  const { changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = async (payload) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await changePassword({ currentPassword: payload.currentPassword, newPassword: payload.newPassword });
      setSuccess('Password updated successfully.');
      setTimeout(() => navigate('/', { replace: true }), 1200);
    } catch (err) {
      console.error('Password update failed', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to update password';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Change password</h1>

      {loading && <Loader />}

      {error && <div className="mb-4 p-3 text-sm rounded bg-red-50 text-red-700">{error}</div>}
      {success && <div className="mb-4 p-3 text-sm rounded bg-green-50 text-green-700">{success}</div>}

      <PasswordUpdateForm onSubmit={handleChange} />
    </div>
  );
};

export default UpdatePassword;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axiosInstance';
import AddUserForm from '../../components/forms/AddUserForm';
import { toast } from 'react-toastify';
import userApi from '../../api/userApi';

const AddUser = () => {
  const navigate = useNavigate();

  const handleAddUser = async (payload) => {
    try {
      await userApi.create(payload);
      navigate('/admin/manage-users');
    } catch (err) {
      console.error('Add user failed', err);
      throw new Error(err?.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Add User</h1>
      <AddUserForm onSubmit={handleAddUser} />
    </div>
  );
};

export default AddUser;

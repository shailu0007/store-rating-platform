// src/pages/owner/AddStore.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import storeApi from '../../api/storeApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const OwnerAddStore = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // For owners, do NOT send owner_id from client. Backend should set owner_id = req.user.id.
      // Only send name, address, category, email (optional)
      const payload = {
        name: data.name,
        email: data.email || null,
        address: data.address,
        category: data.category,
      };
      await storeApi.create(payload); // ensure your storeApi.create posts to /api/stores
      toast?.success('Store created');
      navigate('/owner'); // return to owner dashboard or owner store list
    } catch (err) {
      console.error('OwnerAddStore error', err);
      toast?.error(err?.response?.data?.message || 'Failed to create store');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Your Store</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm">Store Name</label>
          <input {...register('name', { required: 'Store name required' })} className="w-full px-3 py-2 border rounded" />
          {errors.name && <div className="text-xs text-red-500">{errors.name.message}</div>}
        </div>

        <div>
          <label className="block text-sm">Email (optional)</label>
          <input type="email" {...register('email')} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm">Address</label>
          <input {...register('address', { required: 'Address required' })} className="w-full px-3 py-2 border rounded" />
          {errors.address && <div className="text-xs text-red-500">{errors.address.message}</div>}
        </div>

        <div>
          <label className="block text-sm">Category</label>
          <input {...register('category', { required: 'Category required' })} className="w-full px-3 py-2 border rounded" />
          {errors.category && <div className="text-xs text-red-500">{errors.category.message}</div>}
        </div>

        <div className="flex justify-end">
          <button disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded">
            {isSubmitting ? 'Creating...' : 'Create Store'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerAddStore;

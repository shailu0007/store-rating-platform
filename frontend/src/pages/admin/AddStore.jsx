import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import storeApi from '../../api/storeApi';
import { toast } from 'react-hot-toast';

const AddStore = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await storeApi.create(data);
      toast?.success('Store created');
      navigate('/admin/manage-stores');
    } catch (err) {
      console.error(err);
      toast?.error(err?.response?.data?.message || 'Failed to create store');
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold mb-4">Add Store</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm">Store Name</label>
          <input {...register('name', { required: true })} className="w-full px-3 py-2 border rounded" />
          {errors.name && <div className="text-xs text-red-500">Name required</div>}
        </div>

        <div>
          <label className="block text-sm">Email</label>
          <input type="email" {...register('email')} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm">Address</label>
          <input {...register('address', { required: true })} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm">Category</label>
          <input {...register('category', { required: true })} className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm">Owner (optional user id)</label>
          <input type="number" {...register('owner_id')} className="w-full px-3 py-2 border rounded" />
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

export default AddStore;

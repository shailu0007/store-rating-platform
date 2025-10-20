import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';

const PASSWORD_REGEX = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/;

const schema = Yup.object({
  name: Yup.string().required('Name is required').min(20, 'Name must be at least 20 characters').max(60, 'Name must be at most 60 characters'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  address: Yup.string().max(400, 'Address must be at most 400 characters').nullable(),
  password: Yup.string().required('Password is required').matches(PASSWORD_REGEX, 'Password must be 8-16 chars, include uppercase and special character'),
  role: Yup.string().oneOf(['SYSTEM_ADMIN','STORE_OWNER','NORMAL_USER']).required('Role is required')
}).required();

const roleOptions = [
  { value: 'SYSTEM_ADMIN', label: 'System Administrator' },
  { value: 'STORE_OWNER', label: 'Store Owner' },
  { value: 'NORMAL_USER', label: 'Normal User' }
];

const AddUserForm = ({ initial = {}, onSubmit }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initial.name || '',
      email: initial.email || '',
      address: initial.address || '',
      password: '',
      role: initial.role || 'NORMAL_USER'
    }
  });

  const submit = async (data) => {
    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      address: data.address?.trim() || '',
      password: data.password,
      role: data.role
    };
    if (typeof onSubmit === 'function') await onSubmit(payload);
    else console.log('Add user payload', payload);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full max-w-2xl bg-white p-6 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Add New User</h3>

      <div className="grid grid-cols-1 gap-4">
        <InputField label="Full name" name="name" {...register('name')} error={errors.name?.message} />
        <InputField label="Email" name="email" {...register('email')} error={errors.email?.message} />
        <InputField label="Address" name="address" {...register('address')} error={errors.address?.message} />
        <InputField label="Password" name="password" type="password" {...register('password')} error={errors.password?.message} />
        <SelectField label="Role" name="role" {...register('role')} options={roleOptions} error={errors.role?.message} />
        <div>
          <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add User'}</Button>
        </div>
      </div>
    </form>
  );
};

export default AddUserForm;

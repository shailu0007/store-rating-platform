import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

const PASSWORD_REGEX = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/;

const schema = Yup.object({
  name: Yup.string().required('Name is required').min(20, 'Name must be at least 20 characters').max(60, 'Name must be at most 60 characters'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  address: Yup.string().max(400, 'Address must be at most 400 characters').nullable(),
  password: Yup.string().required('Password is required').matches(PASSWORD_REGEX, 'Password must be 8-16 chars, include an uppercase letter and a special character'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Please confirm password')
}).required();

const SignupForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '', address: '', password: '', confirmPassword: '' }
  });

  const submit = async (data) => {
    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      address: data.address?.trim() || '',
      password: data.password
    };
    if (typeof onSubmit === 'function') await onSubmit(payload);
    else console.log('Signup payload', payload);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full max-w-lg bg-white p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>

      <div className="grid grid-cols-1 gap-4">
        <InputField label="Full name" name="name" {...register('name')} error={errors.name?.message} />
        <InputField label="Email" name="email" {...register('email')} error={errors.email?.message} />
        <InputField label="Address" name="address" {...register('address')} error={errors.address?.message} />
        <InputField label="Password" name="password" type="password" {...register('password')} error={errors.password?.message} />
        <InputField label="Confirm password" name="confirmPassword" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />

        <div>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create account'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;

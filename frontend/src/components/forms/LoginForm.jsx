import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

const schema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
}).required();

const LoginForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  const submit = async (data) => {
    if (typeof onSubmit === 'function') await onSubmit(data);
    else console.log('Login payload', data);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full max-w-md bg-white p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      <div className="space-y-4">
        <InputField
          label="Email"
          name="email"
          placeholder="you@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between">
          <div />
          <a href="/auth/forgot" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
        </div>

        <div>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;

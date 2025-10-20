import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

const PASSWORD_REGEX = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/;

const schema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().required('New password is required').matches(PASSWORD_REGEX, 'New password must be 8-16 chars, include uppercase and special character'),
  confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match').required('Please confirm new password')
}).required();

const PasswordUpdateForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' }
  });

  const submit = async (data) => {
    const payload = { currentPassword: data.currentPassword, newPassword: data.newPassword };
    if (typeof onSubmit === 'function') await onSubmit(payload);
    else console.log('Password update payload', payload);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full max-w-md bg-white p-6 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Change Password</h3>

      <div className="space-y-4">
        <InputField label="Current password" name="currentPassword" type="password" {...register('currentPassword')} error={errors.currentPassword?.message} />
        <InputField label="New password" name="newPassword" type="password" {...register('newPassword')} error={errors.newPassword?.message} />
        <InputField label="Confirm new password" name="confirmNewPassword" type="password" {...register('confirmNewPassword')} error={errors.confirmNewPassword?.message} />

        <div>
          <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update Password'}</Button>
        </div>
      </div>
    </form>
  );
};

export default PasswordUpdateForm;

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import { Star } from 'lucide-react';

const schema = Yup.object({
  rating: Yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: Yup.string().max(1000, 'Comment is too long').nullable()
}).required();

const RatingForm = ({ initialRating = 0, initialComment = '', onSubmit }) => {
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { rating: initialRating || 0, comment: initialComment || '' }
  });

  const submit = async (data) => {
    if (typeof onSubmit === 'function') await onSubmit(data);
    else console.log('Rating payload', data);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="w-full max-w-md bg-white p-4 rounded-md shadow-sm">
      <div className="mb-3">
        <div className="text-sm font-medium text-gray-700 mb-1">Your rating</div>

        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => field.onChange(s)}
                  onMouseEnter={() => {}}
                  className="p-1"
                  aria-label={`${s} star`}
                >
                  <Star size={28} className={`${s <= (field.value || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          )}
        />
        {errors.rating && <div className="text-xs text-red-600 mt-1">{errors.rating.message}</div>}
      </div>

      <div className="mb-3">
        <Controller
          control={control}
          name="comment"
          render={({ field }) => (
            <InputField
              label="Comment (optional)"
              name="comment"
              placeholder="Share how your experience was"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.comment && <div className="text-xs text-red-600 mt-1">{errors.comment.message}</div>}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Submit rating'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => reset({ rating: 0, comment: '' })}>
          Clear
        </Button>
      </div>
    </form>
  );
};

export default RatingForm;

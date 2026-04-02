import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { profileSchema, type ProfileFormData } from '@/lib/schemas/authSchemas';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const { updateMe } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      avatar: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        avatar: user.avatar || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormData) => {
    const payload = {
      ...values,
      password: values.password || undefined,
      avatar: values.avatar || undefined,
    };

    await updateMe.mutateAsync(payload);
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Profile</h2>
        <p className="text-sm text-slate-500">Update your personal account details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4 rounded-lg border bg-white p-5">
        <div>
          <Label htmlFor="profile-name">Name</Label>
          <Input id="profile-name" {...register('name')} />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" type="email" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="profile-password">New Password (optional)</Label>
          <Input id="profile-password" type="password" {...register('password')} />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="profile-avatar">Avatar URL (optional)</Label>
          <Input id="profile-avatar" {...register('avatar')} />
          {errors.avatar && <p className="mt-1 text-xs text-red-600">{errors.avatar.message}</p>}
        </div>

        <Button disabled={updateMe.isPending}>{updateMe.isPending ? 'Saving...' : 'Save Profile'}</Button>
      </form>
    </section>
  );
};

import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registerSchema, type RegisterFormData } from '@/lib/schemas/authSchemas';
import { useAuth } from '@/hooks/useAuth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormData) => {
    await registerUser.mutateAsync(values);
    navigate('/dashboard');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="relative hidden w-1/2 flex-col items-center justify-center gap-8 bg-[#3CB89A] p-12 md:flex">
        <div className="text-5xl font-black tracking-[0.4em] text-white animate-pulse">/////</div>
        <div className="max-w-sm rounded-xl bg-black/10 p-6 text-white">
          <p className="mb-2 font-bold">NOTE:</p>
          <p className="text-sm leading-relaxed">
            Your account keeps saved leads, tasks, and events separated from other users.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-gradient-to-r from-emerald-50/50 to-white px-8 md:w-1/2 md:px-16">
        <div className="mb-10 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-brand text-white">TL</div>
          <h1 className="text-2xl font-semibold">
            <span className="text-slate-800">TRACK</span>
            <span className="text-brand">LEADS</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your full name" {...register('name')} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" {...register('email')} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {registerUser.error && (
            <p className="text-sm text-red-600">
              {(registerUser.error as Error).message || 'Registration failed'}
            </p>
          )}

          <Button className="w-full bg-brand hover:bg-brand-dark" disabled={registerUser.isPending}>
            {registerUser.isPending ? 'Creating...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

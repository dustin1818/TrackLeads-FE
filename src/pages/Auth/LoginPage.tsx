import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthHeroPanel } from "@/components/layout/AuthHeroPanel";
import { loginSchema, type LoginFormData } from "@/lib/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormData) => {
    await login.mutateAsync(values);
    navigate("/dashboard");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AuthHeroPanel />

      <div className="flex w-full flex-col items-center justify-center bg-[linear-gradient(135deg,_rgba(230,247,243,0.72)_0%,_#ffffff_40%,_rgba(230,247,243,0.38)_100%)] px-8 dark:bg-[linear-gradient(135deg,_rgba(30,41,59,1)_0%,_rgba(15,23,42,1)_40%,_rgba(30,41,59,1)_100%)] md:w-1/2 md:px-16">
        <div className="mb-10 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-brand text-white">
            TL
          </div>
          <h1 className="text-2xl font-semibold">
            <span className="text-slate-800 dark:text-slate-100">TRACK</span>
            <span className="text-brand">LEADS</span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {login.error && (
            <p className="text-sm text-red-600">
              {(login.error as Error).message || "Login failed"}
            </p>
          )}

          <Button
            className="w-full bg-brand hover:bg-brand-dark"
            disabled={login.isPending}
          >
            {login.isPending ? "Signing in..." : "Go to Dashboard"}
          </Button>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-brand hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

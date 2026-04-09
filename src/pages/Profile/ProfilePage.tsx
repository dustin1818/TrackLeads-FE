import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileSchema, type ProfileFormData } from "@/lib/schemas/authSchemas";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: "",
        avatar: user.avatar || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: ProfileFormData) => {
    const { confirmPassword, ...rest } = values;

    const payload = {
      ...rest,
      password: rest.password || undefined,
      avatar: rest.avatar || undefined,
    };

    await updateMe.mutateAsync(payload);
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Profile</h2>
        <p className="text-sm text-slate-500">
          Update your personal account details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl space-y-4 rounded-lg border bg-white p-5"
      >
        <div>
          <Label htmlFor="profile-name">Name</Label>
          <Input id="profile-name" {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" type="email" {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="profile-password">New Password (optional)</Label>
          <Input
            id="profile-password"
            type="password"
            placeholder="Leave blank or enter at least 8 characters"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="profile-confirm-password">
            Confirm New Password (optional)
          </Label>
          <Input
            id="profile-confirm-password"
            type="password"
            placeholder="Re-enter the new password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="profile-avatar">Avatar URL (optional)</Label>
          <Input id="profile-avatar" {...register("avatar")} />
          {errors.avatar && (
            <p className="mt-1 text-xs text-red-600">{errors.avatar.message}</p>
          )}
        </div>

        {updateMe.error && (
          <p className="text-sm text-red-600">
            {(updateMe.error as Error).message || "Profile update failed"}
          </p>
        )}

        <Button disabled={updateMe.isPending}>
          {updateMe.isPending ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </section>
  );
};

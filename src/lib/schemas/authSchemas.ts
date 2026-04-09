import { z } from "zod";

const PASSWORD_MIN_LENGTH = 8;
const passwordMinLengthMessage = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
const confirmPasswordRequiredMessage = "Please confirm your password";
const passwordMismatchMessage = "Passwords do not match";

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, passwordMinLengthMessage);
const optionalPasswordSchema = z.union([passwordSchema, z.literal("")]);

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, confirmPasswordRequiredMessage),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: passwordMismatchMessage,
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const profileSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    password: optionalPasswordSchema,
    confirmPassword: z.string(),
    avatar: z.string().url().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.password && !data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: confirmPasswordRequiredMessage,
      });
    }

    if (!data.password && data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Enter a new password before confirming it",
      });
    }

    if (
      data.password &&
      data.confirmPassword &&
      data.password !== data.confirmPassword
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: passwordMismatchMessage,
      });
    }
  });

export type ProfileFormData = z.infer<typeof profileSchema>;

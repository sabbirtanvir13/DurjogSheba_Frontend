import z from "zod";

export const LoginZodSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof LoginZodSchema>;

export const RegisterZodSchema = z
  .object({
    name: z
      .string({ message: "Full name is required" })
      .min(2, "Full name must be at least 2 characters"),
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string({ message: "Please confirm your password" })
      .min(1, "Please confirm your password"),
    role: z.string({ message: "Role is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterZodSchema>;

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

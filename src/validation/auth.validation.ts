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
      .string({ message: "Name is required" })
      .min(1, "Name is required"),
    email: z
      .string({ message: "Email is required" })
      .email("Invalid email format"),
    phoneNumber: z
      .string({ message: "Phone number is required" })
      .min(1, "Phone number is required"),
    password: z
      .string({ message: "Password is required" })
      .min(8, "Password Must Minimum 8 Characters Long.")
      .regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter")
      .regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter")
      .regex(/[0-9]/, "Password must contain at least 1 Number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least 1 Special Character"
      ),
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
  phoneNumber: string;
  password: string;
  role?: string;
};

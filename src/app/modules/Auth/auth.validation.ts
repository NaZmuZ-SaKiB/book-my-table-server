import { z } from "zod";

const signUp = z.object({
  first_name: z
    .string({
      required_error: "First name is required",
      invalid_type_error: "First name must be a string",
    })
    .max(20, { message: "First name must be less than 20 characters" }),

  last_name: z
    .string({
      required_error: "Last name is required",
      invalid_type_error: "Last name must be a string",
    })
    .max(20, { message: "Last name must be less than 20 characters" }),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),

  city: z.string({
    required_error: "City is required",
    invalid_type_error: "City must be a string",
  }),

  phone: z.string({
    required_error: "Phone is required",
    invalid_type_error: "Phone must be a string",
  }),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, { message: "Password must be at least 6 characters" }),
});

const signIn = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),

  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

const updateUser = signUp.omit({ password: true }).partial();

const updatePassword = z.object({
  oldPassword: z.string({
    required_error: "Old password is required",
    invalid_type_error: "Old password must be a string",
  }),

  newPassword: z
    .string({
      required_error: "New password is required",
      invalid_type_error: "New password must be a string",
    })
    .min(6, { message: "New password must be at least 6 characters" }),
});

export const AuthValidation = {
  signUp,
  signIn,
  updateUser,
  updatePassword,
};

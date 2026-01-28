import { z } from "zod";

// Register schema
export const registerSchema = z.object({
  name: z
    .string()
    .regex(
      /^(?=.{3,50}$)[A-Za-z0-9]+(?:[ -][A-Za-z0-9]+)*$/,
      "Name must have at least 3 characters and only letters"
    ),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
      "Password must be 8+ chars with uppercase, lowercase, number, and special character."
    ),
  role: z.enum(["user", "admin", "garage", "mechanic"]),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
      "Password must be 8+ chars with uppercase, lowercase, number, and special character."
    ),
});

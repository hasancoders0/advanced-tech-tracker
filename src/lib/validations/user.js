import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "User name must be at least 2 characters."),
  
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),
  
  role: z
    .string()
    .min(1, "User role is required."),
  
  status: z
    .string()
    .min(1, "User status is required."),
});

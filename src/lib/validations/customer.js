import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters."),
  
  company: z
    .string()
    .trim()
    .min(2, "Company name is required."),
  
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number."),
  
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),
  
  type: z
    .string()
    .min(1, "Customer type is required."),
  
  status: z
    .string()
    .min(1, "Customer status is required."),
  
  address: z
    .string()
    .trim()
    .min(5, "Address is required."),
});

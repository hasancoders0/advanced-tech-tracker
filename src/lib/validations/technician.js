import { z } from "zod";

export const technicianSchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(2, "Employee ID is required."),
  
  name: z
    .string()
    .trim()
    .min(2, "Technician name must be at least 2 characters."),
  
  department: z
    .string()
    .min(1, "Department is required."),
  
  role: z
    .string()
    .min(1, "Technician role is required."),
  
  status: z
    .string()
    .min(1, "Technician status is required."),
});

import { z } from "zod";

export const saleSchema = z.object({
  customerId: z
    .string()
    .min(1, "Please select a customer."),
  
  salesperson: z
    .string()
    .min(1, "Please select a salesperson."),
  
  productId: z
    .string()
    .min(1, "Please select a product or service."),
  
  amount: z
    .coerce
    .number()
    .positive("Amount must be greater than 0."),
  
  status: z
    .string()
    .min(1, "Sale status is required."),
  
  date: z
    .string()
    .min(1, "Sale date is required."),
});

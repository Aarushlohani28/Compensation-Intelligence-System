import { z } from "zod";

export const standardLevels = ["L3", "L4", "L5", "L6", "L7", "L8"];

export const SalaryIngestSchema = z.object({
  company: z.string().min(1, "Company is required").max(100, "Company name too long"),
  role: z.string().min(1, "Role is required"),
  level_standardized: z.string().refine((val) => standardLevels.includes(val), {
    message: `Invalid level. Must be one of: ${standardLevels.join(", ")}`,
  }),
  location: z.string().min(1, "Location is required"),
  experience_years: z.number().min(0, "Experience cannot be negative").max(60, "Invalid experience years"),
  base_salary: z.number().min(0, "Base salary cannot be negative"),
  bonus: z.number().min(0).default(0),
  stock: z.number().min(0).default(0),
});

export type SalaryIngestInput = z.infer<typeof SalaryIngestSchema>;

export const SalaryQuerySchema = z.object({
  page: z.string().optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val >= 1, "Page must be a valid integer >= 1"),
  limit: z.string().optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 100, "Limit must be a valid integer between 1 and 100"),
  company: z.string().optional().transform(v => v === "" ? undefined : v),
  role: z.string().optional().transform(v => v === "" ? undefined : v),
  level: z.string().optional().transform(v => v === "" ? undefined : v),
  location: z.string().optional().transform(v => v === "" ? undefined : v),
});

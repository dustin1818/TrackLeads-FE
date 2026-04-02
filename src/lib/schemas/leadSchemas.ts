import { z } from 'zod';

export const generateLeadsSchema = z.object({
  websiteUrl: z.string().url('Please enter a valid URL'),
});

export type GenerateLeadsFormData = z.infer<typeof generateLeadsSchema>;

export const saveLeadSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  domain: z.string().optional(),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email('Valid email is required'),
  source: z
    .enum(['Generated', 'Manual', 'Referral', 'Social Media', 'Other'])
    .optional(),
});

export type SaveLeadFormData = z.infer<typeof saveLeadSchema>;

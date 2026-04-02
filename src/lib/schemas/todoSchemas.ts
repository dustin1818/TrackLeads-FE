import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  dueDate: z.string().optional(),
  calendarEvent: z.string().optional(),
});

export type TodoFormData = z.infer<typeof todoSchema>;

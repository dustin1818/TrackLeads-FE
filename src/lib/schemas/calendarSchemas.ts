import { z } from 'zod';

export const calendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  color: z.string().default('#3CB89A'),
  linkedTodo: z.string().optional(),
});

export type CalendarEventFormData = z.infer<typeof calendarEventSchema>;

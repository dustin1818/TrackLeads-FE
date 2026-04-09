import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "@/lib/toast";
import type { CalendarEvent } from "@/lib/types";

export const useCalendarEvents = () => {
  return useQuery({
    queryKey: ["calendarEvents"],
    queryFn: async () => {
      const { data } = await api.get<CalendarEvent[]>("/calendar");
      return data;
    },
  });
};

export const useCalendarActions = () => {
  const queryClient = useQueryClient();

  const createEvent = useMutation({
    mutationFn: async (payload: Partial<CalendarEvent>) => {
      const { data } = await api.post<CalendarEvent>("/calendar", payload);
      return data;
    },
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
      toast.success(
        "Calendar event added",
        `${event.title} was added to your calendar.`,
      );
    },
    onError: (error) => {
      toast.error(
        "Failed to add calendar event",
        error,
        "The event could not be created.",
      );
    },
  });

  const updateEvent = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CalendarEvent>;
    }) => {
      const { data } = await api.put<CalendarEvent>(`/calendar/${id}`, payload);
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] }),
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/calendar/${id}`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] }),
  });

  return { createEvent, updateEvent, deleteEvent };
};

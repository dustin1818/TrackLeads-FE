import { EventForm } from "@/components/calendar/EventForm";
import { CalendarView } from "@/components/calendar/CalendarView";
import { useCalendarActions, useCalendarEvents } from "@/hooks/useCalendar";
import type { CalendarEventFormData } from "@/lib/schemas/calendarSchemas";

export const CalendarPage = () => {
  const { data: events = [], isLoading } = useCalendarEvents();
  const { createEvent, deleteEvent } = useCalendarActions();

  const handleCreate = async (values: CalendarEventFormData) => {
    await createEvent.mutateAsync(values);
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Calendar
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Plan calls, follow-ups, and outreach windows.
        </p>
      </div>

      <EventForm loading={createEvent.isPending} onSubmit={handleCreate} />

      {isLoading ? (
        <div className="rounded-lg border bg-white p-8 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          Loading events...
        </div>
      ) : (
        <CalendarView
          events={events}
          onDelete={(id) => {
            deleteEvent.mutate(id);
          }}
        />
      )}
    </section>
  );
};

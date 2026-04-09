import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { CalendarEvent } from "@/lib/types";
import { EventCard } from "@/components/calendar/EventCard";

const toDateKey = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

interface Props {
  events: CalendarEvent[];
  onDelete: (id: string) => void;
}

export const CalendarView = ({ events, onDelete }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const eventsByDay = useMemo(() => {
    return events.reduce(
      (acc, event) => {
        const day = toDateKey(new Date(event.startDate));
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(event);
        return acc;
      },
      {} as Record<string, CalendarEvent[]>,
    );
  }, [events]);

  const selectedDayKey = toDateKey(selectedDate);
  const selectedDayEvents = eventsByDay[selectedDayKey] || [];
  const daysWithEvents = useMemo(
    () => Object.keys(eventsByDay).map((day) => new Date(`${day}T00:00:00`)),
    [eventsByDay],
  );

  if (!events.length) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        No events scheduled yet.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <div className="rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              setSelectedDate(date);
            }
          }}
          modifiers={{ hasEvents: daysWithEvents }}
          modifiersClassNames={{
            hasEvents: "bg-brand/10 text-brand font-semibold rounded-md",
          }}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Plans for {selectedDate.toLocaleDateString()}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {selectedDayEvents.length} event
            {selectedDayEvents.length === 1 ? "" : "s"} scheduled
          </p>
        </div>

        {selectedDayEvents.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2">
            {selectedDayEvents.map((event) => (
              <EventCard key={event._id} event={event} onDelete={onDelete} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            No plans for this day.
          </div>
        )}
      </div>
    </div>
  );
};

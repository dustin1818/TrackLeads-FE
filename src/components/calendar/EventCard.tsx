import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalendarEvent } from "@/lib/types";

interface Props {
  event: CalendarEvent;
  onDelete: (id: string) => void;
}

export const EventCard = ({ event, onDelete }: Props) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <p>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            Start:
          </span>{" "}
          {new Date(event.startDate).toLocaleString()}
        </p>
        {event.endDate && (
          <p>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              End:
            </span>{" "}
            {new Date(event.endDate).toLocaleString()}
          </p>
        )}
        {event.description && <p>{event.description}</p>}
        <div className="flex items-center justify-between pt-1">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: event.color }}
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(event._id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calendarEventSchema,
  type CalendarEventFormData,
} from "@/lib/schemas/calendarSchemas";

interface Props {
  loading: boolean;
  onSubmit: (values: CalendarEventFormData) => Promise<void> | void;
}

export const EventForm = ({ loading, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CalendarEventFormData>({
    resolver: zodResolver(calendarEventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      color: "#3CB89A",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
        reset({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          color: "#3CB89A",
        });
      })}
      className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2"
    >
      <div>
        <Label htmlFor="event-title">Title</Label>
        <Input
          id="event-title"
          placeholder="Call with Acme"
          {...register("title")}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="event-color">Color</Label>
        <Input
          id="event-color"
          type="color"
          className="h-10 p-1"
          {...register("color")}
        />
      </div>

      <div>
        <Label htmlFor="event-startDate">Start</Label>
        <Input
          id="event-startDate"
          type="datetime-local"
          {...register("startDate")}
        />
        {errors.startDate && (
          <p className="mt-1 text-xs text-red-600">
            {errors.startDate.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="event-endDate">End</Label>
        <Input
          id="event-endDate"
          type="datetime-local"
          {...register("endDate")}
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="event-description">Description</Label>
        <Input
          id="event-description"
          placeholder="Optional event notes"
          {...register("description")}
        />
      </div>

      <div className="md:col-span-2">
        <Button disabled={loading}>
          {loading ? "Adding..." : "Add Event"}
        </Button>
      </div>
    </form>
  );
};

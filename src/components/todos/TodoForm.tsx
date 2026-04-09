import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { todoSchema, type TodoFormData } from "@/lib/schemas/todoSchemas";

interface Props {
  loading: boolean;
  onSubmit: (values: TodoFormData) => Promise<void> | void;
}

export const TodoForm = ({ loading, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      dueDate: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
        reset({ title: "", description: "", priority: "Medium", dueDate: "" });
      })}
      className="grid gap-3 rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-800 md:grid-cols-4"
    >
      <div className="md:col-span-2">
        <Label htmlFor="todo-title">Title</Label>
        <Input
          id="todo-title"
          {...register("title")}
          placeholder="Follow up with Acme Corp"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="todo-priority">Priority</Label>
        <select
          id="todo-priority"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          {...register("priority")}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <Label htmlFor="todo-dueDate">Due date</Label>
        <Input id="todo-dueDate" type="date" {...register("dueDate")} />
      </div>

      <div className="md:col-span-4">
        <Label htmlFor="todo-description">Description</Label>
        <Input
          id="todo-description"
          {...register("description")}
          placeholder="Optional notes"
        />
      </div>

      <div className="md:col-span-4">
        <Button disabled={loading}>{loading ? "Adding..." : "Add Todo"}</Button>
      </div>
    </form>
  );
};

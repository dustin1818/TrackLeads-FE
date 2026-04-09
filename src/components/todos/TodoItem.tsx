import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Todo } from "@/lib/types";

interface Props {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const priorityStyles = {
  Low: "bg-slate-100 text-slate-700 border-slate-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-rose-100 text-rose-700 border-rose-200",
};

export const TodoItem = ({ todo, onToggle, onDelete }: Props) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p
            className={
              todo.isCompleted
                ? "text-slate-400 line-through"
                : "text-slate-800 dark:text-slate-100"
            }
          >
            {todo.title}
          </p>
          <Badge className={priorityStyles[todo.priority]}>
            {todo.priority}
          </Badge>
        </div>
        {todo.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {todo.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onToggle(todo)}>
          {todo.isCompleted ? "Mark Active" : "Mark Done"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(todo._id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

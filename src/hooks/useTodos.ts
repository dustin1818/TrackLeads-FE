import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "@/lib/toast";
import { useNotificationStore } from "@/store/notificationStore";
import type { Todo } from "@/lib/types";

interface TodoFilters {
  status?: "all" | "active" | "completed";
  priority?: "All" | "Low" | "Medium" | "High";
}

export const useTodos = (filters: TodoFilters = {}) => {
  return useQuery({
    queryKey: ["todos", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.status && filters.status !== "all") {
        params.status = filters.status;
      }
      if (filters.priority && filters.priority !== "All") {
        params.priority = filters.priority;
      }

      const { data } = await api.get<Todo[]>("/todos", { params });
      return data;
    },
  });
};

export const useTodoActions = () => {
  const queryClient = useQueryClient();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const createTodo = useMutation({
    mutationFn: async (payload: Partial<Todo>) => {
      const { data } = await api.post<Todo>("/todos", payload);
      return data;
    },
    onSuccess: (todo) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo added", `${todo.title} was added to your list.`);
      addNotification({
        type: "todo-created",
        title: "Todo added",
        description: `${todo.title} was added to your list.`,
      });
    },
    onError: (error) => {
      toast.error(
        "Failed to add todo",
        error,
        "The todo could not be created.",
      );
    },
  });

  const updateTodo = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Todo>;
    }) => {
      const { data } = await api.put<Todo>(`/todos/${id}`, payload);
      return data;
    },
    onSuccess: (todo) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      if (todo.isCompleted) {
        addNotification({
          type: "todo-completed",
          title: "Todo completed",
          description: `${todo.title} was marked as complete.`,
        });
      }
    },
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/todos/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Todo deleted", "The todo was removed successfully.");
      addNotification({
        type: "todo-deleted",
        title: "Todo deleted",
        description: "A todo was removed successfully.",
      });
    },
    onError: (error) => {
      toast.error(
        "Failed to delete todo",
        error,
        "The todo could not be deleted.",
      );
    },
  });

  return { createTodo, updateTodo, deleteTodo };
};

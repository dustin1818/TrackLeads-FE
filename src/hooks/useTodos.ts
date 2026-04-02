import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Todo } from '@/lib/types';

interface TodoFilters {
  status?: 'all' | 'active' | 'completed';
  priority?: 'All' | 'Low' | 'Medium' | 'High';
}

export const useTodos = (filters: TodoFilters = {}) => {
  return useQuery({
    queryKey: ['todos', filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      if (filters.priority && filters.priority !== 'All') {
        params.priority = filters.priority;
      }

      const { data } = await api.get<Todo[]>('/todos', { params });
      return data;
    },
  });
};

export const useTodoActions = () => {
  const queryClient = useQueryClient();

  const createTodo = useMutation({
    mutationFn: async (payload: Partial<Todo>) => {
      const { data } = await api.post<Todo>('/todos', payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const updateTodo = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Todo> }) => {
      const { data } = await api.put<Todo>(`/todos/${id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/todos/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  return { createTodo, updateTodo, deleteTodo };
};

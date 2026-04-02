import { useState } from 'react';
import { TodoForm } from '@/components/todos/TodoForm';
import { TodoList } from '@/components/todos/TodoList';
import { useTodoActions, useTodos } from '@/hooks/useTodos';
import type { Todo } from '@/lib/types';
import type { TodoFormData } from '@/lib/schemas/todoSchemas';

export const TodosPage = () => {
  const [status, setStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [priority, setPriority] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');

  const { data: todos = [], isLoading } = useTodos({ status, priority });
  const { createTodo, updateTodo, deleteTodo } = useTodoActions();

  const handleCreate = (values: TodoFormData) => {
    createTodo.mutate(values);
  };

  const handleToggle = (todo: Todo) => {
    updateTodo.mutate({ id: todo._id, payload: { isCompleted: !todo.isCompleted } });
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Todos</h2>
        <p className="text-sm text-slate-500">Track outreach tasks by status and priority.</p>
      </div>

      <TodoForm loading={createTodo.isPending} onSubmit={handleCreate} />

      <div className="flex flex-wrap gap-3 rounded-lg border bg-white p-4">
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'all' | 'active' | 'completed')}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'All' | 'Low' | 'Medium' | 'High')}
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {isLoading ? (
        <div className="rounded-lg border bg-white p-8 text-sm text-slate-500">Loading todos...</div>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={(id) => {
            deleteTodo.mutate(id);
          }}
        />
      )}
    </section>
  );
};

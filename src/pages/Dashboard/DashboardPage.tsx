import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSavedLeads } from "@/hooks/useSavedLeads";
import { useTodos } from "@/hooks/useTodos";
import { useCalendarEvents } from "@/hooks/useCalendar";

export const DashboardPage = () => {
  const { data: leads = [] } = useSavedLeads();
  const { data: todos = [] } = useTodos();
  const { data: events = [] } = useCalendarEvents();

  const completedTodos = todos.filter((t) => t.isCompleted).length;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Dashboard
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Quick overview of your pipeline activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saved Leads</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {leads.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Todos</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {todos.length}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Completed Todos</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {completedTodos}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Calendar Events</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {events.length}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

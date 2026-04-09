import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { DarkModeToggle } from "@/components/layout/DarkModeToggle";
import { useCalendarEvents } from "@/hooks/useCalendar";
import { useRemovedLeads } from "@/hooks/useRemovedLeads";
import { useSavedLeads } from "@/hooks/useSavedLeads";
import { useTodos } from "@/hooks/useTodos";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/leads/generate", label: "Generate Leads" },
  { to: "/leads/saved", label: "Saved Leads", countKey: "savedLeads" },
  { to: "/leads/removed", label: "Removed Leads", countKey: "removedLeads" },
  { to: "/todos", label: "Todos", countKey: "todos" },
  { to: "/calendar", label: "Calendar", countKey: "calendarEvents" },
  { to: "/profile", label: "Profile" },
];

export const AppLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { data: savedLeads = [] } = useSavedLeads();
  const { data: removedLeads = [] } = useRemovedLeads();
  const { data: todos = [] } = useTodos();
  const { data: calendarEvents = [] } = useCalendarEvents();

  const counts = {
    savedLeads: savedLeads.length,
    removedLeads: removedLeads.length,
    todos: todos.length,
    calendarEvents: calendarEvents.length,
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-10xl items-center justify-between px-4 py-4">
          <Link to="/dashboard" className="text-xl font-semibold tracking-wide">
            <span className="text-slate-900 dark:text-slate-100">TRACK</span>
            <span className="text-brand">LEADS</span>
          </Link>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <NotificationBell />
            <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-10xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-lg border bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand text-white"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {item.countKey ? (
                      <Badge
                        variant="secondary"
                        className={[
                          "min-w-7 justify-center rounded-full border-0 px-2 py-0 text-[11px] font-semibold",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 text-slate-700",
                        ].join(" ")}
                      >
                        {counts[item.countKey]}
                      </Badge>
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

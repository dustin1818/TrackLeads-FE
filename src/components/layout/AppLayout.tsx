import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/leads/generate", label: "Generate Leads" },
  { to: "/leads/saved", label: "Saved Leads" },
  { to: "/leads/removed", label: "Removed Leads" },
  { to: "/todos", label: "Todos" },
  { to: "/calendar", label: "Calendar" },
  { to: "/profile", label: "Profile" },
];

export const AppLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-10xl items-center justify-between px-4 py-4">
          <Link to="/dashboard" className="text-xl font-semibold tracking-wide">
            <span className="text-slate-900">TRACK</span>
            <span className="text-brand">LEADS</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-10xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-lg border bg-white p-3">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand text-white"
                      : "text-slate-700 hover:bg-slate-100",
                  ].join(" ")
                }
              >
                {item.label}
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

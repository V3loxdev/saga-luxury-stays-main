import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Receipt, DoorOpen, ChevronLeft, Menu, Shield, Coffee } from "lucide-react";
import { useAuth } from "@/lib/useAuth";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Bookings", to: "/admin/bookings", icon: ClipboardList },
  { label: "Receipts", to: "/admin/receipts", icon: Receipt },
  { label: "Rooms", to: "/admin/rooms", icon: DoorOpen },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showPassword, setShowPassword] = useState(!isAuthenticated);
  const { pathname } = useLocation();

  if (showPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark p-8">
        <div className="bg-card/90 backdrop-blur-md rounded-2xl p-8 w-full max-w-sm border border-dark-border shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-10 w-10 text-gold" />
            </div>
            <h1 className="font-display text-2xl gold-text mb-2">Admin Login</h1>
            <p className="text-muted-foreground">Enter password to access panel</p>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const password = (e.target as any).password.value;
            login(password);
            setTimeout(() => setShowPassword(false), 100);
          }}>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all duration-300 text-lg"
              required
            />
            <button
              type="submit"
              className="btn-gold w-full mt-4 magnetic-hover"
            >
              Enter Admin
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Password: 000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(40, 10%, 6%)" }}>
      {/* Sidebar */}
      <aside
        className={`sticky top-0 h-screen transition-all duration-300 flex flex-col border-r border-dark-border ${
          collapsed ? "w-16" : "w-60"
        }`}
        style={{ background: "hsl(var(--dark))" }}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-dark-border">
          {!collapsed && (
            <Link to="/" className="font-display text-lg text-gold tracking-wide">
              SAGA
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gold/60 hover:text-gold transition-colors"
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
  {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gold/10 text-gold"
                    : "text-muted-foreground hover:text-gold/80 hover:bg-gold/5"
                }`}
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
          <Link
            to="/admin/snacks-drinks"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              pathname === "/admin/snacks-drinks"
                ? "bg-gold/10 text-gold"
                : "text-muted-foreground hover:text-gold/80 hover:bg-gold/5"
            }`}
          >
            <Coffee size={18} className="shrink-0" />
            {!collapsed && <span>Menu</span>}
          </Link>
        </nav>

        <div className="p-4 border-t border-dark-border">
          <Link
            to="/"
            className={`flex items-center gap-2 text-xs text-muted-foreground hover:text-gold transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            {!collapsed && "← Back to Site"}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}


import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth";

type Item = { to: string; label: string; adminOnly?: boolean };
type Group = { title: string; items: Item[] };

const GROUPS: Group[] = [
  {
    title: "Overview",
    items: [
      { to: "/", label: "Dashboard" },
      { to: "/leads", label: "Leads" },
    ],
  },
  {
    title: "Content",
    items: [
      { to: "/locations", label: "Locations" },
      { to: "/service-categories", label: "Service Categories" },
      { to: "/services", label: "Services" },
      { to: "/blog", label: "Blog" },
      { to: "/ai-blog", label: "AI Blog" },
      { to: "/testimonials", label: "Testimonials" },
      { to: "/gallery", label: "Gallery" },
      { to: "/careers", label: "Careers" },
      { to: "/pages", label: "Pages" },
    ],
  },
  {
    title: "System",
    items: [
      { to: "/media", label: "Media" },
      { to: "/redirects", label: "Redirects" },
      { to: "/settings", label: "Settings" },
      { to: "/users", label: "Users", adminOnly: true },
    ],
  },
];

export function AppShell() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <aside className={`sidebar${open ? " open" : ""}`}>
        <div className="brand">ISA Spa CMS</div>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="nav-group">{g.title}</div>
            <nav>
              {g.items
                .filter((it) => !it.adminOnly || isAdmin)
                .map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    end={it.to === "/"}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={() => setOpen(false)}
                  >
                    {it.label}
                  </NavLink>
                ))}
            </nav>
          </div>
        ))}
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="menu-btn btn-sm" onClick={() => setOpen((o) => !o)}>
            ☰
          </button>
          <div style={{ flex: 1 }} />
          <div className="user">
            <span>
              {user?.name || user?.email}{" "}
              <span className="badge badge-gold">{user?.role}</span>
            </span>
            <button className="btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

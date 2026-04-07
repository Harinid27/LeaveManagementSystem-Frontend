import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/users", label: "Users" },
  { to: "/leaves", label: "My Leaves" },
  { to: "/apply-leave", label: "Apply Leave" },
  { to: "/pending-approvals", label: "Pending Approvals" }
];

function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Leave Management</p>
          <h1>Campus Workflow</h1>
          <p className="sidebar__user">
            {user?.name}
            <span>
              {user?.role} • {user?.department}
            </span>
          </p>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="btn btn-secondary" type="button" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;

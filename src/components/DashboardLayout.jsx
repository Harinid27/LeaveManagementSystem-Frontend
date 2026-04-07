import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function DashboardLayout({ title, description, highlights = [], actions = [] }) {
  const { user, logout } = useAuth();

  return (
    <section className="page dashboard-page">
      <div className="dashboard-hero auth-card">
        <p className="eyebrow">{user?.role} dashboard</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="panel">
          <p>
            Logged in as <strong>{user?.name}</strong>
          </p>
          <p>{user?.email}</p>
          <div className="button-row dashboard-actions">
            {actions.map((action) => (
              <Link key={action.to} className="btn btn-secondary btn-inline" to={action.to}>
                {action.label}
              </Link>
            ))}
            <Link className="btn btn-secondary btn-inline" to="/notifications">
              Notifications
            </Link>
          </div>
        </div>
        <button className="btn btn-primary" type="button" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        {highlights.map((item) => (
          <article className="panel dashboard-card" key={item.title}>
            <p className="eyebrow">{item.eyebrow}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.link ? (
              <Link className="dashboard-link" to={item.link.to}>
                {item.link.label}
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export default DashboardLayout;

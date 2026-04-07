import { useEffect, useMemo, useState } from "react";
import UserForm from "../components/UserForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { userService } from "../services/userService.js";

const creationMap = {
  principal: ["hod"],
  hod: ["professor"],
  professor: ["student"],
  student: []
};

function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const allowedRoles = useMemo(() => creationMap[user?.role] || [], [user?.role]);

  const loadUsers = async () => {
    const data = await userService.getUsers();
    setUsers(data.users);
  };

  useEffect(() => {
    loadUsers().catch(() => {});
  }, []);

  const handleCreate = async (payload) => {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const data = await userService.createUser(payload);
      setMessage(data.message);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create user");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page page-grid">
      <div>
        <div className="page-heading">
          <p className="eyebrow">User Hierarchy</p>
          <h2>Create and manage users below your role.</h2>
        </div>
        {allowedRoles.length ? (
          <UserForm
            allowedRoles={allowedRoles}
            currentDepartment={user?.role === "principal" ? "" : user?.department}
            onSubmit={handleCreate}
            busy={busy}
          />
        ) : (
          <div className="panel">
            <p>Students cannot create subordinate accounts.</p>
          </div>
        )}
        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </div>

      <div className="panel">
        <h3>Visible Users</h3>
        <div className="list">
          {users.map((entry) => (
            <article className="list-item" key={entry._id}>
              <div>
                <strong>{entry.name}</strong>
                <p>
                  {entry.email} • {entry.role}
                </p>
              </div>
              <span>{entry.department}</span>
            </article>
          ))}
          {!users.length ? <p>No users available yet.</p> : null}
        </div>
      </div>
    </section>
  );
}

export default UsersPage;

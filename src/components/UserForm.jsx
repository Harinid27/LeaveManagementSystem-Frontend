import { useState } from "react";

const DEFAULT_FORM = {
  name: "",
  email: "",
  password: "",
  role: "",
  department: ""
};

const roleLabels = {
  hod: "HOD",
  professor: "Professor",
  student: "Student"
};

function UserForm({ allowedRoles, currentDepartment, onSubmit, busy, actorRole }) {
  const [form, setForm] = useState({
    ...DEFAULT_FORM,
    role: allowedRoles[0] || "",
    department: currentDepartment || ""
  });

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm({
      ...DEFAULT_FORM,
      role: allowedRoles[0] || "",
      department: currentDepartment || ""
    });
  };

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <div className="form-grid__full">
        <p className="helper-text">
          {actorRole} can create only the next level in the hierarchy.
        </p>
      </div>
      <div>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange} required>
          {allowedRoles.map((role) => (
            <option key={role} value={role}>
              {roleLabels[role] || role}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Department</label>
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          required
          disabled={Boolean(currentDepartment)}
        />
      </div>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? "Saving..." : "Create User"}
      </button>
    </form>
  );
}

export default UserForm;

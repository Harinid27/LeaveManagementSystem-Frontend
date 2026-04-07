import { useState } from "react";

const initialState = {
  leaveType: "casualLeave",
  fromDate: "",
  toDate: "",
  reason: "",
  proofFile: null
};

function LeaveForm({ onSubmit, busy }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const value =
      event.target.type === "file" ? event.target.files?.[0] || null : event.target.value;

    setForm((current) => ({
      ...current,
      [event.target.name]: value
    }));
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const trimmedReason = form.reason.trim();

    if (!form.fromDate || !form.toDate) {
      setError("Please select both from and to dates.");
      return;
    }

    if (new Date(form.fromDate) > new Date(form.toDate)) {
      setError("From date cannot be later than to date.");
      return;
    }

    if (trimmedReason.length < 10) {
      setError("Reason must be at least 10 characters long.");
      return;
    }

    if (form.proofFile) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(form.proofFile.type)) {
        setError("Proof file must be a PDF, JPG, or PNG.");
        return;
      }

      if (form.proofFile.size > 5 * 1024 * 1024) {
        setError("Proof file size must be 5MB or less.");
        return;
      }
    }

    await onSubmit(form);
    setForm(initialState);
    setError("");
  };

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <div>
        <label>Leave type</label>
        <select name="leaveType" value={form.leaveType} onChange={handleChange}>
          <option value="casualLeave">Casual Leave</option>
          <option value="sickLeave">Sick Leave</option>
          <option value="academic">Academic Leave</option>
        </select>
      </div>
      <div>
        <label>From date</label>
        <input name="fromDate" type="date" value={form.fromDate} onChange={handleChange} required />
      </div>
      <div>
        <label>To date</label>
        <input name="toDate" type="date" value={form.toDate} onChange={handleChange} required />
      </div>
      <div className="form-grid__full">
        <label>Reason</label>
        <textarea name="reason" rows="4" value={form.reason} onChange={handleChange} required />
        <p className="helper-text">Give a clear reason so the approver can review it quickly.</p>
      </div>
      <div className="form-grid__full">
        <label>Medical Certificate / Leave Proof</label>
        <input
          name="proofFile"
          type="file"
          accept=".pdf,image/png,image/jpeg"
          onChange={handleChange}
        />
        <p className="helper-text">Optional. Upload a PDF, JPG, or PNG up to 5MB.</p>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? "Submitting..." : "Apply Leave"}
      </button>
    </form>
  );
}

export default LeaveForm;

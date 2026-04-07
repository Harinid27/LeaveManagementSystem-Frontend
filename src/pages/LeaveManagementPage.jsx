import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import LeaveForm from "../components/LeaveForm.jsx";
import LeaveCard from "../components/LeaveCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { leaveService } from "../services/leaveService.js";

function LeaveManagementPage() {
  const [leaves, setLeaves] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLeaves = async () => {
    setLoading(true);
    const data = await leaveService.myLeaves();
    setLeaves(data.leaves);
    setLoading(false);
  };

  useEffect(() => {
    loadLeaves().catch((requestError) => {
      setError(requestError.displayMessage || "Unable to load leave history");
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (payload) => {
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const data = await leaveService.apply(payload);
      setMessage(data.message);
      await loadLeaves();
    } catch (requestError) {
      setError(requestError.displayMessage || "Unable to submit leave");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout>
      <section className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="stack">
        <div className="page-heading">
          <p className="eyebrow">Leave Application</p>
          <h2>Apply for leave and track status in one place.</h2>
          <p className="helper-text">
            Submit a leave request with leave type, date range, and reason.
          </p>
        </div>
        <LeaveForm onSubmit={handleSubmit} busy={busy} />
        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
      </div>

      <div className="stack">
        <div className="page-heading">
          <p className="eyebrow">Applied Leaves</p>
          <h2>Review your leave history and current status.</h2>
        </div>
        {loading ? <LoadingState label="Loading leave history..." /> : <div className="stack">
          {leaves.map((leave) => (
            <LeaveCard key={leave._id} leave={leave} />
          ))}
          {!leaves.length ? <div className="panel">No leave requests submitted yet.</div> : null}
        </div>}
      </div>
      </section>
    </AppLayout>
  );
}

export default LeaveManagementPage;

import { useState } from "react";
import LeaveForm from "../components/LeaveForm.jsx";
import { leaveService } from "../services/leaveService.js";

function ApplyLeavePage() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (payload) => {
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const data = await leaveService.apply(payload);
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to submit leave");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Apply Leave</p>
        <h2>Submit a request and push it into the live hierarchy.</h2>
      </div>
      <LeaveForm onSubmit={handleSubmit} busy={busy} />
      {message ? <p className="success-text">{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}

export default ApplyLeavePage;

import { useEffect, useState } from "react";
import LeaveCard from "../components/LeaveCard.jsx";
import { leaveService } from "../services/leaveService.js";

function LeavesPage() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    leaveService
      .myLeaves()
      .then((data) => setLeaves(data.leaves))
      .catch(() => {});
  }, []);

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">My Leaves</p>
        <h2>Track every approval step in the chain.</h2>
      </div>

      <div className="stack">
        {leaves.map((leave) => (
          <LeaveCard key={leave._id} leave={leave} />
        ))}
        {!leaves.length ? <div className="panel">No leave requests submitted yet.</div> : null}
      </div>
    </section>
  );
}

export default LeavesPage;

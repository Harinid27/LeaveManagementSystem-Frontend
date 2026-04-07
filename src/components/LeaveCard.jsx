import LeaveTimeline from "./LeaveTimeline.jsx";
import { toAbsoluteFileUrl } from "../utils/fileUrl.js";

function LeaveCard({ leave, actionSlot }) {
  return (
    <article className="panel leave-card">
      <div className="leave-card__header">
        <div>
          <h3>{leave.leaveType}</h3>
          <p>
            {new Date(leave.fromDate).toLocaleDateString()} to{" "}
            {new Date(leave.toDate).toLocaleDateString()}
          </p>
        </div>
        <span className={`status-badge status-badge--${leave.status}`}>{leave.status}</span>
      </div>
      <p className="leave-card__meta">
        {leave.userId?.name} ({leave.userId?.role}) • {leave.userId?.department}
      </p>
      <p>{leave.reason}</p>
      {leave.proofFile?.fileUrl ? (
        <a
          className="dashboard-link"
          href={toAbsoluteFileUrl(leave.proofFile.fileUrl)}
          target="_blank"
          rel="noreferrer"
        >
          View Uploaded Proof
        </a>
      ) : null}
      <LeaveTimeline flow={leave.approvalFlow} />
      {actionSlot}
    </article>
  );
}

export default LeaveCard;

const statusLabelMap = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected"
};

function LeaveTimeline({ flow = [] }) {
  return (
    <div className="timeline">
      {flow.map((step) => (
        <div
          className={`timeline__item timeline__item--${step.status}`}
          key={step.approverId?._id || step.approverId}
        >
          <div className="timeline__header">
            <strong>{step.approverId?.name || "Approver"}</strong>
            <small className={`status-badge status-badge--${step.status}`}>
              {statusLabelMap[step.status] || step.status}
            </small>
          </div>
          <span>{step.approverId?.role || "role"}</span>
          {step.remarks ? <p>{step.remarks}</p> : null}
        </div>
      ))}
    </div>
  );
}

export default LeaveTimeline;

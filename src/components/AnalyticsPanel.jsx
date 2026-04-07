function AnalyticsPanel({ analytics, title }) {
  const totals = analytics?.totals || {
    totalLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    pendingLeaves: 0
  };
  const departments = analytics?.departmentBreakdown || [];
  const maxDepartment = Math.max(...departments.map((item) => item.total), 1);

  return (
    <section className="stack">
      <div className="page-heading">
        <p className="eyebrow">Analytics</p>
        <h2>{title}</h2>
      </div>

      <div className="analytics-stats">
        <article className="panel analytics-stat">
          <span>Total Leaves</span>
          <strong>{totals.totalLeaves}</strong>
        </article>
        <article className="panel analytics-stat">
          <span>Approved</span>
          <strong>{totals.approvedLeaves}</strong>
        </article>
        <article className="panel analytics-stat">
          <span>Rejected</span>
          <strong>{totals.rejectedLeaves}</strong>
        </article>
      </div>

      <div className="panel analytics-chart">
        <div className="analytics-chart__header">
          <h3>Status Breakdown</h3>
          <p className="helper-text">Quick view of approved, rejected, and pending leave totals.</p>
        </div>
        <div className="status-bars">
          {[
            { label: "Approved", value: totals.approvedLeaves, className: "approved" },
            { label: "Rejected", value: totals.rejectedLeaves, className: "rejected" },
            { label: "Pending", value: totals.pendingLeaves, className: "pending" }
          ].map((item) => {
            const width = totals.totalLeaves ? (item.value / totals.totalLeaves) * 100 : 0;
            return (
              <div className="status-bars__row" key={item.label}>
                <span>{item.label}</span>
                <div className="status-bars__track">
                  <div className={`status-bars__fill status-bars__fill--${item.className}`} style={{ width: `${width}%` }} />
                </div>
                <strong>{item.value}</strong>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel analytics-chart">
        <div className="analytics-chart__header">
          <h3>Leaves Per Department</h3>
          <p className="helper-text">Department totals based on submitted leave requests.</p>
        </div>
        <div className="department-bars">
          {departments.length ? (
            departments.map((item) => (
              <div className="department-bars__row" key={item.department}>
                <span>{item.department}</span>
                <div className="department-bars__track">
                  <div
                    className="department-bars__fill"
                    style={{ width: `${(item.total / maxDepartment) * 100}%` }}
                  />
                </div>
                <strong>{item.total}</strong>
              </div>
            ))
          ) : (
            <p className="helper-text">No leave analytics available yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default AnalyticsPanel;

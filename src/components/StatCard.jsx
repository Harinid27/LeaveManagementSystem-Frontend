function StatCard({ label, value, accent = "var(--accent)" }) {
  return (
    <article className="stat-card">
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value" style={{ color: accent }}>
        {value}
      </strong>
    </article>
  );
}

export default StatCard;

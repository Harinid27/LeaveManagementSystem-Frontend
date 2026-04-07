function LoadingState({ label = "Loading..." }) {
  return (
    <div className="panel loading-state">
      <div className="loading-state__spinner" />
      <p className="helper-text">{label}</p>
    </div>
  );
}

export default LoadingState;

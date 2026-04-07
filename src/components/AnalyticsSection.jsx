import { useEffect, useState } from "react";
import AnalyticsPanel from "./AnalyticsPanel.jsx";
import { leaveService } from "../services/leaveService.js";

function AnalyticsSection({ title }) {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    leaveService
      .analytics()
      .then((data) => setAnalytics(data))
      .catch((requestError) => {
        setError(requestError.response?.data?.message || "Unable to load analytics");
      });
  }, []);

  if (error) {
    return (
      <div className="panel">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="panel">
        <p className="helper-text">Loading analytics...</p>
      </div>
    );
  }

  return <AnalyticsPanel analytics={analytics} title={title} />;
}

export default AnalyticsSection;

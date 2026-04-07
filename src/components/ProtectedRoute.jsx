import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingState from "./LoadingState.jsx";

const roleHomeMap = {
  principal: "/principal-dashboard",
  hod: "/hod-dashboard",
  professor: "/prof-dashboard",
  student: "/student-dashboard"
};

function ProtectedRoute({ allowedRoles }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <LoadingState label="Restoring your session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleHomeMap[user.role] || "/login"} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

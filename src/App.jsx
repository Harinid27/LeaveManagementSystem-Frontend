import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";

// Pages
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import PrincipalDashboardPage from "./pages/PrincipalDashboardPage.jsx";
import HodDashboardPage from "./pages/HodDashboardPage.jsx";
import ProfessorDashboardPage from "./pages/ProfessorDashboardPage.jsx";
import StudentDashboardPage from "./pages/StudentDashboardPage.jsx";
import UserManagementPage from "./pages/UserManagementPage.jsx";
import LeaveManagementPage from "./pages/LeaveManagementPage.jsx";
import PendingApprovalsPage from "./pages/PendingApprovalsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import HODManagementPage from "./pages/HODManagementPage.jsx";
import HierarchyViewPage from "./pages/HierarchyViewPage.jsx";
import AnalyticsDashboardPage from "./pages/AnalyticsDashboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AllUsersPage from "./pages/AllUsersPage.jsx";
import CreateProfessor from "./pages/CreateProfessor.jsx";
import ManageStaff from "./pages/ManageStaff.jsx";
import HodMyLeaves from "./pages/HodMyLeaves.jsx";

// Professor Pages
import ManageStudents from "./pages/ManageStudents.jsx";
import CreateStudent from "./pages/CreateStudent.jsx";
import StudentLeaveRequests from "./pages/StudentLeaveRequests.jsx";
import ProfMyLeaves from "./pages/ProfMyLeaves.jsx";
import StudentMyLeaves from "./pages/StudentMyLeaves.jsx";

const roleHomeMap = {
  principal: "/principal-dashboard",
  hod: "/hod-dashboard",
  professor: "/prof-dashboard",
  student: "/student-dashboard"
};

function App() {
  const { user, ready } = useAuth();
  const defaultAuthedPath = user ? roleHomeMap[user.role] || "/login" : "/login";

  if (!ready) {
    return null;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
      <Route path="/login" element={user ? <Navigate to={defaultAuthedPath} replace /> : <LoginPage />} />
      <Route path="/signup" element={user && user.role !== 'principal' && user.role !== 'hod' && user.role !== 'professor' ? <Navigate to={defaultAuthedPath} replace /> : <SignupPage />} />
      
      {/* Principal Routes */}
      <Route element={<ProtectedRoute allowedRoles={["principal"]} />}>
        <Route path="/principal-dashboard" element={<PrincipalDashboardPage />} />
        <Route path="/hod-management" element={<HODManagementPage />} />
        <Route path="/hierarchy" element={<HierarchyViewPage />} />
        <Route path="/analytics" element={<AnalyticsDashboardPage />} />
        <Route path="/users" element={<AllUsersPage />} />
      </Route>

      {/* HOD Routes */}
      <Route element={<ProtectedRoute allowedRoles={["hod"]} />}>
        <Route path="/hod-dashboard" element={<HodDashboardPage />} />
        <Route path="/manage-staff" element={<ManageStaff />} />
        <Route path="/manage-staff/create" element={<CreateProfessor />} />
        <Route path="/leaves/my" element={<HodMyLeaves />} />
      </Route>

      {/* Professor Routes */}
      <Route element={<ProtectedRoute allowedRoles={["professor"]} />}>
        <Route path="/prof-dashboard" element={<ProfessorDashboardPage />} />
        <Route path="/prof/students" element={<ManageStudents />} />
        <Route path="/prof/students/create" element={<CreateStudent />} />
        <Route path="/prof/student-leaves" element={<StudentLeaveRequests />} />
        <Route path="/prof/my-leaves" element={<ProfMyLeaves />} />
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student-dashboard" element={<StudentDashboardPage />} />
      </Route>

      {/* Shared Authenticated Routes */}
      <Route element={<ProtectedRoute allowedRoles={["principal", "hod", "professor", "student"]} />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/leaves" element={user?.role === 'student' ? <StudentMyLeaves /> : <LeaveManagementPage />} />
        <Route path="/users" element={<UserManagementPage />} />
      </Route>

      {/* Shared Approver Routes */}
      <Route element={<ProtectedRoute allowedRoles={["principal", "hod", "professor"]} />}>
        <Route path="/pending-approvals" element={<PendingApprovalsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={defaultAuthedPath} replace />} />
    </Routes>
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { leaveService } from "../services/leaveService.js";
import { userService } from "../services/userService.js";
import StatCard from "../components/StatCard.jsx";

const dashboardCopy = {
  principal: "Approve HOD leave requests, monitor institution-wide activity, and create department leaders.",
  hod: "Manage professors in your department and clear the next level of approvals.",
  professor: "Create students, approve their leave requests, and keep class planning predictable.",
  student: "Apply for leave, track approval status, and monitor your balance."
};

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, myLeaves: 0, pendingApprovals: 0 });

  useEffect(() => {
    const load = async () => {
      const [usersData, myLeavesData, pendingData] = await Promise.all([
        userService.getUsers(),
        leaveService.myLeaves(),
        leaveService.pendingLeaves()
      ]);

      setStats({
        totalUsers: usersData.users.length,
        myLeaves: myLeavesData.leaves.length,
        pendingApprovals: pendingData.leaves.length
      });
    };

    load().catch(() => {});
  }, []);

  return (
    <section className="page">
      <div className="hero">
        <div className="panel">
          <p className="eyebrow">{user?.role} dashboard</p>
          <h2>Approval flow stays dynamic through `reportingTo`.</h2>
          <p>{dashboardCopy[user?.role]}</p>
        </div>
        <div className="balance-card">
          <h3>Leave Balance</h3>
          <p>Casual: {user?.leaveBalance?.casualLeave ?? 0}</p>
          <p>Sick: {user?.leaveBalance?.sickLeave ?? 0}</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Visible Users" value={stats.totalUsers} />
        <StatCard label="My Leave Requests" value={stats.myLeaves} accent="var(--success)" />
        <StatCard label="Pending Approvals" value={stats.pendingApprovals} accent="var(--warning)" />
      </div>
    </section>
  );
}

export default DashboardPage;

import { useEffect, useState } from "react";
import PrincipalLayout from "../components/PrincipalLayout.jsx";
import { leaveService } from "../services/leaveService.js";
import { userService } from "../services/userService.js";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  Filler
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Users, 
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2
} from "lucide-react";
import LoadingState from "../components/LoadingState.jsx";

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  Filler
);

const AnalyticsDashboardPage = () => {
  const [leaveStats, setLeaveStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [leaveRes, userRes] = await Promise.all([
          leaveService.analytics(),
          userService.getSummary()
        ]);
        setLeaveStats(leaveRes);
        setUserStats(userRes.summary);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingState label="Analyzing institutional data..." />;

  const leaveStatusData = {
    labels: ["Approved", "Rejected", "Pending"],
    datasets: [{
      data: [
        leaveStats?.totals?.approvedLeaves || 0,
        leaveStats?.totals?.rejectedLeaves || 0,
        leaveStats?.totals?.pendingLeaves || 0
      ],
      backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
      borderWidth: 0,
      hoverOffset: 15
    }]
  };

  const userDistributionData = {
    labels: ["HODs", "Professors", "Students"],
    datasets: [{
      label: "Institutional Roles",
      data: [
        userStats?.hod || 0,
        userStats?.professor || 0,
        userStats?.student || 0
      ],
      backgroundColor: ["#6366f1", "#3b82f6", "#10b981"],
      borderRadius: 12,
      maxBarThickness: 50
    }]
  };

  const departmentData = {
    labels: leaveStats?.departmentBreakdown?.map(d => d.department) || [],
    datasets: [{
      label: "Leaves per Department",
      data: leaveStats?.departmentBreakdown?.map(d => d.total) || [],
      backgroundColor: "#6366f1",
      borderRadius: 12
    }]
  };

  return (
    <PrincipalLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Institutional Analytics</h1>
          <p className="text-gray-500 mt-1">Detailed overview of leave patterns and user distribution across the institution.</p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-16 h-16" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Leaves</p>
            </div>
            <div className="flex items-end gap-3">
              <h2 className="text-4xl font-bold text-gray-900">{leaveStats?.totals?.totalLeaves || 0}</h2>
              <span className="mb-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +12%
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Approval Rate</p>
            </div>
            <div className="flex items-end gap-3">
              <h2 className="text-4xl font-bold text-gray-900">
                {leaveStats?.totals?.totalLeaves ? Math.round((leaveStats.totals.approvedLeaves / leaveStats.totals.totalLeaves) * 100) : 0}%
              </h2>
               <span className="mb-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full flex items-center gap-1">
                Institutional
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Users className="w-16 h-16" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Layers className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Staff & Students</p>
            </div>
            <div className="flex items-end gap-3">
              <h2 className="text-4xl font-bold text-gray-900">{(userStats?.hod || 0) + (userStats?.professor || 0) + (userStats?.student || 0)}</h2>
               <span className="mb-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full flex items-center gap-1">
                Active Users
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leave Status Pie Chart */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 border-l-4 border-indigo-500 pl-4">Leave Status Distribution</h3>
              <PieChartIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-[300px] flex items-center justify-center">
              <Pie 
                data={leaveStatusData} 
                options={{ 
                  plugins: { legend: { position: "bottom", labels: { usePointStyle: true, padding: 20 } } },
                  maintainAspectRatio: false 
                }} 
              />
            </div>
          </div>

          {/* User Role Bar Chart */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-500 pl-4">User Role Distribution</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-[300px]">
              <Bar 
                data={userDistributionData} 
                options={{ 
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } },
                  maintainAspectRatio: false 
                }} 
              />
            </div>
          </div>

          {/* Department Bar Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">Leaves per Department</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-[350px]">
              <Bar 
                data={departmentData} 
                options={{ 
                  plugins: { legend: { display: false } },
                  indexAxis: "y",
                  scales: { x: { beginAtZero: true, grid: { display: false } }, y: { grid: { display: false } } },
                  maintainAspectRatio: false 
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </PrincipalLayout>
  );
};

export default AnalyticsDashboardPage;

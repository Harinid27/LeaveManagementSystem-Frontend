import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { userService } from "../services/userService.js";
import { leaveService } from "../services/leaveService.js";
import { 
  Users, 
  UserSquare2, 
  GraduationCap, 
  ClipboardList,
  ArrowUpRight,
  Clock,
  UserPlus
} from "lucide-react";
import LoadingState from "../components/LoadingState.jsx";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon: Icon, color, detail }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <ArrowUpRight className="w-3 h-3" />
        Live
      </span>
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {detail && <p className="text-xs text-gray-400 mt-1">{detail}</p>}
    </div>
  </div>
);

const PrincipalDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, leavesRes, activityRes] = await Promise.all([
          userService.getSummary(),
          leaveService.pendingLeaves(),
          userService.getActivities()
        ]);
        setStats(summaryRes.summary);
        setPendingLeaves(leavesRes.leaves || []);
        setActivities(activityRes.activities || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingState label="Preparing your dashboard..." />;

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Institutional Overview</h1>
            <p className="text-gray-500 mt-1">Manage departments, hierarchy, and final leave approvals.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/manage-staff/create" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all text-sm">
              Add HOD
            </Link>
            <Link to="/pending-approvals" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all text-sm">
              Review Leaves
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total HODs" 
            value={stats?.hod || 0} 
            icon={UserSquare2} 
            color="bg-indigo-600"
            detail="Department heads"
          />
          <StatCard 
            title="Total Professors" 
            value={stats?.professor || 0} 
            icon={Users} 
            color="bg-blue-500"
            detail="Teaching staff"
          />
          <StatCard 
            title="Total Students" 
            value={stats?.student || 0} 
            icon={GraduationCap} 
            color="bg-emerald-500"
            detail="Enrolled students"
          />
          <StatCard 
            title="Pending Leaves" 
            value={pendingLeaves.length} 
            icon={ClipboardList} 
            color="bg-amber-500"
            detail="Awaiting approval"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Leave Requests Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-500" />
                Recent Leave Requests
              </h2>
              <Link to="/pending-approvals" className="text-sm font-medium text-indigo-600 hover:underline">View All</Link>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm h-full max-h-[400px] flex flex-col">
              {pendingLeaves.length > 0 ? (
                <div className="divide-y divide-gray-50 overflow-y-auto">
                  {pendingLeaves.map((leave) => (
                    <div key={leave._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold group-hover:scale-110 transition-transform flex-shrink-0">
                          {leave.userId?.name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{leave.userId?.name}</p>
                          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest truncate">{leave.leaveType} • {new Date(leave.fromDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Link to={`/pending-approvals`} className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0">
                        <ArrowUpRight className="w-5 h-5" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center h-full">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="text-sm font-bold text-gray-500">No Pending Requests</p>
                  <p className="text-xs mt-1">Everything is up to date.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recently Created Users Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                Recently Created Users
              </h2>
              <Link to="/hod-management" className="text-sm font-medium text-emerald-600 hover:underline">Manage All</Link>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm h-full max-h-[400px] flex flex-col">
              {activities.filter(a => a.action === 'user_creation').length > 0 ? (
                <div className="divide-y divide-gray-50 overflow-y-auto">
                  {activities.filter(a => a.action === 'user_creation').map((activity) => (
                    <div key={activity._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold flex-shrink-0">
                          <UserSquare2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{activity.description.replace('Created a new ', '')}</p>
                          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{new Date(activity.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center h-full">
                  <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-10" />
                  <p className="text-sm font-bold text-gray-500">No Recent User Activity</p>
                  <p className="text-xs mt-1">New users will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PrincipalDashboardPage;

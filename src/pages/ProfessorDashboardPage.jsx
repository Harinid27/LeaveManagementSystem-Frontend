import { useEffect, useState } from "react";
import { 
  Users, 
  UserPlus, 
  ClipboardList, 
  TrendingUp, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  GraduationCap
} from "lucide-react";
import { Link } from "react-router-dom";
import { userService } from "../services/userService.js";
import LoadingState from "../components/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import AppLayout from "../components/AppLayout.jsx";

const StatCard = ({ icon: Icon, label, value, color, description }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-lg">
        <TrendingUp className="w-3 h-3" />
        Live
      </div>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-xs text-gray-500 mt-2">{description}</p>
  </div>
);

function ProfessorDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, activityRes] = await Promise.allSettled([
          userService.getSummary(),
          userService.getActivities()
        ]);

        if (summaryRes.status === 'fulfilled') setStats(summaryRes.value.summary);
        if (activityRes.status === 'fulfilled') setActivities(activityRes.value.activities || []);
        
        if (summaryRes.status === 'rejected') setError("Failed to load summary stats.");
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingState label="Loading your workspace..." />;

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold text-sm">
            <XCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Professor Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back, <span className="text-indigo-600 font-semibold">{user?.name}</span>. 
              Managing students in <span className="font-medium text-gray-700">{user?.department}</span> department.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/prof/students/create" 
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all text-sm"
            >
              <UserPlus className="w-5 h-5" />
              Enroll Student
            </Link>
          </div>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={GraduationCap} 
            label="Total Students" 
            value={stats?.student || 0} 
            color="bg-indigo-500" 
            description="Students reporting to you"
          />
          <StatCard 
            icon={ClipboardList} 
            label="Pending Leaves" 
            value={stats?.pendingLeaves || 0} 
            color="bg-amber-500" 
            description="Leaves awaiting your approval"
          />
          <StatCard 
            icon={CheckCircle2} 
            label="Approved Leaves" 
            value={stats?.approvedLeaves || 0} 
            color="bg-emerald-500" 
            description="Total students' leaves approved"
          />
          <StatCard 
            icon={XCircle} 
            label="Rejected Leaves" 
            value={stats?.rejectedLeaves || 0} 
            color="bg-red-500" 
            description="Total students' leaves rejected"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center text-indigo-600">
                  <Users className="w-12 h-12" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Directory</h2>
                  <p className="text-gray-500 mb-6 max-w-md">Access, manage and organize all student profiles connected to your personnel profile.</p>
                  <Link to="/prof/students" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold inline-flex items-center gap-2 hover:bg-indigo-700 transition-all hover:gap-3">
                    Open Management <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-amber-100 flex items-center justify-center text-amber-600">
                  <ClipboardList className="w-12 h-12" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Leave Approvals</h2>
                  <p className="text-gray-500 mb-6 max-w-md">You have <span className="font-bold text-amber-600">{stats?.pendingLeaves || 0}</span> pending requests that need your immediate attention.</p>
                  <Link to="/prof/student-leaves" className="px-6 py-3 bg-amber-500 text-white rounded-2xl font-bold inline-flex items-center gap-2 hover:bg-amber-600 transition-all hover:gap-3">
                    Review Requests <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link to="/prof/my-leaves" className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 text-indigo-900 hover:bg-indigo-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold">Apply My Leave</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/profile" className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 text-gray-900 hover:bg-gray-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="font-bold">My Profile</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
              <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                {activities.length > 0 ? activities.slice(0, 5).map((activity, idx) => (
                  <div key={activity._id} className="relative pl-8 group">
                    <div className={`absolute left-0 top-1 w-6 h-6 bg-white border-2 rounded-full flex items-center justify-center transition-colors ${idx === 0 ? 'border-indigo-500' : 'border-gray-200'}`}>
                      <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
                    </div>
                    <p className="text-sm font-bold text-gray-800 capitalize leading-none">{activity.action.replace(/_/g, ' ')}</p>
                    <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{activity.description}</p>
                    <span className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-tighter mt-2 block">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )) : (
                  <div className="py-10 text-center flex flex-col items-center justify-center">
                    <Clock className="w-8 h-8 text-gray-200 mb-2" />
                    <p className="text-xs font-bold text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default ProfessorDashboardPage;
